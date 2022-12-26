import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import { NewKeywordDto } from '@/keywords/dto/new-keyword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  defaultKeywordValue,
  IKeyword,
  Keyword,
  KeywordDocument,
  Language,
} from '@/keywords/schemas/keyword.schema';
import File from '@/AllConcepts.json';
import { Action } from '@/keywords/types';
import { RankKeywordDto } from '@/keywords/dto/get-keyword.dto';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keyword.name) private readonly model: Model<KeywordDocument>,
  ) {}

  async init(): Promise<void> {
    // he: {
    //     keyword: 'mada',
    //     short: 'short',
    //     long: 'long',
    // };

    for (let i = 0; i < File.length - 1; i++) {
      const newKeyword = new NewKeywordDto();
      console.log("work");
      newKeyword.he = {
        keyword: File[i].conceptName.hebrew,
        short: File[i].shortDefinition.hebrew,
        long: File[i].longDefinition.hebrew,
        isAuthorized: true,
        likes: [],
        dislikes: [],
      };

      // TODO: add for newKeyword.en

      //   TODO: add for newKeyword.ar

      //   TODO: save await new this.model(newKeyword).save();
    }
  }

  async addKeyword(keywordDto: NewKeywordDto): Promise<Keyword> {
    // validate language
    // this.validateLanguage(keywordDto.language);
    const keyword = await this.findKeyword(keywordDto);
    // if keyword already exists, throw error
    if (keyword) {
      throw new HttpException('Keyword already exists', HttpStatus.BAD_REQUEST);
    }
    return await new this.model(keywordDto).save();
  }

  async getPendingForApproval(filter: Language | null): Promise<Keyword[]> {
    // filter by language if provided
    if (filter) {
      this.validateLanguage(filter);
      return await this.model
        .find()
        .where(`${filter}.isAuthorized`)
        .equals(false)
        .exec();
    }
    return await this.model
      .find()
      .or([
        { 'he.isAuthorized': false },
        { 'en.isAuthorized': false },
        { 'ar.isAuthorized': false },
      ])
      .exec();
  }

  async getKeyword(keyword: string): Promise<Keyword[]> {
    return await this.model
      .find({
        $or: [
          { 'he.keyword': { $regex: keyword } },
          { 'en.keyword': { $regex: keyword } },
          { 'ar.keyword': { $regex: keyword } },
        ],
      })
      .exec();
  }

  async like(rankDto: RankKeywordDto, userId: string): Promise<Keyword> {
    const keyword = await this.model.findById(rankDto.id).exec();

    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }
    const isRated = await this.checkIfUserRated(
      rankDto,
      keyword,
      userId,
      Action.LIKE,
    );

    if (isRated) {
      return await this.model.findById(rankDto.id).exec();
    }

    const lang = this.getLangById(keyword, rankDto.langId);
    if (!lang) {
      throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
    }

    keyword[lang].likes.push(userId);
    await keyword.save();

    return keyword;
  }

  async dislike(rankDto: RankKeywordDto, userId: string): Promise<Keyword> {
    const keyword = await this.model.findById(rankDto.id).exec();

    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }
    const isRated = await this.checkIfUserRated(
      rankDto,
      keyword,
      userId,
      Action.DISLIKE,
    );

    if (isRated) {
      return await this.model.findById(rankDto.id).exec();
    }

    const lang = this.getLangById(keyword, rankDto.langId);
    if (!lang) {
      throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
    }

    keyword[lang].dislikes.push(userId);
    await keyword.save();

    return keyword;
  }

  async authorizeKeyword(rankDto: RankKeywordDto): Promise<Keyword> {
    const keyword = await this.model.findById(rankDto.id).exec();
    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }
    const lang = this.getLangById(keyword, rankDto.langId);
    if (!lang) {
      throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
    }
    if (keyword[lang].isAuthorized) {
      throw new HttpException(
        'Keyword already authorized',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!keyword[lang].keyword) {
      throw new HttpException(
        'Keyword cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    keyword[lang].isAuthorized = true;
    await keyword.save();
    return keyword;
  }

  // Language validator
  private validateLanguage(lang: Language): boolean {
    const isValidLang = Object.values(Language).includes(lang);
    if (!isValidLang) {
      throw new HttpException('Invalid lang', HttpStatus.BAD_REQUEST);
    }
    return isValidLang;
  }

  private getLangById(keyword: Keyword, langId: string): Language {
    return Object.values(Language).find((lang) => {
      if (keyword[lang]._id.toString() === langId) {
        return lang;
      }
    });
  }

  private async findKeyword(keyword: NewKeywordDto): Promise<Keyword> {
    const cloneKeyword = _.cloneDeep(keyword);
    const defaultValueClone = _.cloneDeep(defaultKeywordValue);
    if (!keyword.he) {
      cloneKeyword.he = defaultValueClone;
      cloneKeyword.he.keyword = '';
    }
    if (!keyword.en) {
      cloneKeyword.en = defaultValueClone;
      cloneKeyword.en.keyword = '';
    }
    if (!keyword.ar) {
      cloneKeyword.ar = defaultValueClone;
      cloneKeyword.ar.keyword = '';
    }

    return await this.model
      .findOne({
        $or: [
          { 'he.keyword': cloneKeyword.he.keyword },
          { 'en.keyword': cloneKeyword.en.keyword },
          { 'ar.keyword': cloneKeyword.ar.keyword },
        ],
      })
      .exec();
  }

  private async checkIfUserRated(
    rankDto: RankKeywordDto,
    keyword: Keyword,
    userId: string,
    action,
  ): Promise<boolean> {
    for (const lang of Object.values(Language)) {
      if (!keyword[lang]._id) {
        throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
      }
      if (keyword[lang]._id.toString() === rankDto.langId) {
        if (
          (keyword[lang].likes.includes(userId) && action === Action.DISLIKE) ||
          (keyword[lang].dislikes.includes(userId) && action === Action.LIKE)
        ) {
          throw new BadRequestException({ message: 'User already rated' });
        }

        if (keyword[lang].likes.includes(userId) && action === Action.LIKE) {
          await this.model.findOneAndUpdate(
            {
              _id: rankDto.id,
            },
            {
              $pull: { [`${lang}.likes`]: userId },
            },
          );
          return true;
        }

        if (
          keyword[lang].dislikes.includes(userId) &&
          action === Action.DISLIKE
        ) {
          await this.model.findOneAndUpdate(
            {
              _id: rankDto.id,
            },
            {
              $pull: { [`${lang}.dislikes`]: userId },
            },
          );
          return true;
        }
      }
    }
    return false;
  }
}

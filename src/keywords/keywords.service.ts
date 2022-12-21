import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  NewKeywordDto,
  ResponseKeywordDto,
} from '@/keywords/dto/new-keyword.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Keyword,
  KeywordDocument,
  Language,
} from '@/keywords/schemas/keyword.schema';
import { Action } from '@/keywords/types';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keyword.name) private readonly model: Model<KeywordDocument>,
  ) {}

  async addKeyword(keywordDto: NewKeywordDto): Promise<ResponseKeywordDto> {
    // validate language
    this.validateLanguage(keywordDto.language);

    const keyword = await this.findKeyword(keywordDto.keyword);

    // if keyword already exists, throw error
    if (keyword) {
      throw new HttpException('Keyword already exists', HttpStatus.BAD_REQUEST);
    }
    return await new this.model(keywordDto).save();
  }

  async getPendingForApproval(
    filter: Language | null,
  ): Promise<ResponseKeywordDto[]> {
    // filter by language if provided
    if (filter) {
      this.validateLanguage(filter);
      return await this.model
        .find({ language: filter, isAuthorized: false })
        .exec();
    }
    return await this.model.find({ isAuthorized: false }).exec();
  }

  async getKeyword(keyword: string): Promise<ResponseKeywordDto[]> {
    return await this.model.find({ keyword: { $regex: keyword } }).exec();
  }

  async like(id: string, userId: string): Promise<ResponseKeywordDto> {
    const isRated = await this.checkIfUserRated(id, userId, Action.LIKE);
    const keyword = await this.model.findById(id);
    if (isRated) {
      return keyword;
    }
    keyword.likes.push(userId);
    keyword.save();
    return keyword;
  }

  async dislike(id: string, userId: string): Promise<ResponseKeywordDto> {
    const isRated = await this.checkIfUserRated(id, userId, Action.DISLIKE);
    const keyword = await this.model.findById(id);
    if (isRated) {
      return keyword;
    }
    keyword.dislikes.push(userId);
    keyword.save();
    return keyword;
  }

  async authorizeKeyword(id: string): Promise<ResponseKeywordDto> {
    const keyword = await this.model.findById(id);
    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }
    if (keyword.isAuthorized) {
      throw new HttpException(
        'Keyword already authorized',
        HttpStatus.BAD_REQUEST,
      );
    }
    keyword.isAuthorized = true;
    keyword.save();
    return keyword;
  }

  private async findKeyword(keyword: string): Promise<Keyword> {
    return await this.model.findOne({ keyword }).exec();
  }

  // Language validator
  private validateLanguage(lang: Language): boolean {
    const isValidLang = Object.values(Language).includes(lang);
    if (!isValidLang) {
      throw new HttpException('Invalid lang', HttpStatus.BAD_REQUEST);
    }
    return isValidLang;
  }

  private async checkIfUserRated(
    id: string,
    userId: string,
    action,
  ): Promise<boolean> {
    let keyword = await this.model.findById(id);
    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }

    keyword = await this.model.findOne({
      _id: id,
      $or: [{ likes: userId }, { dislikes: userId }],
    });

    if (
      keyword &&
      ((keyword.likes.includes(userId) && action === Action.DISLIKE) ||
        (keyword.dislikes.includes(userId) && action === Action.LIKE))
    ) {
      return true;
    }

    if (keyword) {
      if (keyword.likes.includes(userId) && action === Action.LIKE) {
        await this.model.updateOne({
          _id: id,
          $pull: { likes: userId },
        });
        return true;
      }

      if (keyword.dislikes.includes(userId) && action === Action.DISLIKE) {
        await this.model.updateOne({
          _id: id,
          $pull: { dislikes: userId },
        });
        return true;
      }
    }
    return false;
  }
}

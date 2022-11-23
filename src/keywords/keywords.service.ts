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

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keyword.name) private readonly model: Model<KeywordDocument>,
  ) {}

  async addKeyword(keywordDto: NewKeywordDto): Promise<ResponseKeywordDto> {
    this.validateLanguage(keywordDto.language);
    const keyword = await this.findKeyword(keywordDto.keyword);
    if (keyword) {
      throw new HttpException('Keyword already exists', HttpStatus.BAD_REQUEST);
    }
    return await new this.model(keywordDto).save();
  }

  async getPendingForApproval(
    filter: Language | null,
  ): Promise<ResponseKeywordDto[]> {
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

  private async findKeyword(keyword: string): Promise<Keyword> {
    return await this.model.findOne({ keyword }).exec();
  }

  private validateLanguage(lang: Language): boolean {
    const isValidLang = Object.values(Language).includes(lang);
    if (!isValidLang) {
      throw new HttpException('Invalid lang', HttpStatus.BAD_REQUEST);
    }
    return isValidLang;
  }
}

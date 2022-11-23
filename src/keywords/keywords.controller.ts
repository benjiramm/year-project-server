import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KeywordsService } from '@/keywords/keywords.service';
import {
  NewKeywordDto,
  ResponseKeywordDto,
} from '@/keywords/dto/new-keyword.dto';
import { SearchKeywordDto } from '@/keywords/dto/get-keyword.dto';

@ApiTags('Keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add new keyword' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  addKeyword(@Body() keywordDto: NewKeywordDto) {
    return this.keywordsService.addKeyword(keywordDto);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get Pending for approvals' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  getPendingKeywords(@Query() query) {
    const { lang } = query;
    return this.keywordsService.getPendingForApproval(lang);
  }

  @Post('search')
  @ApiOperation({ summary: 'Get Pending for approvals' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  getKeyword(@Body() searchDto: SearchKeywordDto) {
    return this.keywordsService.getKeyword(searchDto.keyword);
  }
}

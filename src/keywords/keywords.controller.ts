import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeywordsService } from '@/keywords/keywords.service';
import {
  NewKeywordDto,
  ResponseKeywordDto,
} from '@/keywords/dto/new-keyword.dto';
import { RankKeywordDto } from '@/keywords/dto/get-keyword.dto';
import { AdminGuard, JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Language } from '@/keywords/schemas/keyword.schema';
import { KeywordParamGuard } from '@/keywords/keywords.guard';

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
  @ApiQuery({ name: 'lang', enum: Language, required: false })
  @ApiOperation({ summary: 'Get Pending for approvals' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  getPendingKeywords(@Query() query) {
    const { lang } = query;
    return this.keywordsService.getPendingForApproval(lang);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search keyword' })
  @ApiQuery({ name: 'keyword', required: true })
  @UseGuards(KeywordParamGuard)
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  getKeyword(@Query() query) {
    const { keyword } = query;
    return this.keywordsService.getKeyword(keyword);
  }

  @Post('like')
  @ApiOperation({ summary: 'Like meaning' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  like(@Req() req, @Body() rankDto: RankKeywordDto) {
    return this.keywordsService.like(rankDto, req.user.id);
  }

  @Post('dislike')
  @ApiOperation({ summary: 'Dislike meaning' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  dislike(@Req() req, @Body() rankDto: RankKeywordDto) {
    return this.keywordsService.dislike(rankDto, req.user.id);
  }

  @Post('authorize-keyword')
  @ApiOperation({ summary: 'Authorize keyword' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  authorizeKeyword(@Req() req, @Body() rankDto: RankKeywordDto) {
    return this.keywordsService.authorizeKeyword(rankDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeywordsService } from '@/keywords/keywords.service';
import {
  NewKeywordDto,
  ResponseKeywordDto,
} from '@/keywords/dto/new-keyword.dto';
import {
  RankKeywordDto,
  SearchKeywordDto,
} from '@/keywords/dto/get-keyword.dto';
import { AdminGuard, JwtAuthGuard } from '@/auth/jwt-auth.guard';

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

  @Post('like')
  @ApiOperation({ summary: 'Like meaning' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  like(@Req() req, @Body() rankDto: RankKeywordDto) {
    return this.keywordsService.like(rankDto.id, req.user.id);
  }

  @Post('dislike')
  @ApiOperation({ summary: 'Dislike meaning' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  dislike(@Req() req, @Body() rankDto: RankKeywordDto) {
    return this.keywordsService.dislike(rankDto.id, req.user.id);
  }

  @Get('authorize-keyword/:id')
  @ApiOperation({ summary: 'Authorize keyword' })
  @ApiResponse({ status: 200, type: ResponseKeywordDto })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  authorizeKeyword(@Param('id') id: string) {
    return this.keywordsService.authorizeKeyword(id);
  }
}

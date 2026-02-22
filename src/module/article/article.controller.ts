import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer"
import path from 'path';
import { CreateSwaggerArticleDTo } from './dto/create-swagger.article.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/shared/constant/user.role';
import { QueryDto } from './dto/query.dto';

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("Article")
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN)
  @ApiOperation({description: "Create article api (public)"})
  @ApiConsumes("multipart/form-data")
  @ApiBody({type: CreateSwaggerArticleDTo})
  @ApiCreatedResponse({description: "created"})
  @UseInterceptors(
    FileInterceptor("file", {
       storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const unquieName = `${file.fieldname}${Math.random() * 1e9}`
          const ext = path.extname(file.originalname)
          cb(null, `${unquieName}${ext}`)
        }
       })
    })
  )
  @Post()
  create(@Body() createArticleDto: CreateArticleDto,
   @UploadedFile() file:Express.Multer.File,
   @Req() req
  ) {
    return this.articleService.create(createArticleDto, file, req.user.id);
  }

  @ApiOperation({description: "get all articles api (public)"})
  @ApiOkResponse({description: "list of articles"})
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.articleService.findAll(query);
  }

  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN)
  @ApiOperation({description: "get my all articles api (owner)"})
  @ApiOkResponse({description: "list of articles"})
  @Get("getMyArticles")
  findMyAllArticles(@Req() req) {
    return this.articleService.findMYAllArticles(req.user.id);
  }

  @ApiOperation({description: "get one article api (public)"})
  @ApiNotFoundResponse({description: "Article not found"})
  @ApiOkResponse({description: "get one article"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  // @ApiOperation({description: "update article api (owner)"})
  // @ApiConsumes("multipart/form-data")
  // @ApiBody({type: CreateSwaggerArticleDTo})
  // @ApiNotFoundResponse({description: "Article not found"})
  // @ApiOkResponse({description: "updated"})
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
  //   return this.articleService.update(+id, updateArticleDto);
  // }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN)
  @ApiOperation({description: "delete article api (owner)"})
  @ApiNotFoundResponse({description: "Article not found"})
  @ApiOkResponse({description: "deleted"})
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.articleService.remove(+id, req.user.id);
  }
}

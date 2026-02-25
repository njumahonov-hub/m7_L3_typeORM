import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleImage } from './entities/article-image.entity';
import { Repository } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import { log } from 'console';

@Injectable()
export class ArticleImagesService {
  private readonly max_images: number = 10
  constructor(
    @InjectRepository(ArticleImage) private articleImageRepo: Repository<ArticleImage>,
    @InjectRepository(Article) private articleRepo: Repository<Article>
) {}
 async create(createArticleImageDto: CreateArticleImageDto, files: Express.Multer.File[]) {
   try {
    const foundedArticle =  await this.articleRepo.findOneBy({
       id: createArticleImageDto.articleId
    })
console.log(foundedArticle);

    if(!foundedArticle) throw new NotFoundException("Article not found");

      let foundedImages = await this.articleImageRepo.count({
        where: {article: {id: createArticleImageDto.articleId}}
      })

      if(foundedImages + files.length > this.max_images) 
        
        throw new BadRequestException("Limit has been exeded")


      let sortOrder: number =  foundedImages + 1
      let result: ArticleImage[] = []
       
       for(const file of files){
        const createImage = await this.articleImageRepo.create({
          url: `http://localhost:4001/uploads/${file.filename}`,
          sortOrder,
          article: {id: createArticleImageDto.articleId}
        })

        sortOrder ++
        result.push(await this.articleImageRepo.save(createImage))
       }
     
       return result;
   }catch (error) {
    throw new InternalServerErrorException(error.message)
   }
  }

  findAll() {
    return `This action returns all articleImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleImage`;
  }

  update(id: number, updateArticleImageDto: UpdateArticleImageDto) {
    return `This action updates a #${id} articleImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleImage`;
  }
}

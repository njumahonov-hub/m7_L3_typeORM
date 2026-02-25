import { InjectRepository } from "@nestjs/typeorm";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { In, Repository } from "typeorm";
import { Article } from "./entities/article.entity";
import { Tag } from "../tags/entities/tag.entity";
import { QueryDto } from "./dto/query.dto";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>
  ) {}
  async create(createArticleDto: CreateArticleDto, file: Express.Multer.File, userId: any){
    try {
      const tags = await this.tagRepo.findBy({
        id: In(createArticleDto.tags)
      })
      const article = this.articleRepo.create({
        ...createArticleDto,
        tags,
        author: userId
      });

      article.backgroundImage = `http://localhost:4001/uploads/${file.filename}`
      return await this.articleRepo.save(article);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queryDto: QueryDto) {
    try {
          const { page = 1, limit = 10, search } = queryDto;

    const queryBuilder = await this.articleRepo
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.tags", "tags")
      .leftJoinAndSelect("article.author", "author")
      .where("article.isActive = :isActive", { isActive: true })
      .andWhere("article.deleted_at IS NULL");

      if(search){
        queryBuilder.andWhere("(article.heading ILIKE :search OR article.body ILIKE :search OR tags.name ILIKE :search)", {
          search: `%${search}%`
        })
      }

      const total = await queryBuilder.getCount()

      const result = await queryBuilder.orderBy("article.created_at", "DESC")    
      .skip((page - 1) * limit)
      .take(limit)
      .getMany() 

       return  {
        next: total > (page * limit) ? {page: page + 1} : undefined,
        prev: total < 1 ? {page: page - 1, limit} : undefined,
        totalPage: Math.ceil(total/limit) ,
        result,
       }

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

    async findMYAllArticles(userId: any): Promise<Article[]> {
    try {

      const articles = await this.articleRepo.find({
        where: {author: userId},
        relations: ["author", "tags"]
      });
      return articles
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async findOne(id: number): Promise<Article> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      return foundedArticle;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async update(
  //   id: number,
  //   updateArticleDto: UpdateArticleDto,
  // ): Promise<{ message: string }> {
  //   try {
  //     const foundedArticle = await this.articleRepo.findOne({ where: { id } });

  //     if (!foundedArticle) throw new NotFoundException("article not found");

  //     await this.articleRepo.update(foundedArticle.id, updateArticleDto);
  //     return { message: "updated" };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async remove(id: number, userId: any): Promise<{ message: string }> {
    try {
      const foundedArticle = await this.articleRepo.findOne({ where: { id } });

      if (!foundedArticle) throw new NotFoundException("article not found");

      await this.articleRepo.softDelete(foundedArticle.id);
      return { message: "deleted" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}


import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Article } from '../entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(@InjectRepository(Article) private articleRepo: Repository<Article>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const articleId = +request.params.id

    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
        const article = await this.articleRepo.findOne(
            {
                where: {id: articleId},
                relations: ["author"]
            }
        )
        

        if(!article) throw new NotFoundException("article not found")

        if(article.author.id !== request["user"].id) throw new ForbiddenException()

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

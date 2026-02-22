import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagrepository: Repository<Tag> ) {}
async create(createTagDto: CreateTagDto, userId: any) {
   const foundedTeg = await this.tagrepository.findOne({where: {name: createTagDto.name}})

   if(foundedTeg) throw new BadRequestException("Teg name already exist")

    const tag = this.tagrepository.create({
      ...createTagDto,
      createdBy: userId
    })
    return this.tagrepository.save(tag)
  }

 async findAll() {
    return this.tagrepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}

import { Body } from '@nestjs/common';
import { BaseEntity } from "src/database/base.entity";
import { ArticleImage } from 'src/module/article-images/entities/article-image.entity';
import { Auth } from 'src/module/auth/entities/auth.entity';
import { Tag } from 'src/module/tags/entities/tag.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "article"})
export class Article extends BaseEntity {

    @Column({unique: true})
    heading: string

    @Column()
    body: string

    @Column()
    backgroundImage: string

    @Column({default: true})
    isActive: boolean

    @DeleteDateColumn()
    deleted_at: Date
    

    @ManyToOne(() => Auth, (user) => user.article, {cascade: false, })
    @JoinColumn({name: "author_id"})
    author: Auth

    @ManyToMany(() => Tag, (tag) => tag.articles)
    @JoinTable({name: "article_id"})
    tags: Tag[]

    @OneToMany(() => ArticleImage, (articleImage) => articleImage.article)
    images: ArticleImage[]
}

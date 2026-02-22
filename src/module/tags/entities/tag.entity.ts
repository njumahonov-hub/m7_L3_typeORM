import { BaseEntity } from "src/database/base.entity";
import { Article } from "src/module/article/entities/article.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity({name: "tags"})
export class Tag extends BaseEntity {
    @Column({unique: true})
    name: string

    @ManyToOne(() => Auth, (user) => user.tags)
    @JoinTable({name: "created_by"})
    createdBy: Auth

    
    @ManyToMany(() => Article, (article) => article.tags)
    articles: Article[]
}

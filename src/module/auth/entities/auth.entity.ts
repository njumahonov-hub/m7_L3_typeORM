import { BaseEntity } from "src/database/base.entity"
import { Article } from "src/module/article/entities/article.entity"
import { Tag } from "src/module/tags/entities/tag.entity"
import { UserRole } from "src/shared/constant/user.role"
import { Column,  Entity, OneToMany, } from "typeorm"

@Entity({name: "auth"})
export class Auth extends BaseEntity {

 @Column()
 username: string

 @Column()
 email: string

 @Column()
 password: string

 @Column({default: 0})
 otp: string

 @Column({type: "bigint"})
 otptime: number

 @Column({default: UserRole.USER})
 role: UserRole

 @OneToMany(() => Article, (article) => article.author)
 article: Article[]

 @OneToMany(() => Tag, (tag) => tag.createdBy)
 tags: Tag[]

}

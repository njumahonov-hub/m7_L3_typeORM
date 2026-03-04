import { BaseEntity } from "src/database/base.entity"
import { Article } from "src/module/article/entities/article.entity"
import { Tag } from "src/module/tags/entities/tag.entity"
import { UserRole } from "src/shared/constant/user.role"
import { Column,  Entity, OneToMany, } from "typeorm"

@Entity({name: "auth"})
export class Auth extends BaseEntity {

 @Column({nullable: true})
 username: string

 @Column()
 email: string

 @Column({nullable: true})
 password: string

 @Column({default: 0})
 otp: string

 @Column({type: "bigint"})
 otptime: number

 @Column({default: UserRole.USER})
 role: UserRole

////////////////

@Column({nullable: true})
firstname?: string

@Column({nullable: true})
lastname?: string

@Column({nullable: true})
profilPicture?: string

@Column({nullable: true})
accessToken?: string

@Column({nullable: true})
bio?: string


 @OneToMany(() => Article, (article) => article.author)
 article: Article[]

 @OneToMany(() => Tag, (tag) => tag.createdBy)
 tags: Tag[]

}


// # Core Passport and OAuth strategies
// npm i @nestjs/passport passport passport-github2 passport-google-oauth20 passport-jwt

// # JWT and Database (Mongoose) support
// npm i @nestjs/jwt @nestjs/mongoose mongoose

// # Developer types (for TypeScript support)
// npm i --save-dev @types/passport-github2 @types/passport-google-oauth20 @types/passport-jwt
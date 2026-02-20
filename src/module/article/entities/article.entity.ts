import { Body } from '@nestjs/common';
import { BaseEntity } from "src/database/base.entity";
import { Column, Entity } from "typeorm";

@Entity({name: "article"})
export class Article extends BaseEntity {

    @Column()
    heading: string

    @Column()
    body: string

    @Column()
    backgroundImage: string
}


import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt } from "class-validator";

export class CreateArticleImageDto {
    @IsInt()
    @Type(() => Number)
    @ApiProperty({default: 1})
    articleId: number

}

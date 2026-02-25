import { IsArray } from "class-validator";
import { CreateArticleImageDto } from "./create-article-image.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ArticleSwaggerImagesDto extends CreateArticleImageDto {
    
        @IsArray()
        @ApiProperty({
            type: "string",
            format: "binary",
            isArray: true
        })
        files: any[]
}
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsString } from "class-validator"

export class CreateAuthDto {
    @IsString({message: "string"})
    @ApiProperty({default: "username1111"})
    username: string

    @IsString()
    @IsEmail()
    @ApiProperty({default: "email1111@gmail.com"})
    email: string

    @IsString()
    @ApiProperty({default: "1111111"})
    password: string
}

export class LoginAuthDto { 
    @IsString()
    @IsEmail()
    @ApiProperty({default: "email1111@gmail.com"})
    email: string

    @IsString()
    @ApiProperty({default: "1111111"})
    password: string
}

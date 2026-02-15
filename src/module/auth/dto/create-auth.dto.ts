import { IsEmail, IsNumber, IsString } from "class-validator"

export class CreateAuthDto {
    @IsNumber()
    id: number

    @IsString({message: "string"})
    username: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    password: string
}

export class LoginAuthDto { 
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    password: string
}

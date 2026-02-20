import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { Transporter } from "./../../../node_modules/@types/nodemailer/index.d";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { Auth } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "njumahonov@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto): Promise<{message: string}> {
    try {
      const { username, email, password } = createAuthDto as any;
      const foundeduser = await this.authRepository.findOne({
        where: { email },
      });

      if (foundeduser) throw new BadRequestException("email already exist");

      const hashpas = await bcrypt.hash(password, 10);

      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "njumahonov@gmail.com",
        to: email,
        subject: "otp",
        text: "simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000;

      const user = this.authRepository.create({
        username,
        email,
        password: hashpas,
        otp: code,
        otptime: time,
      });

      await this.authRepository.save(user);

      return {message: "Registered"}
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verify(
    verifyAuthDto: VerifyAuthDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;
      const foundeduser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundeduser) throw new BadRequestException("user not found");

      const otpValidation = /^\d{6}$/.test(otp);

      if (!otpValidation) throw new BadRequestException("wrong otp validation");

      const time = Date.now();

      if (time > foundeduser.otptime) throw new BadRequestException("otp time expired");

      if (otp !== foundeduser.otp) throw new BadRequestException("wrong otp");

      await this.authRepository.update(foundeduser.id, {otp: " ", otptime: 0})

      const payload = { email: foundeduser.email, roles: foundeduser.role };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

     async login(loginAuthDto: LoginAuthDto): Promise<{message: string} | {token: string}> {
    const { email, password} = loginAuthDto as any
    const foundeduser = await this.authRepository.findOne({where: {email}})

    if(!foundeduser) throw new UnauthorizedException("email not found")

      const comp = await bcrypt.compare(password, foundeduser.password)


      if(comp) {
           const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "njumahonov@gmail.com",
        to: email,
        subject: "otp",
        text: "simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000;

      await this.authRepository.update(foundeduser.id, {otp: code, otptime: time})

      return {message: "otp sent, Please check your email"}
      } else {
        return {message: "wrong password"}
      }

    }

  //   async findAll(): Promise<Auth[]> {
  //     return await this.authModule.findAll()
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} auth`;
  //   }

  //   update(id: number, updateAuthDto: UpdateAuthDto) {
  //     return `This action updates a #${id} auth`;
  //   }

    async remove(id: number): Promise<boolean> {
      const foundeduser = await this.authRepository.findOne({
        where: { id },
      });

      if (!foundeduser) throw new BadRequestException("user not found");

      await this.authRepository.delete(+id)
      return true
    }
}

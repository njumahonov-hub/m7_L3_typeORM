import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
    @ApiOperation({description: "register user api (public)"})
    @ApiCreatedResponse({description: "registered"})
  @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

    @ApiOperation({description: "verify user api (public)"})
    @ApiNotFoundResponse({description: "user not found"})
    @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }
  
    @ApiOperation({description: "login user api (public)"})
    @ApiNotFoundResponse({description: "user not found"})
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }


  @ApiOperation({description: "delete auth api (owner)"})
  @ApiNotFoundResponse({description: "user not found"})
  @ApiOkResponse({description: "deleted"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

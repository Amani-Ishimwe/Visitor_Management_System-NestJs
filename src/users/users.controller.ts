

import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import { GetUser } from 'src/decorator/getUser.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload-dto';

@ApiTags('users')
//@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
    ){}

//register
//@Roles('ADMIN')
@ApiOperation({ summary: 'Register a new user' })
@ApiResponse({ status: 201, description: 'User registered successfully' })
@ApiBody({ type: CreateUserDto })
@Post('register')
 create(@Body() createUserDto: CreateUserDto){
    return this.usersService.create(createUserDto)
 }

 //login
 @ApiOperation({ summary: 'Login a user' })
 @ApiResponse({ status: 200, description: 'User logged in successfully' })
 @ApiBody({ type: LoginUserDto })
 @Post('login')
    login(@Body() createUserDto: CreateUserDto){
        return this.usersService.login(createUserDto)
    }

    //verification of user
@ApiOperation({ summary: 'Verify user email' })
@ApiResponse({ status: 200, description: 'User verified successfully' })
@ApiParam({ name: 'id', description: 'User ID' })
@ApiParam({ name: 'email', description: 'User email' })
@Get('verify/:id/:email')
async verifyUser(
  @Param('id') id: string,
  @Param('email') email: string,
) {
  return this.usersService.verifyUser(id, email);
}


@UseGuards(JwtAuthGuard)
@Roles('RECEPTIONIST')
@ApiConsumes('multipart/form-data')
@ApiBody({ type: FileUploadDto })
@Patch('fill/profile/:id')
@UseInterceptors(FileInterceptor('file'))
update(
  @GetUser() user: User,
  @UploadedFile() file: Express.Multer.File,
  @Param('id') userId: string
): Promise<User> {
  return this.usersService.update(userId, user, file);
}


//sending password request
@Roles('ADMIN', 'RECEPTIONIST')
@ApiOperation({ summary: 'Send password reset request' })
@ApiResponse({ status: 200, description: 'Password reset request sent' })
@ApiParam({ name: 'email', description: 'User email' })
@Get('/resetRequest/:email')
resetPasswordRequest(@Param('email') email:string){
    return this.usersService.resetPasswordRequest(email)
}


@ApiOperation({ summary: 'Verify OTP for password reset' })
@ApiResponse({ status: 200, description: 'OTP verified successfully' })
@ApiParam({ name: 'email', description: 'User email' })
@ApiParam({ name: 'otp', description: 'OTP code' })
@Get('/reset/verify/otp/:email/:otp')
verifyOTP(@Param('email') email: string,@Param('otp') otp:string){
    return this.usersService.verifyOTP(otp, email)
}

@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Reset password with new credentials' })
@ApiResponse({ status: 200, description: 'Password reset successfully' })
@ApiBody({ type: ResetPasswordDto })
@Patch('/reset/newPasswords')
  resetPassword(
    @GetUser() user: User,
    @Body() passwords: ResetPasswordDto,
  ): Promise<{ msg: string; loginUrl: string }> {
    return this.usersService.resetPasswordEmail(user, passwords);
  }

}


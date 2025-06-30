

import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from 'generated/prisma';
import { GetUser } from 'src/decorator/getUser.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorator/roles.decorator';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
    ){}

//register
@Roles('ADMIN')
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
 @ApiBody({ type: CreateUserDto })
 @Post('login')
    login(@Body() createUserDto: CreateUserDto){
        return this.usersService.login(createUserDto)
    }
@Roles('RECEPTIONIST')
@ApiOperation({ summary: 'Update user profile' })
@ApiResponse({ status: 200, description: 'User profile updated successfully' })
@ApiParam({ name: 'id', description: 'User ID' })
@Patch('fill/profile/:id')
update(
    @GetUser() user:User,
    @UploadedFile() file:Express.Multer.File,
    @Param('id') userId: string

):Promise<User>{
    return this.usersService.update(userId,user,file)
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


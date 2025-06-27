import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
      private readonly usersService: UsersService,
    ){}

//register
@Post('register')
 create(@Body() createUserDto: CreateUserDto){
    return this.usersService.create(createUserDto)
 }

 //login
 @Post('login')
    login(@Body() createUserDto: CreateUserDto){
        return this.usersService.login(createUserDto)
    }
}

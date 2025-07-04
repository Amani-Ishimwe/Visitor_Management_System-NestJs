import { EmailService } from './../email/email.service';
import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prismaService:DatabaseService,
    private readonly EmailService:EmailService
  ){}
 async create(createDepartmentDto: CreateDepartmentDto) {
    const savedDepartment = await this.prismaService.department.create({
       data: createDepartmentDto 
    })
   
    await this.EmailService.sendId(savedDepartment.email,savedDepartment,savedDepartment.id)
    return {createDepartmentDto:savedDepartment}
  }

  findAll() {
    return this.prismaService.department.findMany();
  }

  findOne(id: string) {
    return this.prismaService.department.findUnique({
      where:{id}
    });
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prismaService.department.update({
      where:{id},
      data:updateDepartmentDto
    });
  }

  remove(id: string) {
    return this.prismaService.department.delete({
      where:{id}
    });
  }
}

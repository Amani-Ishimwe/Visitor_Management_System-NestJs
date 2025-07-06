import { EmailService } from './../email/email.service';
import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prismaService:DatabaseService,
    private readonly EmailService:EmailService
  ){}
 async create(createDepartmentDto: CreateDepartmentDto):Promise<{department:Department}> {
    const savedDepartment = await this.prismaService.department.create({
       data: createDepartmentDto 
    })
   
    await this.EmailService.sendIdDepartment(savedDepartment.email,savedDepartment,savedDepartment.id)
    return {department:savedDepartment}
  }

   async findAll(page = 1, limit = 10): Promise<{ data: Department[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaService.department.findMany({
        skip,
        take: limit,
        include: { visits: true, users: true },
        orderBy: { createdAt: 'desc' }, 
      }),
      this.prismaService.department.count(),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    return this.prismaService.department.findUnique({
      where:{id},
      include: { visits: true, users: true },
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prismaService.department.update({
      where:{id},
      data:updateDepartmentDto
    });
  }

  async remove(id: string) {
    return this.prismaService.department.delete({
      where:{id}
    });
  }
}




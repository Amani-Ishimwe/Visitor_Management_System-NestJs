import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import { Visitor } from '@prisma/client';

@Injectable()
export class VisitorsService {
  constructor(
    private readonly prismaService:DatabaseService,
    private readonly emailService:EmailService
  ){}
  async create(
    dto: CreateVisitorDto
  ):Promise<{visitor:Visitor}> {
    const visitor = await this.prismaService.visitor.findUnique({
      where:{email:dto.email}
    })
    if(visitor){
      throw new BadRequestException("User Already Exists")
    }
  
  const savedVisitor = await this.prismaService.visitor.create({
    data:{
      firstName:dto.firstName,
      lastName:dto.lastName,
      email:dto.email,
      phone:dto.phone
    }
  })
  await this.emailService.sendId(savedVisitor.email,savedVisitor,savedVisitor.id)
  return {visitor:savedVisitor}
  }
  async findAll():Promise<Visitor[]> {
    return this.prismaService.visitor.findMany();
  }

  async findOne(id: string) {
    const visitor = await this.prismaService.visitor.findUnique({
      where:{id}
    })
    return visitor;
  }

 /* update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }*/
}

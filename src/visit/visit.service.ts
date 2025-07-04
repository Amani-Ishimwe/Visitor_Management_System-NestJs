import { Injectable } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VisitService {
  constructor(
  private readonly prismaService:DatabaseService
  ){}
async create(createVisitDto: CreateVisitDto) {
  return this.prismaService.visit.create({
    data: {
      purpose: createVisitDto.purpose,
      status: createVisitDto.status ?? 'ACTIVE', // default if not given
      entryTime: createVisitDto.entryTime ? new Date(createVisitDto.entryTime) : undefined,
      exitTime: createVisitDto.exitTime ? new Date(createVisitDto.exitTime) : undefined,
      visitor: {
        connect: {
          id: createVisitDto.visitorId,
        },
      },
      department: {
        connect: {
          id: createVisitDto.departmentId,
        },
      },
    },
  });
}


  findAll() {
    return this.prismaService.visit.findMany({
      include: { visitor: true, department: true }
    });
  }

  findOne(id: string) {
    return this.prismaService.visit.findUnique({
      where: { id },
      include: { visitor: true, department: true }
    });
  }

  update(id: string, updateVisitDto: UpdateVisitDto) {
    return this.prismaService.visit.update({
      where:{id},
      data:updateVisitDto
    });
  }

  remove(id: string) {
    return this.prismaService.visit.delete({
      where:{id}
    });
  }
}

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


async findAll(page = 1, limit = 10): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaService.visit.findMany({
        skip,
        take: limit,
        include: {
          visitor: true,
          department: true,
        },
        orderBy: { entryTime: 'desc' },
      }),
      this.prismaService.visit.count(),
    ]);

    return { data, total };
  }


  async findOne(id: string) {
    return this.prismaService.visit.findUnique({
      where: { id },
      include: { visitor: true, department: true }
    });
  }

  async update(id: string, updateVisitDto: UpdateVisitDto) {
    return this.prismaService.visit.update({
      where:{id},
      data:updateVisitDto
    });
  }

 async remove(id: string) {
    return this.prismaService.visit.delete({
      where:{id}
    });
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';



export enum VisitStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED'
}

export class CreateVisitDto {
  @ApiProperty()
  @IsString()
  visitorId: string;

  @ApiProperty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsString()
  purpose: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  entryTime?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  exitTime?: string;

  @ApiProperty({ enum: VisitStatus, default: VisitStatus.ACTIVE })
  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;
}


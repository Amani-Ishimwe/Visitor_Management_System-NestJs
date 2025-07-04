import { PartialType } from '@nestjs/swagger';
import { CreateVisitDto } from './create-visit.dto';

export class UpdateVisitDto extends PartialType(CreateVisitDto) {}

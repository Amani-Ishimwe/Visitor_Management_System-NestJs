import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';


@ApiTags('Visits')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Roles('RECEPTIONIST')
  @ApiOperation({summary:"Record New Visit"})
  @ApiResponse({status:201, description:"New Visit Has Been Recorded"})
  create(@Body() createVisitDto: CreateVisitDto) {
    return this.visitService.create(createVisitDto);
  }

@Get()
@Roles('RECEPTIONIST')
@ApiOperation({ summary: 'Get All Visits (Paginated)' })
@ApiResponse({ status: 200, description: 'All Visits Retrieved Successfully' })
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10
) {
  return this.visitService.findAll(Number(page), Number(limit));
}

  @Get(':id')
  @Roles('RECEPTIONIST')
  @ApiOperation({summary:"Get A Single Visit"})
  @ApiResponse({status:200, description:"Single visit fetched successfully"})
  findOne(@Param('id') id: string) {
    return this.visitService.findOne(id);
  }

  @Patch(':id')
  @Roles('RECEPTIONIST')
  @ApiOperation({summary:"Update Visit"})
  @ApiResponse({status:200, description:"Visit Updated Successfully"})
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitService.update(id, updateVisitDto);
  }

  @Delete(':id')
  @Roles('RECEPTIONIST')
  @ApiOperation({summary:"Delete  A Visit"})
  @ApiResponse({status:200, description:"Deleted Successfully"})
  remove(@Param('id') id: string) {
    return this.visitService.remove(id);
  }
}

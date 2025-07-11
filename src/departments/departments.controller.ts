import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';


@ApiTags("Departments")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({summary:"Register A New Department"})
  @ApiResponse({status:201, description:"The department has been successfully registered"})
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

@Get()
@Roles('ADMIN')
@ApiOperation({ summary: 'Fetching all the departments (paginated)' })
@ApiResponse({ status: 200, description: 'Fetched all departments successfully' })
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
  return this.departmentsService.findAll(Number(page), Number(limit));
}

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({summary:"Fetching a single department"})
  @ApiResponse({status:200, description:"Fetched Department Successfullt"})
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({summary:"Updating a Single department"})
  @ApiResponse({status:200, description:"User updated Successfully"})
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({summary:"Deleting A Department"})
  @ApiResponse({status:200, description:"Deleted the department successfully"})
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}

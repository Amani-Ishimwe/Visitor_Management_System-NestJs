import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Visitors')
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @ApiOperation({summary: "This operation creates a new visitor"})
  @ApiResponse({status:201, description:'Visitor has been created'})
  @ApiResponse({status:400, description:"Bad Request"})
  @ApiBody({type:CreateVisitorDto})
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

@Get()
@ApiOperation({ summary: 'Fetches all Visitors with pagination' })
@ApiResponse({ status: 200, description: 'Visitors have been fetched successfully' })
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10
) {
  return this.visitorsService.findAll(Number(page), Number(limit));
}

  @Get(':id')
  @ApiOperation({summary:"Get Visitor By Id"})
  @ApiResponse({status:200,description:"Visitor fetched Successfully"})
  @ApiResponse({status:404,description:"Visitor with that id not found"})
  @ApiParam({name:'id', description:'UUID of the visitor'})
  findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(+id, updateVisitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(+id);
  }*/
}

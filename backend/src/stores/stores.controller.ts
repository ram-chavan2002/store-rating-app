import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.storesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    const data: any = {
      name: body.name,
      email: body.email,
      address: body.address,
    };
    if (body.owner_id && body.owner_id !== '') {
      data.owner_id = Number(body.owner_id);
    }
    return this.storesService.create(data);
  }
}
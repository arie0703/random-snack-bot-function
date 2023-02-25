import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('items')
  getItems(): Promise<object[]> {
    return this.appService.getItems();
  }

  @Post(':snack_name')
  postItem(@Param('snack_name') snack_name: string): object {
    return this.appService.postItem(snack_name);
  } 
}

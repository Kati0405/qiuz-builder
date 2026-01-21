import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzes: QuizzesService) {}

  @Post()
  create(@Body() dto: CreateQuizDto) {
    return this.quizzes.create(dto);
  }

  @Get()
  findAll() {
    return this.quizzes.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzes.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzes.remove(id);
  }

  @Post('seed')
  seed() {
    return this.quizzes.seed();
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    for (const q of dto.questions) {
      if (q.type === 'boolean' && typeof q.correctBoolean !== 'boolean') {
        throw new BadRequestException(
          'Boolean question must have correctBoolean',
        );
      }

      if (
        q.type === 'input' &&
        (!q.correctText || typeof q.correctText !== 'string')
      ) {
        throw new BadRequestException('Input question must have correctText');
      }

      if (q.type === 'checkbox') {
        if (!q.options || q.options.length < 2) {
          throw new BadRequestException(
            'Checkbox question must have at least 2 options',
          );
        }
        if (!q.options.some((o) => o.isCorrect === true)) {
          throw new BadRequestException(
            'Checkbox question must have at least one correct option',
          );
        }
      }
    }

    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: (dto.questions as any[]).map((q, idx) => {
            if (q.type === 'checkbox') {
              return {
                type: 'checkbox',
                text: q.text,
                order: idx,
                options: {
                  create: q.options.map((o: any, oIdx: number) => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                    order: oIdx,
                  })),
                },
              };
            }
            if (q.type === 'boolean') {
              return {
                type: 'boolean',
                text: q.text,
                order: idx,
                correctBoolean: q.correctBoolean,
              };
            }
            return {
              type: 'input',
              text: q.text,
              order: idx,
              correctText: q.correctText,
            };
          }),
        },
      },
      select: { id: true },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        _count: { select: { questions: true } },
      },
    });

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      questionCount: q._count.questions,
    }));
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { order: 'asc' } } },
        },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async remove(id: string) {
    const exists = await this.prisma.quiz.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Quiz not found');

    await this.prisma.quiz.delete({ where: { id } });
    return { ok: true };
  }
}

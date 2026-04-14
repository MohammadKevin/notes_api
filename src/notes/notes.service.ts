import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
    });
  }

  async findById(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note tidak ditemukan');
    }

    return note;
  }

  async update(userId: string, id: string, data: UpdateNoteDto) {
    await this.findById(userId, id);

    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    await this.findById(userId, id);

    return this.prisma.note.delete({
      where: { id },
    });
  }
}

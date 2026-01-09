import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
//import { Prisma } from '@prisma/client';

//export type Note = { id: number; text: string; createdAt: string };

function isPrismaNotFound(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as any).code === 'P2025';
}

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(text: string, userId: number) {
    return this.prisma.note.create({
      data: { text, userId }
      
    });
  }

  async update(id: number, text: string, userId: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    if (note.userId !== userId) throw new ForbiddenException('Not your note');

    return this.prisma.note.update({ where: { id }, data: { text } });
  }

  async remove(id: number, userId: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    if (note.userId !== userId) throw new ForbiddenException('Not your note');

    await this.prisma.note.delete({ where: { id } });
  }

}

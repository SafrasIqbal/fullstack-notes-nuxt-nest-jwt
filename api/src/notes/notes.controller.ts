import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getNotes() {
    return this.notesService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  addNote(@Req() req: any, @Body() dto: CreateNoteDto) {
    return this.notesService.create(dto.text, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateNote(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
  ) {
    // require text for update in this simple example
    return this.notesService.update(id, dto.text ?? '', req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteNote(@Req() req: any,@Param('id', ParseIntPipe) id: number) {
    await this.notesService.remove(id,req.user.userId);
  }
}

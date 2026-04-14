import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() dto: CreateNoteDto, @Req() req: RequestWithUser) {
    return this.notesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.notesService.findAll(req.user.id);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.notesService.findById(req.user.id, id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.notesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.notesService.delete(req.user.id, id);
  }
}

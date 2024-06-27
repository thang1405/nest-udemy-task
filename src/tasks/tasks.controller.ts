import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CCreateTaskDto,
  CFilterTaskDto,
  CUpdateTaskStatusDto,
} from './tasks.dto';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() query: CFilterTaskDto): Promise<TaskEntity[]> {
    // TODO: if we have nay filters defined will filter
    // otherwise, we will return all the tasks
    return this.tasksService.getTasks(query);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TaskEntity> {
    const res = await this.tasksService.getTaskById(id);
    return res;
  }

  @Post()
  createTask(@Body() createDto: CCreateTaskDto) {
    return this.tasksService.createTask(createDto);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: CUpdateTaskStatusDto,
  ) {
    return await this.tasksService.updateTaskStatus(
      id,
      updateStatusTaskDto.status,
    );
  }

  @Delete(':id')
  async deleteTaskById(@Param('id') id: string) {
    await this.tasksService.deleteTaskById(id);
    return 'Delete successfully!';
  }
}

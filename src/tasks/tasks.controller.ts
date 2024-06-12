import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './tasks.model';
import {
  CCreateTaskDto,
  CFilterTaskDto,
  CUpdateTaskStatusDto,
} from './tasks.dto';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() query: CFilterTaskDto): ITask[] {
    // TODO: if we have nay filters defined will filter
    // otherwise, we will return all the tasks
    return this.tasksService.getTasks(query);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): ITask {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createDto: CCreateTaskDto) {
    return this.tasksService.createTask(createDto);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: CUpdateTaskStatusDto,
  ) {
    return this.tasksService.updateTaskStatus(id, updateStatusTaskDto.status);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string) {
    this.tasksService.deleteTaskById(id);
    return 'Delete successfully!';
  }
}

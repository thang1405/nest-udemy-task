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
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() query: CFilterTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    // TODO: if we have nay filters defined will filter
    // otherwise, we will return all the tasks
    return this.tasksService.getTasks(query, user);
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    const res = await this.tasksService.getTaskById(id, user);
    return res;
  }

  @Post()
  createTask(@Body() createDto: CCreateTaskDto, @GetUser() user: UserEntity) {
    return this.tasksService.createTask(createDto, user);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusTaskDto: CUpdateTaskStatusDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.tasksService.updateTaskStatus(
      id,
      updateStatusTaskDto.status,
      user,
    );
  }

  @Delete(':id')
  async deleteTaskById(@Param('id') id: string, @GetUser() user: UserEntity) {
    await this.tasksService.deleteTaskById(id, user);
    return 'Delete successfully!';
  }
}

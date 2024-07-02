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
  Logger,
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
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: CFilterTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    // TODO: if we have nay filters defined will filter
    // otherwise, we will return all the tasks
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
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
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createDto,
      )}`,
    );
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

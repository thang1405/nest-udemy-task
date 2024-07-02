import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ETaskStatus } from './tasks.model';
import { CCreateTaskDto, CFilterTaskDto } from './tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', {});
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(
    filterDto: CFilterTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { search = '', status = null } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task_entity');
    query.where({ user });

    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task_entity.title) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    // TODO: try to get the task
    // if not found, throw error 404 not found
    // otherwise, return the found task
    try {
      const task = await this.taskRepository.findOneBy({ id, user });
      if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
      return task;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Not found`);
    }
  }

  async deleteTaskById(id: string, user: UserEntity) {
    this.getTaskById(id, user);

    const result = await this.taskRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async createTask(
    createDto: CCreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createDto;
    try {
      const newTask = await this.taskRepository.create({
        title,
        description,
        status: ETaskStatus.OPEN,
        user,
      });

      const save = await this.taskRepository.save(newTask);
      console.log({ newTask, save });
      return newTask;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Something went wrong!`);
    }
  }
  async updateTaskStatus(id: string, status: ETaskStatus, user: UserEntity) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}

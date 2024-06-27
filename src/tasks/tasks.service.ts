import { Injectable, NotFoundException } from '@nestjs/common';
import { ETaskStatus } from './tasks.model';
import { CCreateTaskDto, CFilterTaskDto } from './tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(filter: CFilterTaskDto): Promise<TaskEntity[]> {
    const { search = '', status = null } = filter;
    const query = this.taskRepository.createQueryBuilder('task_entity');
    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task_entity.title) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
  async getTaskById(id: string): Promise<TaskEntity> {
    // TODO: try to get the task
    // if not found, throw error 404 not found
    // otherwise, return the found task
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
      return task;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Not found`);
    }
  }

  async deleteTaskById(id: string) {
    this.getTaskById(id);

    await this.taskRepository.softDelete(id);
  }

  async createTask(createDto: CCreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createDto;
    try {
      const newTask = await this.taskRepository.create({
        title,
        description,
        status: ETaskStatus.OPEN,
      });

      const save = await this.taskRepository.save(newTask);
      console.log({ newTask, save });
      return newTask;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Something went wrong!`);
    }
  }
  async updateTaskStatus(id: string, status: ETaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}

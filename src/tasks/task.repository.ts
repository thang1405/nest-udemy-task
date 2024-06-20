import { DataSource } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericRepository } from 'src/common/generic.repository';
import { TaskEntity } from './task.entity';
import { CCreateTaskDto } from './tasks.dto';
import { ETaskStatus } from './tasks.model';

@Injectable()
export class TaskRepository extends GenericRepository<TaskEntity> {
  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource);
  }
  async createTask(createDto: CCreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createDto;
    try {
      const newTask = await this.create({
        title,
        description,
        status: ETaskStatus.OPEN,
      });

      const save = await this.save(newTask);
      console.log({ newTask, save });
      return newTask;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Something went wrong!`);
    }
  }
}

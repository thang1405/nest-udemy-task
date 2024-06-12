import { Injectable, NotFoundException } from '@nestjs/common';
import { ETaskStatus, ITask } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CCreateTaskDto, CFilterTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getTasks(filter: CFilterTaskDto): ITask[] {
    let taskFilter: ITask[] = this.tasks;
    if (Object.keys(filter).length) {
      const { search, status } = filter;
      if (status) {
        taskFilter = taskFilter.filter((task) => task.status === status);
      }
      if (search) {
        taskFilter = taskFilter.filter((task) =>
          (task?.title || '')
            .toLowerCase()
            .includes(search.toLowerCase() || ''),
        );
      }
    }
    return taskFilter;
  }
  getTaskById(id: string): ITask {
    // TODO: try to get the task
    // if not found, throw error 404 not found
    // otherwise, return the found task
    const task = this.tasks.find((el) => el.id === id);
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return this.tasks.find((el) => el.id === id);
  }

  deleteTaskById(id: string): void {
    this.getTaskById(id);

    this.tasks === this.tasks.filter((el) => el.id !== id);
  }

  createTask(createDto: CCreateTaskDto): ITask {
    const { title, description } = createDto;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: ETaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  updateTaskStatus(id: string, status: ETaskStatus) {
    const task: ITask = this.getTaskById(id);
    task.status = status;
    return task;
  }
}

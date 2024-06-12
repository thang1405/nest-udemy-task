import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ETaskStatus } from './tasks.model';

export class CCreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
export class CUpdateTaskDto {
  title: string;
  description: string;
}
export class CUpdateTaskStatusDto {
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}

export class CFilterTaskDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsEnum(ETaskStatus)
  @IsOptional()
  status?: ETaskStatus;
}

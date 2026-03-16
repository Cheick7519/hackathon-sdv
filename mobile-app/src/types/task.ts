export type TaskPriority = 'must' | 'should' | 'could';

export interface Task {
  id: string;
  title: string;
  owner: string;
  priority: TaskPriority;
  done: boolean;
  dueDate?: string;
  createdAt: number;
}

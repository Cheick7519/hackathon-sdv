import { Task } from '../types/task';

export const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Parcours critique de demo',
    owner: 'Dev 1',
    priority: 'must',
    done: false,
    dueDate: '2026-03-17',
    createdAt: 1742086800000,
  },
  {
    id: '2',
    title: 'Ecran onboarding minimal',
    owner: 'Dev 2',
    priority: 'must',
    done: false,
    dueDate: '2026-03-17',
    createdAt: 1742087100000,
  },
  {
    id: '3',
    title: 'Connexion API ou mock local',
    owner: 'Dev 3',
    priority: 'must',
    done: false,
    dueDate: '2026-03-16',
    createdAt: 1742087400000,
  },
  {
    id: '4',
    title: 'Script de pitch et demo',
    owner: 'Dev 4',
    priority: 'should',
    done: false,
    dueDate: '2026-03-18',
    createdAt: 1742087700000,
  },
  {
    id: '5',
    title: 'Animations bonus',
    owner: 'Dev 2',
    priority: 'could',
    done: false,
    dueDate: '2026-03-18',
    createdAt: 1742088000000,
  },
];

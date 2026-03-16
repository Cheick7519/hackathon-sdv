import { Task } from '../types/task';

export const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Parcours critique de demo',
    owner: 'Dev 1',
    priority: 'must',
    done: false,
  },
  {
    id: '2',
    title: 'Ecran onboarding minimal',
    owner: 'Dev 2',
    priority: 'must',
    done: false,
  },
  {
    id: '3',
    title: 'Connexion API ou mock local',
    owner: 'Dev 3',
    priority: 'must',
    done: false,
  },
  {
    id: '4',
    title: 'Script de pitch et demo',
    owner: 'Dev 4',
    priority: 'should',
    done: false,
  },
  {
    id: '5',
    title: 'Animations bonus',
    owner: 'Dev 2',
    priority: 'could',
    done: false,
  },
];

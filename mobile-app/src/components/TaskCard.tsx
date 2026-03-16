import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const priorityColor: Record<Task['priority'], string> = {
  must: '#D7263D',
  should: '#1B998B',
  could: '#2E4057',
};

export function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <Pressable
      style={[styles.card, task.done && styles.cardDone]}
      onPress={() => onToggle(task.id)}
      accessibilityRole="button"
      accessibilityLabel={`Basculer la tache ${task.title}`}
    >
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: priorityColor[task.priority] }]} />
        <View style={styles.content}>
          <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
          <Text style={styles.meta}>{task.owner.toUpperCase()} - {task.priority.toUpperCase()}</Text>
        </View>
        <Text style={styles.status}>{task.done ? 'DONE' : 'TODO'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8E5EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F2C3D6',
  },
  cardDone: {
    opacity: 0.72,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#2D1E2F',
    fontSize: 15,
    fontWeight: '700',
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  meta: {
    color: '#7A5C6D',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  status: {
    color: '#2D1E2F',
    fontWeight: '800',
    fontSize: 11,
  },
});

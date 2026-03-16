import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColor: Record<Task['priority'], string> = {
  must: '#BE123C',
  should: '#0E7490',
  could: '#475569',
};

function formatDueDate(rawDate?: string): string {
  if (!rawDate) {
    return 'No deadline';
  }

  const date = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <View style={[styles.card, task.done && styles.cardDone]}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: priorityColor[task.priority] }]} />
        <View style={styles.content}>
          <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
          <Text style={styles.meta}>{task.owner.toUpperCase()} · {task.priority.toUpperCase()} · {formatDueDate(task.dueDate)}</Text>
        </View>
        <Text style={[styles.status, task.done ? styles.statusDone : styles.statusTodo]}>{task.done ? 'DONE' : 'TODO'}</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionButton, styles.actionToggle]}
          onPress={() => onToggle(task.id)}
          accessibilityRole="button"
          accessibilityLabel={`Basculer la tache ${task.title}`}
        >
          <Text style={styles.actionText}>{task.done ? 'Reouvrir' : 'Terminer'}</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.actionDelete]}
          onPress={() => onDelete(task.id)}
          accessibilityRole="button"
          accessibilityLabel={`Supprimer la tache ${task.title}`}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D6E2E8',
    gap: 12,
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
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  meta: {
    color: '#475569',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  status: {
    fontWeight: '800',
    fontSize: 11,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
    overflow: 'hidden',
  },
  statusDone: {
    color: '#065F46',
    backgroundColor: '#D1FAE5',
  },
  statusTodo: {
    color: '#9A3412',
    backgroundColor: '#FFEDD5',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  actionToggle: {
    backgroundColor: '#0F766E',
  },
  actionDelete: {
    backgroundColor: '#FEE2E2',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  deleteText: {
    color: '#B91C1C',
  },
});

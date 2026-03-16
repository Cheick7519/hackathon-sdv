import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { TaskCard } from './src/components/TaskCard';
import { seedTasks } from './src/data/seedTasks';
import { Task } from './src/types/task';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activeFilter, setActiveFilter] = useState<'all' | Task['priority']>('all');

  const doneCount = tasks.filter((task) => task.done).length;
  const completionRate = Math.round((doneCount / tasks.length) * 100);

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'all') {
      return tasks;
    }
    return tasks.filter((task) => task.priority === activeFilter);
  }, [activeFilter, tasks]);

  function toggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Sprint Hackathon Mobile</Text>
          <Text style={styles.heroSubtitle}>Deadline mercredi 13:00</Text>
          <View style={styles.progressWrap}>
            <Text style={styles.progressLabel}>{doneCount}/{tasks.length} taches</Text>
            <Text style={styles.progressLabel}>{completionRate}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionRate}%` }]} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Backlog execute</Text>
          <Text style={styles.sectionCaption}>Tap pour marquer DONE</Text>
        </View>

        <View style={styles.filterRow}>
          {(['all', 'must', 'should', 'could'] as const).map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))}
          {!visibleTasks.length && <Text style={styles.emptyState}>Aucune tache sur ce filtre.</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8FB',
  },
  container: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#2D1E2F',
    borderRadius: 20,
    padding: 18,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#EBD7E2',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  progressWrap: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#F7EAF0',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    marginTop: 8,
    height: 9,
    borderRadius: 99,
    backgroundColor: '#6A4A64',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F25F8B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#2D1E2F',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCaption: {
    color: '#7A5C6D',
    fontSize: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    backgroundColor: '#F3DCE7',
    borderRadius: 99,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  filterPillActive: {
    backgroundColor: '#2D1E2F',
  },
  filterText: {
    color: '#5A3E56',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 10,
  },
  emptyState: {
    color: '#7A5C6D',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
  },
});

import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskCard } from './src/components/TaskCard';
import { seedTasks } from './src/data/seedTasks';
import { Task } from './src/types/task';

const STORAGE_KEY = 'hackathon.mobile.tasks.v1';
const PRIORITY_ORDER: Record<Task['priority'], number> = {
  must: 0,
  should: 1,
  could: 2,
};

function normalizeTask(rawTask: Partial<Task>, fallbackId: string): Task {
  return {
    id: rawTask.id ?? fallbackId,
    title: rawTask.title ?? 'Tache sans titre',
    owner: rawTask.owner ?? 'Unknown',
    priority: rawTask.priority ?? 'should',
    done: rawTask.done ?? false,
    dueDate: rawTask.dueDate,
    createdAt: rawTask.createdAt ?? Date.now(),
  };
}

function parseDateScore(rawDate?: string): number {
  if (!rawDate) {
    return Number.MAX_SAFE_INTEGER;
  }

  const parsed = new Date(`${rawDate}T00:00:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activeFilter, setActiveFilter] = useState<'all' | Task['priority']>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'owner'>('priority');

  const [draftTitle, setDraftTitle] = useState('');
  const [draftOwner, setDraftOwner] = useState('Dev 1');
  const [draftPriority, setDraftPriority] = useState<Task['priority']>('must');
  const [draftDate, setDraftDate] = useState('');

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setTasks(seedTasks);
          return;
        }

        const parsed = JSON.parse(saved) as Partial<Task>[];
        const normalized = parsed.map((task, index) => normalizeTask(task, `legacy-${index}`));
        if (normalized.length) {
          setTasks(normalized);
        }
      } catch {
        setTasks(seedTasks);
      } finally {
        setIsHydrated(true);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {
      // Silent persistence failure keeps app usable offline.
    });
  }, [isHydrated, tasks]);

  const doneCount = tasks.filter((task) => task.done).length;
  const completionRate = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const mustRemaining = tasks.filter((task) => task.priority === 'must' && !task.done).length;
  const overdueCount = tasks.filter((task) => !task.done && parseDateScore(task.dueDate) < parseDateScore(new Date().toISOString().slice(0, 10))).length;

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const byFilter = activeFilter === 'all' || task.priority === activeFilter;
      const bySearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.owner.toLowerCase().includes(query);

      return byFilter && bySearch;
    });

    const sorted = [...filtered];
    if (sortBy === 'priority') {
      sorted.sort((a, b) => {
        if (a.done !== b.done) {
          return Number(a.done) - Number(b.done);
        }
        const priorityGap = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        if (priorityGap !== 0) {
          return priorityGap;
        }
        return a.createdAt - b.createdAt;
      });
    }

    if (sortBy === 'deadline') {
      sorted.sort((a, b) => {
        if (a.done !== b.done) {
          return Number(a.done) - Number(b.done);
        }
        return parseDateScore(a.dueDate) - parseDateScore(b.dueDate);
      });
    }

    if (sortBy === 'owner') {
      sorted.sort((a, b) => {
        if (a.done !== b.done) {
          return Number(a.done) - Number(b.done);
        }
        return a.owner.localeCompare(b.owner);
      });
    }

    return sorted;
  }, [activeFilter, search, sortBy, tasks]);

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

  function removeTask(taskId: string) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function addTask() {
    const title = draftTitle.trim();
    const owner = draftOwner.trim();
    const date = draftDate.trim();

    if (!title || !owner) {
      Alert.alert('Champs requis', 'Ajoute un titre et un owner.');
      return;
    }

    if (date) {
      const isDateShapeValid = /^\d{4}-\d{2}-\d{2}$/.test(date);
      const parsedDate = new Date(`${date}T00:00:00`).getTime();
      if (!isDateShapeValid || Number.isNaN(parsedDate)) {
        Alert.alert('Date invalide', 'Utilise le format YYYY-MM-DD.');
        return;
      }
    }

    const newTask: Task = {
      id: `${Date.now()}`,
      title,
      owner,
      priority: draftPriority,
      done: false,
      dueDate: date || undefined,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setDraftTitle('');
    setDraftDate('');
  }

  function clearDone() {
    setTasks((prev) => prev.filter((task) => !task.done));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Hackathon Sprint Board</Text>
          <Text style={styles.heroSubtitle}>Solo mode · focus execution</Text>
          <View style={styles.progressWrap}>
            <Text style={styles.progressLabel}>{doneCount}/{tasks.length} taches</Text>
            <Text style={styles.progressLabel}>{completionRate}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionRate}%` }]} />
          </View>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{mustRemaining}</Text>
              <Text style={styles.kpiLabel}>MUST restants</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{overdueCount}</Text>
              <Text style={styles.kpiLabel}>En retard</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Nouvelle tache</Text>
          <TextInput
            value={draftTitle}
            onChangeText={setDraftTitle}
            placeholder="Titre"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
          <View style={styles.inlineInputs}>
            <TextInput
              value={draftOwner}
              onChangeText={setDraftOwner}
              placeholder="Owner"
              placeholderTextColor="#64748B"
              style={[styles.input, styles.inlineInput]}
            />
            <TextInput
              value={draftDate}
              onChangeText={setDraftDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#64748B"
              style={[styles.input, styles.inlineInput]}
            />
          </View>

          <View style={styles.filterRow}>
            {(['must', 'should', 'could'] as const).map((priority) => (
              <Pressable
                key={priority}
                onPress={() => setDraftPriority(priority)}
                style={[
                  styles.filterPill,
                  draftPriority === priority && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    draftPriority === priority && styles.filterTextActive,
                  ]}
                >
                  {priority.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={addTask} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Ajouter la tache</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Backlog execute</Text>
          <Pressable onPress={clearDone}>
            <Text style={styles.linkAction}>Purger DONE</Text>
          </Pressable>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher par titre ou owner"
          placeholderTextColor="#64748B"
          style={styles.input}
        />

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

        <View style={styles.filterRow}>
          {(['priority', 'deadline', 'owner'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setSortBy(mode)}
              style={[styles.sortPill, sortBy === mode && styles.sortPillActive]}
            >
              <Text style={[styles.sortText, sortBy === mode && styles.sortTextActive]}>
                TRI {mode.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={removeTask} />
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
    backgroundColor: '#F2F7F7',
  },
  container: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#DBEAFE',
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
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    marginTop: 8,
    height: 9,
    borderRadius: 99,
    backgroundColor: '#334155',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22D3EE',
  },
  kpiRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#172554',
    borderRadius: 12,
    padding: 10,
  },
  kpiValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  kpiLabel: {
    color: '#BFDBFE',
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 10,
  },
  panelTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0F172A',
    fontWeight: '600',
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  inlineInput: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  linkAction: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
  },
  filterText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  sortPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 99,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sortPillActive: {
    backgroundColor: '#C2410C',
  },
  sortText: {
    color: '#9A3412',
    fontSize: 11,
    fontWeight: '700',
  },
  sortTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 10,
  },
  emptyState: {
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
  },
});

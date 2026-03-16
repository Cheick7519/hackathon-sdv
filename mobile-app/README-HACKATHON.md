# Mobile App - Hackathon Sprint

## Lancer le projet

```bash
npm install
npm run ios
# ou
npm run android
# ou
npm run web
```

## Ce qui est deja implemente

- Dashboard de progression (nombre de taches completees + barre de progression)
- Backlog interactif (tap sur une tache pour basculer TODO/DONE)
- Filtres de priorite (ALL, MUST, SHOULD, COULD)
- Seed local pour demo hors-ligne

## Structure

- `App.tsx`: ecran principal et logique d'etat
- `src/types/task.ts`: types metier
- `src/data/seedTasks.ts`: donnees de demonstration
- `src/components/TaskCard.tsx`: composant carte tache

## Repartition equipe suggeree (4 personnes)

1. Dev 1: parcours critique + integration globale
2. Dev 2: UI/UX et composants
3. Dev 3: donnees/API (mock puis vrai endpoint)
4. Dev 4: QA, tests de demo, pitch

## Priorites J1/J2

- J1: finaliser tous les MUST
- J2 matin: correction bugs bloquants
- J2 avant rendu: repetition pitch et demo

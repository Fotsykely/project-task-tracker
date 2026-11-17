# Roadmap

Chaque phase = une branche (`type/nom-court`), plusieurs petits commits, fusion dans `main` une fois la phase vérifiée.
On avance phase par phase, sans tout implémenter d'un coup.

## Jalon A — Backend (API ASP.NET Core + PostgreSQL)

- [x] **P0 Bootstrap** (`chore/bootstrap`) : `.gitignore`, docker compose, `.env.example`, solution .NET, roadmap, design system
- [x] **P1 Modèle et base** (`feat/data-model`) : entités, `AppDbContext`, migration `InitialCreate`, données de démo
- [x] **P2 API Projets** (`feat/api-projects`) : CRUD, nombre de tâches, validation, 404
- [x] **P3 API Tâches** (`feat/api-tasks`) : CRUD sous un projet, validation, suppression en cascade

> Pause : relecture du backend avant de démarrer le front.

## Jalon B — Frontend (Next.js)

- [x] **P4 Socle front** (`feat/front-foundation`) : Next.js, Tailwind, tokens de design, layout, client `lib/api/`
- [x] **P5 Pages projets** (`feat/front-projects`) : accueil, création, modification, suppression
- [x] **P6 Pages tâches** (`feat/front-tasks`) : liste groupée par statut, ajout, modification, suppression, changement de statut
- [ ] **P7 Finitions** (`docs/readme`) : README complet (lancement, choix techniques), vérification mobile et accessibilité

## Plus tard (non planifié)

- **P8 Tests** : xUnit + `WebApplicationFactory` + Testcontainers côté API, Vitest côté front
- **P9 Confort** : filtres par statut, tri par échéance, tâches en retard mises en évidence
- **P10 Assignation** : affecter une tâche à une personne (« les tâches de chacun »)
- **P11 Vue Kanban** avec glisser-déposer
- **P12 Plateforme** : authentification, CI GitHub Actions, conteneurisation de l'API et du front

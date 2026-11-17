# Suivi de projets et de tâches

Site interne pour suivre des projets et leurs tâches : une **API ASP.NET Core** (EF Core + PostgreSQL) et un **front Next.js** (TypeScript + Tailwind).

```
Navigateur ──► Next.js (:3000) ──► API ASP.NET Core (:5080) ──► PostgreSQL (:5433, Docker)
```

Le navigateur ne parle jamais à l'API : seul le serveur Next.js l'appelle. Il n'y a donc pas de CORS à configurer, et l'adresse de l'API n'est pas exposée.

## Fonctionnalités

- **Projets** : nom obligatoire (3 à 80 caractères), description facultative, date de création automatique. Créer, modifier, supprimer (supprime aussi ses tâches, après confirmation).
- **Tâches** : titre obligatoire, statut (À faire, En cours, Terminée), échéance facultative. Ajouter, modifier, changer le statut en un clic, supprimer. Une tâche dont l'échéance est dépassée et qui n'est pas terminée est signalée « En retard ».
- **Accueil** : la liste des projets avec le nombre de tâches de chacun.
- **Erreurs de saisie** : affichées sous le champ concerné, en français, avec ce qui a été saisi conservé.
- **Interface** sobre, utilisable sur mobile (menu repliable, pas de défilement horizontal, cibles tactiles de 44 px), navigable au clavier.

## Prérequis

- .NET SDK 10 (le fichier `global.json` épingle la version)
- Node.js 20.9 ou plus récent
- Docker (pour PostgreSQL)

## Lancer le projet

Trois terminaux : la base, l'API, le front.

**1. La base de données** (à la racine du dépôt)

```bash
cp .env.example .env        # puis choisir un mot de passe dans .env
docker compose up -d        # PostgreSQL 17 sur localhost:5433
```

**2. L'API**

La chaîne de connexion n'est écrite dans aucun fichier du dépôt. En développement, on la stocke dans les *user secrets* de .NET (hors du dépôt, dans le profil de l'utilisateur) :

```bash
cd backend/TaskTracker.Api
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5433;Database=tasktracker;Username=tasktracker;Password=<POSTGRES_PASSWORD de .env>"
dotnet run                  # http://localhost:5080
```

Autre possibilité : la variable d'environnement `ConnectionStrings__Default`.

Au démarrage, l'API applique les migrations puis, si la base ne contient aucun projet, charge les **données de démonstration** (3 projets, 8 tâches). Relancer l'API ne crée pas de doublons.

**3. Le front**

```bash
cd frontend
cp .env.example .env.local  # API_BASE_URL=http://localhost:5080
npm install
npm run dev                 # http://localhost:3000
```

Pour une version de production : `npm run build` puis `npm run start`.

## Tester l'API seule

Avec l'API lancée, ouvrir **http://localhost:5080/scalar** : la documentation interactive (Scalar) liste tous les endpoints et permet de les essayer. La description OpenAPI brute est sur `/openapi/v1.json`. Ces deux adresses n'existent qu'en développement.

| Méthode | URL | Rôle |
|---|---|---|
| GET | `/api/projects` | Liste des projets avec `taskCount` |
| POST | `/api/projects` | Créer un projet |
| GET / PUT / DELETE | `/api/projects/{id}` | Lire, modifier, supprimer (supprime aussi ses tâches) |
| GET | `/api/projects/{id}/tasks` | Tâches d'un projet |
| POST | `/api/projects/{id}/tasks` | Ajouter une tâche |
| GET / PUT / DELETE | `/api/tasks/{id}` | Lire, modifier, supprimer une tâche |

Une ressource inconnue répond `404`. Une saisie invalide répond `400` avec les messages par champ :

```json
{ "status": 400, "errors": { "Name": ["Le nom doit contenir entre 3 et 80 caractères."] } }
```

Corps d'un projet : `{ "name": "...", "description": "..." }` (description facultative).
Corps d'une tâche : `{ "title": "...", "status": "Todo | InProgress | Done", "dueDate": "2026-12-31" }` (statut et échéance facultatifs).

## Structure

```
backend/TaskTracker.Api/
├── Controllers/   ProjectsController, TasksController   (routes HTTP)
├── Dtos/          corps des requêtes et réponses, avec la validation
├── Entities/      Project, ProjectTask, ProjectTaskStatus
├── Data/          AppDbContext (mapping EF Core), DemoDataSeeder
├── Migrations/    schéma de la base, généré par EF Core
└── Program.cs     configuration et démarrage

frontend/
├── app/
│   ├── page.tsx                      accueil : liste des projets
│   ├── loading.tsx, error.tsx, not-found.tsx
│   └── projects/
│       ├── actions.ts                Server Actions des projets
│       ├── new/                      création d'un projet
│       └── [projectId]/              page du projet (tâches), modification, tâches
│           ├── task-actions.ts       Server Actions des tâches
│           └── _components/          composants propres à cette page (TaskRow, TaskForm…)
├── components/    interface partagée (Button, champs de formulaire, ConfirmDelete, navigation)
└── lib/
    ├── api-client/   le seul endroit qui parle HTTP à l'API (client, projets, tâches, types)
    └── format.ts     dates en français, libellés de statut, accord « 1 tâche » / « 2 tâches »
```

Le design (couleurs, composants, accessibilité) est décrit dans [design-system/task-tracker/MASTER.md](design-system/task-tracker/MASTER.md).

## Choix techniques

**Backend**

- **Contrôleurs `[ApiController]`** : la validation des DTO est automatique et renvoie un `400` structuré.
- **DTO séparés des entités** : on n'expose pas directement les tables, et on contrôle ce qu'un client peut envoyer.
- **Pas de couche `Services`** : l'application n'a que du CRUD, les contrôleurs parlent directement à `AppDbContext`. On en ajoutera une le jour où une règle métier le justifie.
- **Règles de longueur définies une seule fois**, en constantes sur les entités, et réutilisées par le schéma de la base et la validation.
- **Date de création générée par PostgreSQL** (`now()`), statut stocké en texte (lisible en SQL), suppression en cascade assurée par la clé étrangère.
- **Nombre de tâches par projet calculé en SQL**, dans la même requête que la liste (pas de requête par projet).

**Frontend**

- **Next.js App Router, rendu côté serveur** : les pages lisent l'API directement (Server Components) et les formulaires passent par des Server Actions. Pas de `fetch` depuis le navigateur.
- **Un seul client d'API** (`lib/api-client/client.ts`) : il transforme un `400` en erreurs par champ et un `404` en page « introuvable ». Les pages et les actions ne manipulent ni `fetch` ni codes HTTP. Le module est réservé au serveur (`server-only`).
- **L'API reste la seule source de vérité des règles** : le front affiche les messages qu'elle renvoie sous le bon champ, sans re-valider. La validation native du navigateur est désactivée pour que toutes les erreurs aient le même aspect.
- **Pas de Clean Architecture** : le front n'a aucune règle métier et une seule source de données, des couches de plus n'apporteraient que du code à maintenir. Le code est rangé par page, et ce qui sert à plusieurs pages remonte dans `components/` ou `lib/`.
- **Cache Components (Next.js 16)** : chaque lecture de l'API se fait dans une zone de chargement (`loading.tsx` ou `<Suspense>`), et les écritures rafraîchissent les pages concernées.
- **Types écrits à la main** dans `lib/api-client/types.ts`, en miroir des DTO. Piste d'amélioration : les générer depuis `/openapi/v1.json`.
- **Accessibilité** : libellés visibles, erreurs reliées aux champs (`aria-invalid`, `aria-describedby`), statuts toujours accompagnés d'un texte, focus visible, lien « Aller au contenu ». Les pages ont été contrôlées avec axe-core (WCAG 2.1 A et AA) à 1280 px et 375 px, sans violation.

## Limites connues

- Pas d'authentification (non demandée) : toute personne qui accède au site peut tout modifier.
- Une page « introuvable » répond avec le code HTTP `200` et non `404`, car la page est diffusée progressivement avant que l'API ne réponde. Sans conséquence pour un outil interne.
- Pas de tests automatisés (voir la piste dans [ROADMAP.md](ROADMAP.md)).

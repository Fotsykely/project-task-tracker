# Suivi de projets et de tâches

Site interne pour suivre des projets et leurs tâches. Une API ASP.NET Core (EF Core + PostgreSQL) et, plus tard, un front Next.js.

> État : backend terminé, front à venir. Voir [ROADMAP.md](ROADMAP.md).

## Prérequis

- .NET SDK 10
- Docker (pour PostgreSQL)

## Lancer le backend

**1. La base de données**

```bash
cp .env.example .env        # puis choisir un mot de passe dans .env
docker compose up -d        # PostgreSQL 17 sur localhost:5433
```

**2. La chaîne de connexion (hors du code source)**

Elle n'est écrite dans aucun fichier du dépôt. En développement, on la stocke dans les *user secrets* de .NET (hors du dépôt, dans le profil de l'utilisateur) :

```bash
cd backend/TaskTracker.Api
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5433;Database=tasktracker;Username=tasktracker;Password=<POSTGRES_PASSWORD de .env>"
```

Autre possibilité : la variable d'environnement `ConnectionStrings__Default`.

**3. L'API**

```bash
dotnet run                  # http://localhost:5080
```

Au démarrage, l'API applique les migrations puis, si la base ne contient aucun projet, charge les données de démonstration (3 projets, 8 tâches). Relancer l'API ne crée pas de doublons.

## API

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

## Structure du backend

```
backend/TaskTracker.Api/
├── Controllers/   ProjectsController, TasksController   (routes HTTP)
├── Dtos/          corps des requêtes et réponses, avec la validation
├── Entities/      Project, ProjectTask, ProjectTaskStatus
├── Data/          AppDbContext (mapping EF Core), DemoDataSeeder
├── Migrations/    schéma de la base, généré par EF Core
└── Program.cs     configuration et démarrage
```

## Choix techniques

- **Contrôleurs `[ApiController]`** : la validation des DTO est automatique et renvoie un `400` structuré.
- **DTO séparés des entités** : on n'expose pas directement les tables, et on contrôle ce qu'un client peut envoyer.
- **Pas de couche `Services`** : l'application n'a que du CRUD, les contrôleurs parlent directement à `AppDbContext`. On en ajoutera une le jour où une règle métier le justifie.
- **Règles de longueur définies une seule fois**, en constantes sur les entités, et réutilisées par le schéma de la base et la validation.
- **Date de création générée par PostgreSQL** (`now()`), statut stocké en texte (lisible en SQL), suppression en cascade assurée par la clé étrangère.
- **Nombre de tâches par projet calculé en SQL**, dans la même requête que la liste (pas de requête par projet).

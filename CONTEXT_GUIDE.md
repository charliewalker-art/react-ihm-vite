# IHMFROND — Rapport d'Architecture et Fonctionnel Frontend
> Dernière mise à jour : 26 mai 2026

---

## 1. Résumé exécutif

IHMFROND est une application frontend React + Vite + TypeScript destinée à la gestion d’un restaurant. Elle utilise React 19, Vite 4, TypeScript, Tailwind CSS via le plugin `@tailwindcss/vite`, `react-router-dom` pour le routage, `axios` pour les appels HTTP, et `lucide-react` pour les icônes. L’application couvre les grands modules UI : Authentification, Dashboard métier, Plats, Tables, Utilisateurs, et Profil. L’architecture est centrée sur des hooks personnalisés (`useAuth`, `usePlats`, `useTable`, `useUtilisateur`) et des composants atomiques / moléculaires, sans store global externe.

---

## 2. Architecture globale & structure des dossiers

### Arborescence complète de `src/`

```
src/
├── App.tsx                                → Point d’entrée principal du router
├── index.css                              → Styles Tailwind / dark variant
├── main.tsx                               → Hydratation React sur #root
├── router.tsx                             → Routes publiques et protégées
├── assets/
│   ├── hero.png                            → Ressource image
│   ├── react.svg                           → Logo React
│   └── vite.svg                            → Logo Vite
├── components/
│   ├── Layout.tsx                          → Layout global avec Navbar + Sidebar
│   ├── Navbar.tsx                          → Barre supérieure + thème + logout
│   ├── ProtectedRoute.tsx                  → Wrapper de protection route
│   └── Sidebar.tsx                         → Menu latéral selon rôle
├── hooks/
│   ├── axiosInstance.ts                    → Axios partagé avec interceptors
│   ├── useAuth.ts                          → Auth API / token / user
│   ├── usePlats.ts                         → Flux CRUD plats
│   ├── useCommande.ts                      → Flux commandes / annulations
│   ├── useTable.ts                         → Flux tables / statut / appel
│   └── useUtilisateur.ts                   → Flux utilisateurs / profil
├── pages/
│   ├── DashboardPage.tsx                   → Page dashboard central
│   ├── LoginPage.tsx                       → Page de login
│   ├── CommandesPage.tsx                   → Page commandes / gestion des commandes
│   ├── PlatsPage.tsx                       → Gestion du menu / plats
│   ├── ProfilPage.tsx                      → Edition du profil
│   ├── TablesPage.tsx                      → Gestion plan de salle
│   └── UsersPage.tsx                       → Gestion du staff
├── types/
│   ├── auth.ts                             → Types auth + role
│   ├── plat.ts                             → Types menu / plats
│   ├── profil.ts                           → Types profil utilisateur
│   ├── table.ts                            → Types table / statut
│   └── utilisateur.ts                      → Types utilisateur / rôle
└── ui/
    ├── uiAuth/
    │   ├── LoginForm.tsx                   → Formulaire login
    │   └── ThemeToggle.tsx                 → Bouton thème clair/sombre
    ├── uiDashboard/
    │   ├── DashboardCaissier.tsx
    │   ├── DashboardCard.tsx
    │   ├── DashboardCuisiniere.tsx
    │   ├── DashboardManager.tsx
    │   ├── DashboardResponsable.tsx
    │   └── DashboardServeur.tsx
    ├── uiPlats/
    │   ├── PlatCard.tsx
    │   └── PlatFormModal.tsx
    ├── uiCommandes/
    │   ├── AnnulationModal.tsx
    │   ├── CommandeCard.tsx
    │   ├── CreateCommandeModal.tsx
    │   └── StatutCommandeBadge.tsx
    ├── uiTables/
    │   ├── CreateTableModal.tsx
    │   ├── StatutTableBadge.tsx
    │   └── TableCard.tsx
    └── uiUsers/
        ├── CreateUserModal.tsx
        ├── RoleBadge.tsx
        ├── StatutBadge.tsx
        └── UserCard.tsx
```

### Flux de requête de bout en bout

1. Page / composant utilisateur initie l’action
   - Exemple : `PlatsPage` appelle `usePlats.fetchPlats()`
2. Hook métier appelle l’API
   - `usePlats`, `useTable`, `useUtilisateur`, `useAuth.login()`
3. `axiosInstance` ou `axios` exécute la requête REST
   - `axiosInstance.get('/api/plats')`
   - ou `axios.get(`${API_URL}/api/utilisateurs`, getHeaders())`
4. API REST répond
   - données reçues, ou erreur HTTP
5. Hook met à jour l’état local
   - `setPlats(response.data)`
   - `setLoading(false)`
   - `setError(...)`
6. Composant page affiche l’état
   - loading spinner
   - erreurs inline
   - rendu de listes ou modales

---

## 3. Stack technique & dépendances

| Librairie | Version | Rôle dans le projet |
|---|---|---|
| react | ^19.2.4 | Framework UI principal |
| react-dom | ^19.2.4 | Rendu DOM React |
| react-router-dom | ^7.14.2 | Routage client |
| axios | ^1.16.1 | HTTP client API REST |
| tailwindcss | ^4.2.2 | Framework CSS utilitaire |
| @tailwindcss/vite | ^4.2.2 | Plugin Tailwind pour Vite |
| lucide-react | ^1.16.0 | Bibliothèque d’icônes SVG |
| typescript | ~5.9.3 | Typage statique |
| vite | ^8.0.1 | Bundler / dev server |
| @vitejs/plugin-react | ^6.0.1 | Plugin React pour Vite |
| eslint | ^9.39.4 | Linting |
| @eslint/js | ^9.39.4 | Base ESLint JS |
| eslint-plugin-react-hooks | ^7.0.1 | Règles React Hooks |
| eslint-plugin-react-refresh | ^0.5.2 | Support Hot Refresh |
| typescript-eslint | ^8.57.0 | ESLint TypeScript |

---

## 4. Système de design & conventions Tailwind

### Palette de couleurs et rôles sémantiques

- `amber` : action primaire, CTA, accent et label important
  - `bg-amber-500`, `text-amber-500`, `shadow-amber-200`
- `red` : danger / erreur / rupture / indisponibilité
  - `bg-red-100`, `text-red-600`, `dark:bg-red-900/20`
- `emerald` / vert : succès, actif, disponibilité
  - `bg-emerald-100`, `text-emerald-700`, `dark:text-emerald-400`
- `blue` : information, statut réservé, navigation
  - `bg-blue-100`, `text-blue-700`, `dark:text-blue-400`
- `yellow` / `orange` : warning, traitement, nettoyage, perte
  - `bg-yellow-100`, `text-yellow-700`, `orange-500`
- `purple` : rôle manager / dashboards de navigation
  - `bg-purple-500`
- `gray` : surfaces neutres, bordures, textes foncés/clairs
  - `bg-gray-50`, `text-gray-900`, `dark:bg-gray-950`

### Tokens d’espacement récurrents

- `p-6`, `p-8`, `p-4`, `p-3`
- `px-4`, `py-3`, `px-3`, `py-2.5`
- `gap-2`, `gap-3`, `gap-4`, `gap-6`
- `space-y-4`, `space-y-5`
- `max-w-md`, `max-w-6xl`, `max-w-sm`

### Tokens de forme

- `rounded-xl`, `rounded-2xl`, `rounded-lg`
- `border`, `border-2`, `border-gray-100`, `dark:border-gray-800`
- `shadow-sm`, `shadow-lg`, `shadow-2xl`, `shadow-amber-200`

### Pattern du mode sombre

- Le thème est géré en JS
  - `localStorage.setItem("theme", "dark")`
  - `document.documentElement.classList.add("dark")`
  - suppression / ajout de la classe `dark` sur `documentElement`
- Le thème est persistant
  - stocké dans `localStorage`
  - lu au chargement par `Navbar` et `LoginPage`
- CSS Tailwind
  - `@import "tailwindcss";`
  - `@custom-variant dark (&:where(.dark, .dark *));`
- Observations
  - Pas de `tailwind.config.ts` trouvé
  - le CSS se base sur les styles Tailwind par défaut
  - `index.css` contient deux fois `@import "tailwindcss";` (dédoublon possible)

### Pattern modal overlay

Classes utilisées systématiquement :

- Overlay :
  - `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm`
- Panel :
  - `bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-6`
- Z-index :
  - `z-50` sur le conteneur
  - Le modal couvre intégralement l’écran

### Pattern badge/statut

Pattern partagé via config :

- Structure commune :
  - `px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5`
- `StatutTableBadge` :
  - config-driven `statutConfig`
  - classes comme `bg-emerald-100`, `text-emerald-700`
- `RoleBadge` et `StatutBadge` :
  - mapping rôle → classes
  - formes consistantes

### Animations et transitions utilisées

- `transition-all duration-200`
- `hover:shadow-md`
- `hover:bg-*`
- `group-hover:scale-110`
- `animate-pulse` dans les badges d’alerte
- `animate-spin` sur les loaders `Loader2`

### Focus ring et accessibilité CSS

Présent sur les champs de formulaire :

- `focus:outline-none focus:ring-2 focus:ring-amber-400`
- `dark:focus:ring-amber-500`

Mais insuffisant sur les modals :

- Aucune modal n’implémente `role="dialog"`
- Pas de `aria-modal="true"`
- Pas de `aria-labelledby` ni `aria-describedby`
- Pas de focus trap ni gestion de la touche `Escape`

---

## 5. Composants UI — Catalogue complet

| Composant | Fichier | Props principales | Rôle | Pattern notable |
|---|---|---|---|---|
| `Layout` | `src/components/Layout.tsx` | `children` | Page shell global | Navbar + Sidebar layout |
| `Navbar` | `src/components/Navbar.tsx` | Aucun direct | Header avec thème et logout | dark mode + user info |
| `Sidebar` | `src/components/Sidebar.tsx` | Aucun direct | Menu de navigation par rôle | menu dynamique par rôle |
| `ProtectedRoute` | `src/components/ProtectedRoute.tsx` | `children` | Sécurise les routes | redirect /login |
| `LoginForm` | `src/ui/uiAuth/LoginForm.tsx` | `onSubmit`, `loading`, `error` | Formulaire d’auth | input contrôlé + password visible |
| `ThemeToggle` | `src/ui/uiAuth/ThemeToggle.tsx` | `dark`, `onToggle` | Bouton thème | icon button accessible |
| `DashboardCard` | `src/ui/uiDashboard/DashboardCard.tsx` | `title`, `description`, `icon`, `color`, `route` | Card de navigation | route push `useNavigate` |
| `DashboardResponsable` | `src/ui/uiDashboard/DashboardResponsable.tsx` | - | Dashboard rôle | cards statiques |
| `DashboardManager` | `src/ui/uiDashboard/DashboardManager.tsx` | - | Dashboard rôle | cards statiques |
| `DashboardServeur` | `src/ui/uiDashboard/DashboardServeur.tsx` | - | Dashboard rôle | cards statiques |
| `DashboardCuisiniere` | `src/ui/uiDashboard/DashboardCuisiniere.tsx` | - | Dashboard rôle | cards statiques |
| `DashboardCaissier` | `src/ui/uiDashboard/DashboardCaissier.tsx` | - | Dashboard rôle | cards statiques |
| `PlatCard` | `src/ui/uiPlats/PlatCard.tsx` | `plat`, `onEdit`, `onToggle`, `onDelete`, `onPerte` | Carte plat | actions multiples |
| `PlatFormModal` | `src/ui/uiPlats/PlatFormModal.tsx` | `isOpen`, `onClose`, `onSubmit`, `platToEdit` | Création / édition plat | modal formulaire |
| `TableCard` | `src/ui/uiTables/TableCard.tsx` | `table`, `onChangerStatut`, `onAcquitter`, `onSupprimer`, `isLoading`, `canDelete` | Carte table | état / actions statut |
| `StatutTableBadge` | `src/ui/uiTables/StatutTableBadge.tsx` | `statut` | Badge statut table | config-driven |
| `CreateTableModal` | `src/ui/uiTables/CreateTableModal.tsx` | `onClose`, `onSubmit` | Modal création table | form modal |
| `UserCard` | `src/ui/uiUsers/UserCard.tsx` | `user`, `onToggle`, `isLoading` | Carte utilisateur | rôle + actif |
| `RoleBadge` | `src/ui/uiUsers/RoleBadge.tsx` | `role` | Badge rôle | config-driven |
| `StatutBadge` | `src/ui/uiUsers/StatutBadge.tsx` | `actif` | Badge actif/inactif | simple état |
| `CreateUserModal` | `src/ui/uiUsers/CreateUserModal.tsx` | `onClose`, `onSubmit` | Modal création utilisateur | form modal |

### Composants les plus complexes

#### `PlatFormModal` — `src/ui/uiPlats/PlatFormModal.tsx`

- Props TypeScript
```ts
interface PlatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatRequest, file: File | null) => Promise<void>;
  platToEdit?: Plat | null;
}
```
- Comportement
  - Initialise localement `formData`
  - réinitialise les champs lors du changement de `platToEdit`
  - gère le fichier image en `File | null`
  - affiche `Loader2` pendant `onSubmit`
  - ferme le modal si l’API réussit
  - affiche un message d’erreur inline
- Classes Tailwind
  - overlay fixe : `fixed inset-0 z-50 ... bg-black/40 dark:bg-black/60`
  - panel : `bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border ...`
  - champs : `rounded-xl border border-gray-200 dark:border-gray-700 ... focus:ring-2 focus:ring-amber-400`
  - action buttons : `bg-amber-500 hover:bg-amber-600`

#### `CreateTableModal` — `src/ui/uiTables/CreateTableModal.tsx`

- Props TypeScript
```ts
interface CreateTableModalProps {
  onClose: () => void;
  onSubmit: (data: TableRequest) => Promise<void>;
}
```
- Comportement
  - contrôle le champ `numeroTable`
  - gère `loading` et `error`
  - appelle `onSubmit` puis `onClose`
- Classes Tailwind
  - overlay identique : `fixed inset-0 z-50 ...`
  - panel : `rounded-2xl shadow-2xl`
  - bouton disabled : `disabled:opacity-60`

#### `TableCard` — `src/ui/uiTables/TableCard.tsx`

- Props TypeScript
```ts
interface TableCardProps {
  table: TableResponse;
  onChangerStatut: (id: number, statut: StatutTable) => void;
  onAcquitter: (id: number) => void;
  onSupprimer: (id: number) => void;
  isLoading: boolean;
  canDelete: boolean;
}
```
- Comportement
  - montre l’état `statut`
  - propose des actions `nextStatuts`
  - gère `appelServeurActif`
  - désactive les actions via `isLoading`
- Classes Tailwind
  - container : `border-2 ... transition-all duration-200`
  - actions : `hover:bg-gray-50 dark:hover:bg-gray-800`
  - badges status : `bg-emerald-100 ...`

#### `UserCard` — `src/ui/uiUsers/UserCard.tsx`

- Props TypeScript
```ts
interface UserCardProps {
  user: UtilisateurResponse;
  onToggle: (id: number) => void;
  isLoading: boolean;
}
```
- Comportement
  - affiche avatar initials
  - bouton toggle actif/désactivé
  - bloque action si `isLoading`
- Classes Tailwind
  - layout : `bg-white dark:bg-gray-900 border ... rounded-2xl`
  - badges : `bg-blue-100 text-blue-700`
  - icon button : `hover:bg-red-50 ...`

#### `DashboardCard` — `src/ui/uiDashboard/DashboardCard.tsx`

- Props TypeScript
```ts
interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
}
```
- Comportement
  - navigation via `useNavigate(route)`
  - card clicable
- Classes Tailwind
  - card : `rounded-2xl bg-white dark:bg-gray-900 border ... hover:-translate-y-1`
  - icône : `${color} flex items-center justify-center mb-4`

---

## 6. Pages & routing

### Pages trouvées

| Page | Fichier | Chemin de route | Protection | Hooks consommés | Fonctionnalité principale |
|---|---|---|---|---|---|
| Login | `src/pages/LoginPage.tsx` | `/`, `/login` | public | `useAuth` | Connexion + redirection rôle |
| Dashboard | `src/pages/DashboardPage.tsx` | `/manager` | protégée | `useAuth` | dashboard adaptatif par rôle |
| Users | `src/pages/UsersPage.tsx` | `/users` | protégée | `useUtilisateur` | gestion du staff |
| Tables | `src/pages/TablesPage.tsx` | `/tables`, `/serveur` | protégée | `useTable`, `useAuth` | plan de salle |
| Plats | `src/pages/PlatsPage.tsx` | `/menu` | protégée | `usePlats` | CRUD plats |
| Profil | `src/pages/ProfilPage.tsx` | `/profil` | protégée | `useAuth`, `useUtilisateur` | édition profil personnel |

### Router complet

Le router est défini dans `src/router.tsx` avec `createBrowserRouter`.

Routes principales :

- `/` → `LoginPage`
- `/login` → `LoginPage`
- `/users` → `ProtectedRoute` → `UsersPage`
- `/manager` → `ProtectedRoute` → `DashboardPage`
- `/tables` → `ProtectedRoute` → `TablesPage`
- `/commandes` → `ProtectedRoute` → placeholder `Commandes — bientôt`
- `/menu` → `ProtectedRoute` → `PlatsPage`
- `/serveur` → `ProtectedRoute` → `TablesPage`
- `/cuisine` → `ProtectedRoute` → placeholder `Cuisine — bientôt`
- `/caisse` → `ProtectedRoute` → placeholder `Caisse — bientôt`
- `/profil` → `ProtectedRoute` → `ProfilPage`
- `*` → `NotFound` page

### Protection

- `ProtectedRoute` vérifie `useAuth().isAuthenticated()`
- si non authentifié → `Navigate to="/login" replace`
- `isAuthenticated()` vérifie uniquement l’existence du token en localStorage
- conséquence : si token expiré mais encore présent, l’utilisateur passe la protection jusqu’à l’appel API

---

## 7. Hooks — Logique métier & API

### `useAuth` — `src/hooks/useAuth.ts`

- Signature
```ts
export const useAuth = () => {
  const login = async (data: LoginRequest): Promise<LoginResponse> => ...
  const logout = () => ...
  const getToken = (): string | null => ...
  const getUser = (): LoginResponse | null => ...
  const isAuthenticated = (): boolean => ...
  return { login, logout, getToken, getUser, isAuthenticated };
};
```
- Endpoints API
  - `POST /api/auth/login`
- États exposés
  - pas d’état local `loading` / `error` dans le hook
- Effets de bord
  - `logout()` purge `localStorage` et redirige vers `/login`
  - `isAuthenticated()` lit `localStorage.token`

### `usePlats` — `src/hooks/usePlats.ts`

- Signature
```ts
export const usePlats = () => {
  plats: Plat[];
  loading: boolean;
  error: string | null;
  fetchPlats: () => Promise<void>;
  createPlat: (data: PlatRequest, file?: File | null) => Promise<void>;
  updatePlat: (id: number, data: PlatRequest, file?: File | null) => Promise<void>;
  toggleDisponible: (id: number) => Promise<void>;
  declarerPerte: (id: number, quantite: number) => Promise<void>;
  deletePlat: (id: number) => Promise<void>;
}
```
- Endpoints API
  - `GET /api/plats`
  - `POST /api/upload/image`
  - `POST /api/plats`
  - `PUT /api/plats/:id`
  - `PATCH /api/plats/:id/toggle`
  - `PATCH /api/plats/:id/perte/:quantite`
  - `DELETE /api/plats/:id`
- États exposés
  - `plats`
  - `loading`
  - `error`
- Effets notables
  - `fetchPlats` est mémorisé avec `useCallback`
  - chaque mutation appelle `fetchPlats()` pour resynchroniser la liste
  - `toggleDisponible`, `declarerPerte`, `deletePlat` silencieusement `console.error`

### `useTable` — `src/hooks/useTable.ts`

- Signature
```ts
export const useTable = () => {
  listerTables: () => Promise<TableResponse[]>;
  creerTable: (data: TableRequest) => Promise<TableResponse>;
  changerStatut: (id: number, statut: StatutTable) => Promise<TableResponse>;
  acquitterAppel: (id: number) => Promise<TableResponse>;
  supprimerTable: (id: number) => Promise<void>;
}
```
- Endpoints API
  - `GET /api/tables`
  - `POST /api/tables`
  - `PATCH /api/tables/:id/statut/:statut`
  - `PATCH /api/tables/:id/acquitter`
  - `DELETE /api/tables/:id`
- États exposés
  - aucun état interne : le composant consommateur gère `loading`
- Effets notables
  - simple wrapper d’API, aucun re-fetch automatique

### `useUtilisateur` — `src/hooks/useUtilisateur.ts`

- Signature
```ts
export const useUtilisateur = () => {
  listerUtilisateurs: () => Promise<UtilisateurResponse[]>;
  creerUtilisateur: (data: UtilisateurRequest) => Promise<UtilisateurResponse>;
  toggleActif: (id: number) => Promise<UtilisateurResponse>;
  modifierProfil: (data: UpdateProfilRequest) => Promise<UtilisateurResponse>;
}
```
- Endpoints API
  - `GET /api/utilisateurs`
  - `POST /api/utilisateurs`
  - `PATCH /api/utilisateurs/:id/desactiver`
  - `PATCH /api/utilisateurs/profil`
- États exposés
  - Aucun état interne, page gère `loading`
- Effets notables
  - l’en-tête Authorization est ajouté manuellement via `getHeaders()`
  - ne réutilise pas `axiosInstance`
  - `API_URL` est basé sur `import.meta.env.VITE_API_URL`

### `axiosInstance` — `src/hooks/axiosInstance.ts`

- `baseURL`
  - `import.meta.env.VITE_API_URL || "http://localhost:8080"`
- Request interceptor
  - lit `localStorage.getItem("token")`
  - ajoute `Authorization: Bearer ${token}`
- Response interceptor
  - si `error.response?.status === 401`
    - supprime `token` et `user` de `localStorage`
    - force `window.location.href = "/login"`
- Observations
  - `axiosInstance` centralise l’injection du token
  - `useUtilisateur` contourne ce pattern avec `axios` direct
  - `.env` définit `VITE_API_BASE_URL`, pas `VITE_API_URL` → mismatch

---

## 8. Types TypeScript — Modèle de données frontend

### Domaine Auth

#### `src/types/auth.ts`
```ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  nom: string;
  prenom: string;
}

export type Role =
  | "SERVEUR"
  | "CUISINIERE"
  | "CAISSIER"
  | "MANAGER"
  | "RESPONSABLE_PERSONNEL";
```

- `LoginRequest` : payload connexion
- `LoginResponse` : user payload + token
- `Role` : rôles back-office

### Domaine Plat

#### `src/types/plat.ts`
```ts
export type Categorie = 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';

export interface Plat {
  id: number;
  nom: string;
  description: string;
  prix: number;
  categorie: Categorie;
  disponible: boolean;
  allergenes: string;
  quantitePerdueJour: number;
  imageUrl: string;
}

export interface PlatRequest {
  nom: string;
  description: string;
  prix: number;
  categorie: Categorie;
  allergenes: string;
  imageUrl: string;
}
```

- `Plat` : correspond à l’entité menu/back-end
- `PlatRequest` : payload de création / update

### Domaine Table

#### `src/types/table.ts`
```ts
export type StatutTable =
  | "LIBRE"
  | "OCCUPEE"
  | "EN_COURS_DE_NETTOYAGE"
  | "RESERVEE";

export interface TableRequest {
  numeroTable: number;
}

export interface TableResponse {
  id: number;
  numeroTable: number;
  statut: StatutTable;
  qrCodeUrl: string;
  appelServeurActif: boolean;
  heureAppel: string | null;
}
```

- `TableResponse` : entité table côté backend
- `TableRequest` : payload création table

### Domaine Utilisateur

#### `src/types/utilisateur.ts`
```ts
export type Role =
  | "SERVEUR"
  | "CUISINIERE"
  | "CAISSIER"
  | "MANAGER"
  | "RESPONSABLE_PERSONNEL";

export interface UtilisateurRequest {
  username: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface UtilisateurResponse {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
}
```

- `UtilisateurResponse` : user account backend
- `UtilisateurRequest` : création de compte

### Domaine Profil

#### `src/types/profil.ts`
```ts
export interface UpdateProfilRequest {
  nom: string;
  prenom: string;
  username: string;
  password?: string;
}
```

- utilisé pour modification `ProfilPage`

---

## 9. Gestion de l'authentification

### 1. Login

- `LoginPage` utilise `useAuth()`
- `handleLogin(username, password)` appelle :
```ts
const response = await login({ username, password });
```
- `useAuth.login()` exécute :
```ts
axiosInstance.post<LoginResponse>("/api/auth/login", data);
```
- Sur succès :
  - `localStorage.setItem("token", response.token)`
  - `localStorage.setItem("user", JSON.stringify(response))`
  - redirection selon rôle :
    - `RESPONSABLE_PERSONNEL → /users`
    - `MANAGER → /manager`
    - `SERVEUR → /serveur`
    - `CUISINIERE → /cuisine`
    - `CAISSIER → /caisse`

### 2. Protection des routes

- `ProtectedRoute` vérifie :
```ts
const { isAuthenticated } = useAuth();
if (!isAuthenticated()) return <Navigate to="/login" replace />;
```
- `isAuthenticated()` vérifie uniquement l’existence du token en localStorage
- conséquence : si token expiré mais encore présent, l’utilisateur passe la protection jusqu’à l’appel API

### 3. Injection automatique du token

- `axiosInstance` request interceptor :
```ts
const token = localStorage.getItem("token");
if (token) config.headers.Authorization = `Bearer ${token}`;
```
- appliqué sur toutes les requêtes via `axiosInstance`

### 4. Gestion expiration/401

- response interceptor :
```ts
if (error.response?.status === 401) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
```
- effet :
  - purge token et user
  - redirection forcée vers `/login`
- remarque :
  - `useUtilisateur` n’utilise pas `axiosInstance`, donc cette gestion 401 n’est pas automatique là-dessus

### 5. Logout

- `Navbar` appelle `logout()` :
```ts
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.href = "/login";
```
- pas de callback global, redirection directe

---

## 10. Conventions de code & patterns récurrents

### Nommage

- Composants React : `PascalCase`
  - ex. `LoginPage`, `Sidebar`, `DashboardCard`
- Hooks : `camelCase` préfixé `use`
  - ex. `useAuth`, `usePlats`, `useTable`, `useUtilisateur`
- Types : `PascalCase`
  - ex. `LoginResponse`, `TableResponse`
- Fichiers : `PascalCase.tsx` pour composants et pages, `camelCase.ts` pour hooks

### Export

- Composants de pages et composants principaux : `export default`
  - ex. `export default LoginPage`
- Composants UI atomiques / utilitaires : `export const`
  - ex. `export const LoginForm`, `export const ThemeToggle`
- Types : `export interface`, `export type`

### Pattern gestion d'état local dans les formulaires

- Formulaire login :
  - `useState` par champ
  - `const [username, setUsername] = useState("")`
  - `const [password, setPassword] = useState("")`
- Profil utilisateur :
  - objet unique `const [form, setForm] = useState<UpdateProfilRequest>(...)`
- Création utilisateur / plat :
  - objet unique `useState` pour les formulaires complexes
- Pattern constaté
  - champs simples → state individuel
  - formulaires plus nombreux → objet `form`

### Pattern feedback utilisateur

- loading spinner :
  - `<Loader2 size={32} className="animate-spin ..."/>`
- disabled button :
  - `disabled:opacity-60 disabled:cursor-not-allowed`
- message d’erreur inline :
  - `bg-red-50 dark:bg-red-900/20 text-red-600`
- succès inline :
  - `bg-emerald-50 dark:bg-emerald-900/20`

### Convention d’icônes

- Icônes Lucide utilisées partout
- Taille standard :
  - `size={16}`, `size={18}`, `size={24}`, `size={32}`
- Couleurs par classe Tailwind
  - `className="text-amber-500"`
- Icône seule utilise souvent `button` sans `aria-label`
  - exemple `CreateTableModal` close button

### Convention de props optionnelles vs requises

- optionnelles
  - `platToEdit?: Plat | null`
- requises
  - `onSubmit`, `onClose`, `user`, `table`
- bonne pratique globale : la plupart des props critiques sont requises

---

## 11. Configuration & outillage

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- Plugins :
  - `@vitejs/plugin-react`
  - `@tailwindcss/vite`
- Pas d’alias personnalisé (`@/`)
- Pas de proxy configuré ici

### `tsconfig.json`

- Cible les builds par `tsconfig.app.json` et `tsconfig.node.json`
- Pas d’options supplémentaires directes

### `tsconfig.app.json`

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `jsx: "react-jsx"`
- `moduleResolution: "bundler"`
- `allowImportingTsExtensions: true`

### `tsconfig.node.json`

- ciblage Node pour `vite.config.ts`
- mêmes options strictes que l’app

### Tailwind

- Pas de `tailwind.config.ts` trouvé
- `src/index.css` contient :
```css
@import "tailwindcss";
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```
- utilisation de Tailwind v4 via plugin Vite
- aucun thème custom externe déclaré

### `.env`

- Contenu :
```env
VITE_API_BASE_URL=http://localhost:8080
```
- Observation critique :
  - le code utilise `VITE_API_URL`
  - variable `.env` ne correspond pas → potentielle erreur de configuration

### `eslint.config.js`

- extend :
  - `js.configs.recommended`
  - `typescript-eslint.configs.recommended`
  - `reactHooks.configs.flat.recommended`
  - `reactRefresh.configs.vite`
- règles notables :
  - `ecmaVersion: 2020`
  - `globals: globals.browser`
- pas de règles custom supplémentaires

### `nginx.conf`

- proxy API vers `http://backend-service:8080`
- SPA fallback :
  - `try_files $uri $uri/ /index.html;`
- location `/api/` proxifiée
- déploiement prévu en container Docker

### `Dockerfile`

- build multi-stage
- image de build : `node:20-alpine`
- copie `package*.json` + `npm install`
- build `npm run build`
- image finale : `nginx:stable-alpine`
- expose 80
- copie `dist` dans Nginx
- remarque :
  - `ARG VITE_API_BASE_URL`
  - `ENV VITE_API_BASE_URL=$VITE_API_BASE_URL`
  - mais le code lit `VITE_API_URL`

---

## 12. Recommandations & prochaines étapes

### Priorité haute — Qualité & maintenabilité

1. Composants partagés manquants (Button, Input, Modal de base)
   - Problème : duplication des classes de boutons, champs, modales, badges
   - Solution : créer `BaseButton`, `BaseInput`, `BaseModal`, `Badge`
   - Avant :
     ```tsx
     <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 ...">
     ```
   - Après :
     ```tsx
     <Button variant="primary" loading={loading}>Créer</Button>
     ```
2. Tokens Tailwind non externalisés dans `tailwind.config.ts`
   - Problème : pas de `tailwind.config.ts`, classes dupliquées
   - Solution : ajouter configuration Tailwind + palette + tokens `colors`, `borderRadius`, `boxShadow`
3. Duplication de logique dans les hooks
   - Problème : `usePlats` re-fetchs multiples, `useUtilisateur` contourne `axiosInstance`
   - Solution : centraliser dans `axiosInstance`, factoriser `useApi` ou `useMutation`

### Priorité haute — Accessibilité

4. ARIA manquant sur les modals (role="dialog", aria-modal, aria-labelledby)
5. Focus trap absent dans les modals
6. Gestion Escape key pour fermer les modals

### Priorité moyenne — Tests

7. Tests unitaires hooks critiques (`useAuth`, `useTable`) avec Vitest + Testing Library
8. Tests composants (snapshots, interactions)
9. Tests accessibilité automatisés (axe-core)

### Priorité basse — Architecture évolutive

10. Considérer React Query ou SWR pour remplacer les hooks API manuels
11. Contexte global pour les notifications/toasts
12. Code splitting par route (React.lazy + Suspense)

---

## 13. Fichiers de référence rapide

| Fichier | Chemin | Pourquoi le consulter en premier |
|---|---|---|
| Router | `src/router.tsx` | Définit toutes les routes et protections |
| Auth hook | `src/hooks/useAuth.ts` | Flux login / logout / token |
| Axios | `src/hooks/axiosInstance.ts` | Base URL + interceptors 401 |
| Hook utilisateur | `src/hooks/useUtilisateur.ts` | Logique API non centralisée |
| Page plats | `src/pages/PlatsPage.tsx` | Flux CRUD menu / modale |
| Page tables | `src/pages/TablesPage.tsx` | Gestion du plan et statut |
| UI modal | `src/ui/uiPlats/PlatFormModal.tsx` | Exemple modal le plus riche |
| UI badges | `src/ui/uiTables/StatutTableBadge.tsx` | Pattern d’état config-driven |
| Docker | `Dockerfile` | Stratégie de build/déploiement |
| Proxy | `nginx.conf` | Proxy API backend dans Docker |
| Env | `.env` | Variable locale utilisée en runtime |
| Config TS | `tsconfig.app.json` | Options strictes du projet |
| ESLint | `eslint.config.js` | Règles linting, plugins React |

---

### Observations globales

- Architecture simple et compréhensible
- Bon découpage `pages` / `ui` / `hooks`
- Manque de composants UI partagés et de centralisation de la logique API
- Très bonne couverture de rôles métier
- Quelques placeholders route `/commandes`, `/cuisine`, `/caisse` à compléter
- Besoin d’aligner la configuration env et le code pour que le build Docker fonctionne correctement

---

Ce rapport repose sur l’analyse complète des fichiers réels du workspace.

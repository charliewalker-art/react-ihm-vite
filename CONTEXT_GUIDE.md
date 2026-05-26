# CONTEXT GUIDE — Projet React + Vite + TypeScript

Ce document résume les conventions de style, d'architecture UI et de gestion d'API observées dans le projet, pour un transfert clair à d'autres développeurs ou IA.

## 1 — Framework CSS & Thème
- Outil : Tailwind CSS (importé dans [src/index.css](src/index.css#L1)). Usage massif de classes utilitaires directement dans le JSX.
- Mode sombre : bascule en ajoutant/enlevant la classe `dark` sur `document.documentElement`. Le thème est persisté dans `localStorage` (implémentation dans `src/components/Navbar.tsx`).
- Palette & rôles des couleurs : `amber` = couleur d'action/primaire, `gray` = fonds/textes, puis `emerald`, `red`, `blue`, `yellow`, `orange`, `green`, `purple` pour statuts/badges.
- Espacement & tailles récurrentes : `px-3/4`, `py-2/2.5/3`, `p-4/6`, `gap-2/3/4`, et dimensions utilitaires `w-8/h-8`, `w-12/h-12`.
- Rayons & surfaces : `rounded-xl`, `rounded-2xl`, `rounded-full`, `shadow-sm` / `shadow-lg` pour hiérarchie visuelle.
- Bordures/accents : `border-gray-100/200` et `border-2` pour surligner (ex. `TableCard`).
- Focus & transitions : `focus:ring-2 focus:ring-amber-400`, `transition-all duration-200/300`.
- Modal overlay pattern : `fixed inset-0 bg-black/40 backdrop-blur-sm z-50` + panel centré `max-w-md rounded-2xl shadow-2xl`.

## 2 — Conventions de composants
- Définition : composants fonctionnels en arrow functions (`const X = (...) => {}`) (ex. `Layout`, `Navbar`, `Sidebar`).
- Typage : interfaces/types TypeScript pour les props (types centralisés dans `src/types`).
- Exports : composants atomiques exportés nommément (`export const ...`), layouts/pages souvent export par défaut (`export default ...`).
- Organisation :
  - `ui/` : composants atomiques (badges, cards, modals)
  - `components/` : layout & navigation
  - `pages/` : vues
  - `hooks/` : logique API/state
  - `types/` : modèles
- Pattern : composants petits, composables, props explicites → rendu via classes Tailwind.

## 3 — Gestion des états & API
- Architecture : logique API dans des hooks dédiés (`useAuth`, `useTable`, `useUtilisateur`) ; pas de store global externe (Redux, etc.).
- Instance HTTP centralisée : `src/hooks/axiosInstance.ts` crée un `axios` central avec `baseURL`, injection automatique du header `Authorization` depuis `localStorage`, et intercepteur réponse gérant `401` (purge token + redirect `/login`).
- Hooks exposent fonctions CRUD/patch/delete et retournent promises — les composants consomment ces fonctions et gèrent `loading` / `error` en `useState` local.
- Auth : `useAuth` expose `login`, `logout`, `getUser`, `getToken`, `isAuthenticated` et stocke user/token dans `localStorage`.
- Conventions d'erreur : affichage d'erreurs via état local (`error`) dans formulaires et modals.

## 4 — Design Patterns UI (Modals / Badges / Cards)
- Modals : overlay + panel centré, header avec titre et fermeture, formulaire, boutons `Annuler/Confirmer`, `disabled` + spinner pour loading. Exemple : [src/ui/uiUsers/CreateUserModal.tsx](src/ui/uiUsers/CreateUserModal.tsx#L1).
- Badges : pattern config-driven — mapping `key → { label, className[, dot] }` puis rendu d'un `span` stylé (`rounded-full px-2.5 py-1 text-xs font-semibold`). Ex. `RoleBadge`, `StatutTableBadge`.
- Cards : conteneur `bg-white dark:bg-gray-900 rounded-2xl border-2 p-5`, couleur/bordure pilotée par statut, actions compactes `rounded-xl text-xs`, icônes `lucide-react`, feedback `animate-pulse` / `animate-spin`. Ex. [src/ui/uiTables/TableCard.tsx](src/ui/uiTables/TableCard.tsx#L1).
- Feedback : icônes + animations pour attirer l'attention (alertes, loaders), boutons utilisent `disabled:opacity`.
- Accessibilité : utilisations de `form`, `button`, `label`, et `required` sur inputs — mais très peu d'ARIA ou de gestion du focus (recommandation : ajouter `role="dialog"`, `aria-modal`, focus-trap dans les modals).

## 5 — Conventions de code & bonnes pratiques observées
- Typage TypeScript cohérent et présent dans `src/types`.
- Séparation claire : hooks pour la logique métier/API, UI pour rendu.
- Icônes : `lucide-react` utilisé partout.
- Routing : `react-router-dom` (`createBrowserRouter`) + `ProtectedRoute`.
- Thème : contrôle du mode sombre côté client via `localStorage` et modification du DOM.

## 6 — Recommandations & améliorations prioritaires
1. Extraire composants réutilisables `Button`, `Input`, `Modal` pour réduire duplication des classes Tailwind et standardiser comportements (disabled, loading, variants).
2. Externaliser tokens / palette dans `tailwind.config.ts` (définir `colors.primary = amber`, spacing tokens) pour cohérence et évolutivité.
3. Améliorer accessibilité : ajouter ARIA sur modals, gérer focus trap et retours clavier (Esc), vérifier contraste couleurs.
4. Ajouter tests unitaires pour hooks critiques (`useAuth`, `useTable`) et tests UI (snapshots, a11y).
5. Envisager un petit contexte global pour notifications & erreurs partagées (pour éviter duplication de toasts et prop drilling).

## 7 — Fichiers de référence rapide
- [src/index.css](src/index.css#L1)
- [src/hooks/axiosInstance.ts](src/hooks/axiosInstance.ts#L1)
- [src/hooks/useAuth.ts](src/hooks/useAuth.ts#L1)
- [src/ui/uiUsers/CreateUserModal.tsx](src/ui/uiUsers/CreateUserModal.tsx#L1)
- [src/ui/uiUsers/RoleBadge.tsx](src/ui/uiUsers/RoleBadge.tsx#L1)
- [src/ui/uiTables/TableCard.tsx](src/ui/uiTables/TableCard.tsx#L1)

---

Si vous le souhaitez, je peux :
- générer des composants partagés `Button`/`Input`/`Modal` et remplacer quelques usages.
- créer une checklist PR/issue list pour implémenter les améliorations ci‑dessus.

Fin du guide.

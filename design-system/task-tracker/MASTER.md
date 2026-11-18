# Design System — Task Tracker

> Source de vérité visuelle du front. Si `pages/<nom>.md` existe, ses règles priment sur ce fichier.

**Produit :** outil interne de suivi de projets et de tâches (une petite agence).
**Direction :** sobre, inspirée de ClickUp (vue liste, pastilles de statut, barre latérale), sans effets.
**Style :** Minimalism & Swiss. **Réglages :** variance 3/10, mouvement 2/10, densité 7/10.
**Généré avec** `ui-ux-pro-max` (`--design-system`), puis adapté : palette violette à la place du teal proposé, pattern « application » à la place du pattern landing page, pas de GSAP.

---

## Couleurs (tokens CSS)

Aucune valeur hexadécimale en dur dans les composants : tout passe par ces variables.

| Rôle | Hex | Variable | Contraste |
|---|---|---|---|
| Primaire | `#5B4FD6` | `--color-primary` | 5,9:1 sur blanc |
| Sur primaire | `#FFFFFF` | `--color-on-primary` | 5,9:1 |
| Primaire (survol) | `#4A3FC0` | `--color-primary-hover` | |
| Primaire léger (fonds, sélection) | `#EEEDFC` | `--color-primary-subtle` | |
| Fond de page | `#F8F9FB` | `--color-background` | |
| Surface (cartes, lignes) | `#FFFFFF` | `--color-surface` | |
| Texte | `#1E293B` | `--color-foreground` | 14:1 sur blanc |
| Texte secondaire | `#475569` | `--color-muted-foreground` | 7,5:1 sur blanc |
| Bordure | `#E2E8F0` | `--color-border` | |
| Bordure des champs | `#64748B` | `--color-border-input` | 4,8:1 sur blanc (minimum 3:1, WCAG 1.4.11) |
| Danger | `#DC2626` | `--color-destructive` | 4,8:1 sur blanc |
| Focus | `#5B4FD6` | `--color-ring` | |

**Statuts** (toujours une pastille avec **libellé** ; la couleur ne porte jamais l'information seule) :

| Statut | Fond | Texte |
|---|---|---|
| À faire | `#F1F5F9` | `#475569` |
| En cours | `#DBEAFE` | `#1D4ED8` |
| Terminée | `#DCFCE7` | `#166534` |

**Priorités** (pastille avec **libellé** et **icône**, jamais la couleur seule) :

| Priorité | Fond | Texte | Icône |
|---|---|---|---|
| Basse | `#CCFBF1` | `#115E59` | flèche vers le bas |
| Normale | `#EEEDFC` | `#4A3FC0` | tiret |
| Haute | `#FEE2E2` | `#991B1B` | flèche vers le haut |

Variables `--color-priority-{low|normal|high}-{bg|fg}`. Teintes volontairement différentes de celles des statuts pour ne pas confondre les deux pastilles.

**Couleur de la ligne de tâche** : elle suit le **statut**, pas la priorité (la priorité se lit sur sa propre pastille). Une bordure gauche de 4 px reprend la couleur du texte de la pastille de statut, et le fond est une teinte plus claire que la pastille, pour que la pastille de priorité reste visible dessus :

| Statut | Bande | Fond (`--color-status-*-row`) |
|---|---|---|
| À faire | `#475569` | `#FFFFFF` |
| En cours | `#1D4ED8` | `#F5F9FF` |
| Terminée | `#166534` | `#F0FDF4` |

La couleur est décorative : le statut est aussi écrit dans l'en-tête du groupe et dans le sélecteur de la ligne. Le texte « En retard » en `--color-destructive` garde un contraste d'au moins 4,5:1 sur ces fonds.

Échéance dépassée : texte `--color-destructive` + libellé « En retard ».

## Typographie

- **Plus Jakarta Sans** pour les titres et le texte, chargée avec `next/font/google` (pas de `@import` CSS).
- Corps 16 px, interligne 1,5. Titre de page 24 px / 600, titre de section 18 px / 600, libellé et méta 14 px (jamais moins de 12 px).
- Chiffres tabulaires (`font-variant-numeric: tabular-nums`) pour les compteurs et les dates.

## Espacement, formes, ombres

- Échelle de 4 px : `4 / 8 / 12 / 16 / 24 / 32 / 48`.
- Rayons : 6 px (champs, boutons), 10 px (cartes). Pas de rayon plus grand.
- Ombres : `--shadow-sm: 0 1px 2px rgb(15 23 42 / 0.06)` uniquement. On sépare les blocs avec des bordures, pas avec des ombres épaisses.
- Pas de dégradé, pas de flou, pas de translation au survol.

## Mise en page

- **Ordinateur (≥ 1024 px)** : barre latérale fixe de 256 px (liste des projets, bouton « Nouveau projet »), contenu à droite, largeur max 960 px.
- **Mobile (< 1024 px)** : barre du haut avec menu qui ouvre la liste des projets ; contenu pleine largeur, gouttières de 16 px.
- Vérifier à 375, 768, 1024 et 1440 px. Aucun scroll horizontal (`min-w-0`, textes qui passent à la ligne ou sont tronqués proprement).
- Mobile-first : les styles de base sont ceux du mobile, `md:` et `lg:` ajoutent.

## Composants

**Bouton** : hauteur 44 px minimum (cible tactile), rayon 6 px, `font-weight: 600`.
- *Primaire* : fond `--color-primary`, texte `--color-on-primary`. Un seul par écran.
- *Secondaire* : fond surface, bordure `--color-border-input`.
- *Danger* : texte et bordure `--color-destructive`, fond rempli seulement dans la boîte de confirmation.
- Bouton qui envoie : désactivé avec un libellé d'attente (« Enregistrement… ») pour éviter le double envoi.

**Champ de formulaire** (`Field`) : libellé **visible** au-dessus (pas de placeholder seul), indication facultative (« facultatif ») dans le libellé, aide en texte secondaire, **message d'erreur sous le champ** en `--color-destructive` avec une icône, relié par `aria-describedby`, et `aria-invalid="true"` sur le champ. Bordure et anneau de focus visibles (2 px `--color-ring`). Taille de police 16 px (évite le zoom automatique sur iOS).

**Ligne de tâche** (vue liste) : titre, pastille de statut, échéance, actions. Sur mobile, les méta passent sous le titre et les actions restent accessibles à 44 px. Groupes par statut avec en-tête et compteur.

**Carte projet** (accueil) : nom, description sur 2 lignes maximum, date de création, nombre de tâches (« 5 tâches », accord au singulier et au pluriel). Toute la carte est un lien.

**Confirmation de suppression** : boîte de dialogue (`<dialog>`) qui nomme l'élément supprimé et, pour un projet, prévient que ses tâches seront supprimées aussi. Le bouton de confirmation décrit l'action (« Supprimer le projet »).

**États** : chaque liste a un état vide qui explique quoi faire et propose l'action principale ; chaque page qui charge des données a un état de chargement (`loading.tsx`) sans saut de mise en page ; les erreurs ont un message clair et un moyen de réessayer.

## Mouvement

- Transitions de 150 à 200 ms sur la couleur, la bordure et l'ombre uniquement (jamais sur la largeur ou la hauteur).
- `@media (prefers-reduced-motion: reduce)` : transitions désactivées.
- Aucune animation de défilement, aucune librairie d'animation.

## Accessibilité

- Contraste du texte 4,5:1 minimum, éléments d'interface 3:1 minimum.
- Navigation complète au clavier, focus **toujours visible** (`:focus-visible`), ordre logique, lien « Aller au contenu ».
- Icônes : **Lucide** (SVG), décoratives en `aria-hidden`, un bouton qui n'a qu'une icône porte un `aria-label`.
- Pas d'emoji comme icône. `lang="fr"` sur `<html>`. Dates affichées avec `Intl.DateTimeFormat('fr-FR')`.
- `cursor: pointer` sur tout élément cliquable.

## À éviter

- Page d'accueil marketing, héros, vidéo de démonstration, onboarding.
- Statut indiqué par la couleur seule.
- Erreurs de formulaire regroupées uniquement en haut de page.
- Texte gris clair sur fond gris, texte de moins de 12 px.
- Valeurs de couleur ou d'espacement écrites en dur dans les composants.

## Check-list avant livraison d'une page

- [ ] Rendu correct à 375, 768, 1024 et 1440 px, sans scroll horizontal
- [ ] Cibles tactiles ≥ 44 px, focus visible, parcours complet au clavier
- [ ] Erreurs affichées sous les champs concernés, avec `aria-invalid` et `aria-describedby`
- [ ] États vide, chargement et erreur présents
- [ ] Contrastes vérifiés, statuts avec libellé
- [ ] `prefers-reduced-motion` respecté

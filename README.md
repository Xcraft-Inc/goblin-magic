# 📘 Documentation du module goblin-magic

## Aperçu

Le module **goblin-magic** est une bibliothèque de composants d'interface utilisateur moderne pour le framework Xcraft. Il fournit un ensemble complet de widgets React stylisés avec un design "glassmorphism" et des fonctionnalités avancées de navigation multi-onglets et multi-fenêtres. Le module inclut également un acteur de navigation sophistiqué qui gère l'orchestration des vues, des onglets et des dialogues dans l'écosystème Xcraft.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est organisé autour de deux composants principaux :

1. **L'acteur MagicNavigation** : Gère la navigation multi-onglets et multi-fenêtres
2. **Les widgets Magic** : Collection de composants UI modernes et réutilisables

### Architecture des widgets

Les widgets sont organisés en catégories :

- **Composants de base** : MagicButton, MagicTextField, MagicCheckbox, MagicRadio, etc.
- **Composants de saisie spécialisés** : MagicDateField, MagicTimeField, MagicNumberField, MagicColorField, etc.
- **Composants de layout** : MagicBox, MagicDiv, MagicBackground, InputGroup, etc.
- **Composants avancés** : MagicTable, MagicNavigation, MagicDialog, MagicSelect, etc.
- **Utilitaires** : Menu, Dialog, Splitter, Movable, etc.

## Fonctionnement global

### Système de navigation

L'acteur **MagicNavigation** orchestre un système de navigation complexe basé sur :

- **Windows** : Fenêtres de l'application (correspondant aux desktops Xcraft)
- **Panels** : Panneaux contenant des onglets au sein d'une fenêtre
- **Tabs** : Onglets individuels affichant des vues
- **Dialogs** : Boîtes de dialogue modales ou non-modales

### Gestion des états

Chaque vue (onglet ou dialogue) peut avoir :

- Un service associé (acteur Elf ou Goblin)
- Un widget d'affichage
- Des propriétés spécifiques
- Un état de mise en évidence
- Une vue parente (pour la navigation hiérarchique)

### Système de style

Les widgets utilisent un système de style cohérent avec :

- Support des thèmes sombre/clair automatique
- Variables CSS personnalisables (`--text-color`, `--accent-color`, `--field-background-color`, etc.)
- Effets glassmorphism avec backdrop-filter
- Animations et transitions fluides
- Système de couleurs adaptatif avec `color-mix()`

## Exemples d'utilisation

### Navigation de base

```javascript
const mainNavigation = await new MagicNavigation(this).api(
  'magicNavigation@main'
);

// Ouvrir un nouvel onglet avec un acteur Elf
const tabId = await mainNavigation.openTab(
  {
    service: MyService, // Classe Elf
    serviceArgs: [param1, param2],
    widget: 'MyWidget',
    widgetProps: {title: 'Mon titre'},
  },
  desktopId
);

// Ouvrir un onglet avec un acteur Goblin
const tabId = await mainNavigation.openTab(
  {
    service: 'myGoblinService',
    serviceArgs: {param1, param2},
    widget: 'MyWidget',
    widgetProps: {title: 'Mon titre'},
  },
  desktopId
);

// Ouvrir une boîte de dialogue
const dialogId = await mainNavigation.openDialog(
  {
    widget: 'ConfirmDialog',
    widgetProps: {
      prompt: 'Êtes-vous sûr ?',
      kind: 'yes-no',
    },
  },
  parentId
);

// Attendre la fermeture et récupérer le résultat
const result = await mainNavigation.waitClosed(dialogId);
```

### Utilisation des widgets

```javascript
// Formulaire avec widgets Magic
<MagicBox>
  <MagicLabel>
    Nom :
    <MagicTextField
      value={C('.name')}
      onChange={this.setName}
      placeholder="Entrez votre nom"
      emojiPicker
    />
  </MagicLabel>

  <MagicLabel>
    Date et heure :
    <MagicDatetimeField
      value={C('.datetime')}
      onChange={this.setDatetime}
      requiredDate
    />
  </MagicLabel>

  <MagicLabel>
    Couleur :
    <MagicColorField value={C('.color')} onChange={this.setColor} />
  </MagicLabel>

  <MagicButton onClick={this.save} spinner={this.state.saving}>
    Enregistrer
  </MagicButton>
</MagicBox>
```

### Tableau avec tri et sélection

```javascript
<MagicTable
  data={this.props.items}
  columns={[
    {title: 'Nom', id: 'name', sortable: true},
    {title: 'Date', id: 'date', type: 'date', sortable: true},
    {
      title: 'Actions',
      renderItem: (item) => (
        <MagicButton onClick={() => this.edit(item)}>Éditer</MagicButton>
      ),
    },
  ]}
  selectable
  onSelectionChange={this.handleSelection}
  onRowClick={this.handleRowClick}
/>
```

### Menu contextuel

```javascript
<Menu>
  <Menu.Button>
    <MagicButton>Options</MagicButton>
  </Menu.Button>
  <Menu.Content>
    <Menu.Item onPointerUp={this.handleEdit}>Éditer</Menu.Item>
    <Menu.Item onPointerUp={this.handleDuplicate}>Dupliquer</Menu.Item>
    <Menu.Hr />
    <Menu.Item onPointerUp={this.handleDelete}>Supprimer</Menu.Item>
  </Menu.Content>
</Menu>
```

## Interactions avec d'autres modules

### Avec xcraft-core-goblin

- Utilise `Elf.birth()` pour exposer l'acteur MagicNavigation
- Intègre le système de quêtes et d'états Xcraft
- Gère le cycle de vie des services associés aux vues

### Avec goblin-laboratory

- Hérite de `Widget` pour tous les composants
- Utilise `withC()` pour la connexion aux états
- Intègre le système de traduction avec `goblin-nabu`

### Avec xcraft-core-converters

- Utilise les convertisseurs pour les champs de date/heure/nombre
- Gestion du parsing et formatage des données
- Support des calendriers et fuseaux horaires

### Avec le système de fenêtrage

- Communique avec le gestionnaire de fenêtres via `client` API
- Gère les événements de fermeture de fenêtres
- Synchronise l'état avec les sessions client

## Détails des sources

### `magicNavigation.js`

Point d'entrée qui expose l'acteur MagicNavigation sur le bus Xcraft via `Elf.birth()`.

### `widgets/magic-navigation/service.js`

#### État et modèle de données

L'acteur utilise plusieurs shapes pour structurer son état :

- **MagicNavigationShape** : État racine contenant les fenêtres, panneaux et onglets
- **WindowShape** : Structure d'une fenêtre avec ses panneaux et dialogues
- **PanelShape** : Structure d'un panneau avec ses onglets et historique
- **ViewStateShape** : État d'une vue (onglet ou dialogue)

#### Méthodes publiques

- **`create(id, desktopId, clientSessionId, existingWindowId)`** — Initialise l'acteur de navigation avec une session client et optionnellement une fenêtre existante.
- **`openTab(view, desktopId, modifiers)`** — Ouvre un onglet selon les modificateurs (Ctrl pour mise en évidence, Alt pour nouvelle fenêtre).
- **`openDialog(view, parentId, modal, openNew)`** — Ouvre une boîte de dialogue modale ou non-modale.
- **`activateTab(tabId, keepHistory)`** — Active un onglet spécifique avec gestion optionnelle de l'historique.
- **`closeTab(tabId, result)`** — Ferme un onglet et émet un événement avec le résultat.
- **`moveTabToNewWindow(tabId)`** — Déplace un onglet vers une nouvelle fenêtre.
- **`moveTabToPanel(tabId, nextPanel)`** — Déplace un onglet vers un panneau adjacent.
- **`duplicateTab(tabId)`** — Duplique un onglet existant.
- **`confirm(parentId, prompt, options)`** — Affiche une boîte de confirmation et retourne le résultat.
- **`prompt(parentId, prompt, advice, okLabel, cancelLabel, initialValue)`** — Affiche une boîte de saisie et retourne la valeur.
- **`alert(parentId, prompt, advice)`** — Affiche une boîte d'alerte.
- **`replace(viewOrServiceId, view, desktopId, back)`** — Remplace une vue par une autre avec support de navigation arrière.
- **`back(viewOrServiceId, desktopId)`** — Navigue vers la vue précédente.
- **`waitClosed(viewOrServiceId)`** — Attend la fermeture d'une vue et retourne son résultat.

### `widgets/magic-navigation/widget.js`

Composant React principal qui rend l'interface de navigation avec support des onglets multiples, panneaux divisibles et dialogues. Gère les raccourcis clavier globaux (Ctrl+W, Ctrl+Tab, Alt+←, etc.) et la navigation au clavier.

### `widgets/magic-navigation/view-context.js`

Contexte React qui fournit l'accès aux informations de la vue courante. Expose un HOC `withView` pour injecter les données de vue dans les composants.

### `widgets/dialog/widget.js`

Composant de base pour les dialogues HTML5 avec support des portails React, gestion des événements de fermeture et contrôle de l'affichage modal/non-modal. Inclut la gestion du clic extérieur pour fermeture.

### `widgets/element-helpers/element-has-direct-text.js`

Fonction utilitaire qui détermine si un élément HTML contient du texte directement (pas dans des éléments enfants). Parcourt les nœuds enfants et vérifie la présence de nœuds texte non vides.

### `widgets/element-helpers/is-empty-area-element.js`

Fonction qui détermine si un élément et ses parents sont des zones "vides" (non-interactives) jusqu'à un élément d'arrêt donné. Utilise `isFlatElement` et `elementHasDirectText` pour la détection.

### `widgets/element-helpers/is-flat-element.js`

Identifie les éléments HTML non-interactifs (DIV, SECTION, etc.) qui n'ont pas de rôles ARIA interactifs. Utilisé pour déterminer les zones cliquables pour les interactions de fermeture.

### `widgets/get-modifiers/get-modifiers.js`

Normalise les modificateurs clavier entre plateformes. Sur macOS, inverse les touches Cmd et Ctrl pour une expérience utilisateur cohérente. Détecte automatiquement la plateforme via l'user agent.

### `widgets/input-group/widget.js`

Conteneur pour grouper des champs de saisie avec des boutons. Crée une interface unifiée avec bordures partagées et styles harmonisés pour les champs composés.

### `widgets/input-group/styles.js`

Styles pour le groupement de champs avec gestion des bordures arrondies, couleurs de focus et états des boutons groupés. Utilise des sélecteurs CSS avancés pour les éléments adjacents.

### `widgets/magic-action/widget.js`

Composant d'action stylisé avec effets de survol animés, support des états sélectionné/désactivé et intégration avec le système de commandes Xcraft via `doFor`.

### `widgets/magic-action/styles.js`

Styles pour les actions avec animations de taille au survol, effets de text-shadow pour l'état sélectionné et gestion des états désactivés.

### `widgets/magic-background/widget.js`

Composant de fond avec effets visuels dynamiques incluant des dégradés aurora et des images de fond qui s'adaptent au thème sombre/clair. Support des propriétés CSS personnalisées pour les animations et couleurs d'accent.

### `widgets/magic-background/styles.js`

Styles avancés avec propriétés CSS personnalisées, dégradés animés, images de fond et adaptation automatique au thème via media queries. Inclut les effets aurora avec transitions fluides.

### `widgets/magic-box/widget.js`

Conteneur moderne avec scroll automatique intégré, combinant MagicDiv et MagicScroll pour créer des zones de contenu avec design glassmorphism.

### `widgets/magic-box-old/widget.js`

Version legacy du conteneur avec positionnement absolu, différents thèmes d'humeur (unicorn, sunset, velvet) et bouton de fermeture optionnel. Conservée pour compatibilité.

### `widgets/magic-button/widget.js`

Bouton moderne avec états visuels avancés, support des icônes, spinner de chargement et différentes variantes (simple, grand, activé). Gestion automatique des spans pour le texte et optimisation des icônes SVG.

### `widgets/magic-button/styles.js`

Styles complets pour les boutons avec états hover/active/focus, animations de scale, gestion des icônes et spinner CSS. Support des variantes et adaptation responsive.

### `widgets/magic-checkbox/widget.js`

Case à cocher stylisée avec support des petites tailles, états visuels cohérents avec le design system et gestion des labels intégrés.

### `widgets/magic-checkbox/styles.js`

Styles pour les checkboxes avec animations de coche, états de focus et variantes de taille. Utilise des pseudo-éléments pour les coches personnalisées.

### `widgets/magic-color-field/widget.js`

Sélecteur de couleur combinant un champ texte et un bouton de prévisualisation avec sélecteur natif. Utilise InputGroup pour une présentation unifiée.

### `widgets/magic-date-field/widget.js`

Champ de date avec parsing intelligent, navigation clavier avancée (flèches pour incrémenter, Ctrl+flèches pour naviguer entre sections) et intégration avec xcraft-core-converters.

### `widgets/magic-datetime-field/widget.js`

Combinaison date/heure utilisant MagicDateField et MagicTimeField avec gestion des fuseaux horaires et parsing des dates ISO.

### `widgets/magic-dialog/widget.js`

Système de dialogue moderne avec support du déplacement (via Movable), fermeture par clic extérieur et gestion des événements clavier (Échap). Distinction entre dialogues modaux et non-modaux.

### `widgets/magic-div/widget.js`

Div stylisée avec effets glassmorphism, adaptation automatique au thème et variables CSS personnalisables pour un design cohérent.

### `widgets/magic-emoji/widget.js`

Sélecteur d'emoji utilisant emoji-mart avec menu déroulant, adaptation automatique du thème et localisation française.

### `widgets/magic-emoji-picker/widget.js`

Composant de sélection d'emoji standalone utilisant emoji-mart avec configuration complète (thème, couleurs, localisation).

### `widgets/magic-inplace-input/widget.js`

Champ d'édition en place avec apparition des bordures au survol/focus, idéal pour l'édition inline de contenus.

### `widgets/magic-input/widget.js`

Composant de base pour tous les champs de saisie avec support de l'édition contenteditable, navigation automatique entre champs (Entrée), intégration du sélecteur d'emoji et gestion avancée de la sélection de texte.

### `widgets/magic-label/widget.js`

Label stylisé avec layout flexbox pour aligner correctement les champs de saisie et leurs étiquettes.

### `widgets/magic-number-field/widget.js`

Champ numérique avec boutons +/-, validation min/max, incrémentation par flèches (Shift pour x10) et parsing intelligent des valeurs.

### `widgets/magic-panel/widget.js`

Panneau coulissant avec animation, bouton de fermeture et raccourcis clavier pour l'affichage/masquage.

### `widgets/magic-radio/widget.js`

Bouton radio stylisé avec gestion des groupes, états visuels modernes et support des labels.

### `widgets/magic-scroll/widget.js`

Zone de défilement avec styles optimisés et gestion des marges pour les titres en début de contenu.

### `widgets/magic-select/widget.js`

Composant de sélection avec menu déroulant, support des options sous forme d'objet ou de tableau, rendu personnalisable des éléments et intégration avec le système Menu.

### `widgets/magic-table/widget.js`

Tableau avancé avec tri multi-colonnes, sélection multiple, filtrage automatique et rendu personnalisable des cellules. Utilise un reducer pour gérer l'état de tri et un système d'observation des mutations pour la synchronisation DOM.

### `widgets/magic-table/reducer.js`

Reducer Redux pour gérer l'état du tableau (tri, menu, colonnes). Gère les actions d'initialisation, basculement de menu et tri des colonnes avec cycle asc/desc/neutre.

### `widgets/magic-table/styles.js`

Styles CSS Grid pour le tableau avec en-têtes collants, tri visuel, sélection de lignes et indicateurs de tri. Gestion des zebra stripes et états hover/active.

### `widgets/magic-tag/widget.js`

Étiquettes stylisées avec bordures arrondies, support des actions (onClick) et états désactivés.

### `widgets/magic-text-field/widget.js`

Champ de texte principal avec support du parsing/formatage, validation, sélecteur d'emoji optionnel et listes de données (datalist). Base pour la plupart des autres champs spécialisés.

### `widgets/magic-time-field/widget.js`

Champ d'heure avec parsing intelligent, navigation par sections (heures/minutes) et incrémentation par flèches avec support des pas personnalisés.

### `widgets/magic-timer/widget.js`

Composant de minuteur avec affichage temps réel, contrôles play/pause et calcul automatique de la durée écoulée.

### `widgets/magic-zen/widget.js`

Mode plein écran avec fond personnalisable, notice d'aide pour la sortie (Échap) et rendu en portal pour l'isolation visuelle.

### `widgets/main-tabs/widget.js`

Onglets principaux avec états visuels avancés (actif, mis en évidence), support des thèmes et intégration avec TabLayout.

### `widgets/menu/widget.js`

Système de menu contextuel complet avec sous-menus, positionnement intelligent, navigation clavier et support des raccourcis. Gestion automatique de la position selon l'espace disponible à l'écran.

### `widgets/menu/styles.js`

Styles pour le système de menu avec positionnement dynamique, effets glassmorphism, sous-menus et états d'interaction. Gestion des backdrop et animations.

### `widgets/movable/widget.js`

Rend les éléments déplaçables par glisser-déposer avec contraintes de fenêtre, détection des zones vides et gestion fluide du curseur.

### `widgets/splitter/widget.js`

Diviseur redimensionnable utilisant react-splitter-layout avec styles personnalisés et indicateurs visuels en pointillés.

### `widgets/tab-layout/widget.js`

Layout pour onglets avec gestion des états actifs, événements de clic et structure flexbox optimisée.

### `widgets/with-computed-size/widget.js`

HOC pour calculer la taille des éléments avec rendu conditionnel, utile pour le positionnement dynamique des menus et dialogues.

---

_Ce document a été mis à jour pour refléter l'état actuel du module goblin-magic avec ses fonctionnalités complètes de navigation et d'interface utilisateur modernes._
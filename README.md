# 📘 goblin-magic

## Aperçu

Le module **goblin-magic** est une bibliothèque de composants d'interface utilisateur pour le framework Xcraft. Il fournit un système complet de widgets React au design « glassmorphism » (boutons, champs de saisie, calendriers, tableaux, menus, dialogues, etc.) ainsi qu'un ensemble d'acteurs **Elf** dédiés à l'orchestration de la navigation applicative : gestion multi-fenêtres, multi-panneaux, multi-onglets, boîtes de dialogue, et navigation « maître-détail ». Le module inclut également deux acteurs utilitaires (`WidgetWithNav` et `WidgetWithQuest`) qui simplifient l'intégration des widgets React avec le bus de quêtes Xcraft.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)
- [Licence](#licence)

## Structure du module

Le module s'articule autour de trois familles d'éléments :

1. **Les acteurs Elf de navigation**

   - [`MagicNavigation`](#widgetsmagic-navigationservicejs) : acteur singleton central qui gère les fenêtres, panneaux, onglets et dialogues de l'application.
   - [`DetailNavigation`](#widgetsdetail-navigationservicejs) : acteur instanciable qui gère un panneau maître/détail avec historique de navigation.
   - [`WidgetWithNav`](#widgetswidget-with-navservicejs) et [`WidgetWithQuest`](#widgetswidget-with-questservicejs) : acteurs utilitaires facilitant l'ouverture de dialogues depuis un widget React et l'exécution de quêtes avec attente de résultat.

2. **Les widgets React « Magic »** : une collection de composants de base (`MagicButton`, `MagicTextField`, `MagicCheckbox`, `MagicRadio`, `MagicSelect`, etc.), de composants de saisie spécialisés (`MagicDateField`, `MagicTimeField`, `MagicDatetimeField`, `MagicNumberField`, `MagicColorField`, `MagicTriggerField`), de composants de mise en page (`MagicBox`, `MagicDiv`, `MagicBackground`, `InputGroup`) et de composants avancés (`MagicTable`, `MagicOverlay`, `MagicDialog`, `MagicZen`, `MagicNavigation` widget).

3. **Les utilitaires transverses** : `Menu`, `Dialog`/`CancelableDialog`/`MenuDialog`, `Popover`, `Splitter`, `Movable`, `Resizer`, `ListenerStack`, les helpers de calendrier (`calendar-helpers.js`, `SmallCalendar`, `YearMonth`), les helpers d'éléments DOM (`element-helpers`) et les helpers d'intervalles de temps (`time-interval`).

## Fonctionnement global

### Le système de navigation principal (`MagicNavigation`)

L'acteur singleton `magicNavigation@main` orchestre une hiérarchie :

```
Window (desktopId)
 ├─ Panel(s)
 │   └─ Tab(s) → View { serviceId | widget, widgetProps }
 └─ Dialog(s) → View { serviceId | widget, widgetProps, parentViewId }
```

- Une **fenêtre** (`window`) correspond à un desktop Xcraft (une session client). Elle contient un ou plusieurs **panneaux** et éventuellement des **dialogues**.
- Un **panneau** (`panel`) contient une liste ordonnée d'**onglets** ainsi qu'un historique des derniers onglets actifs (`lastTabIds`), utilisé pour déterminer quel onglet activer après la fermeture de l'onglet courant.
- Chaque **onglet** ou **dialogue** référence une **vue** (`ViewState`) : soit un service (acteur Elf ou Goblin) attaché au feed du desktop, soit simplement un widget avec des propriétés statiques.

L'acteur maintient en mémoire (hors état persisté) une `Map` `views` qui associe l'identifiant de chaque onglet/dialogue à sa définition complète (`View`), ce qui permet de retrouver une vue existante identique (même service, mêmes arguments, mêmes propriétés) via `findExistingView` et d'éviter la duplication d'onglets lors d'une nouvelle ouverture (`activateOrOpenTab`, `highlightOrOpenTab`).

Le comportement d'ouverture d'un onglet dépend des modificateurs clavier (`Ctrl`, `Alt`/`Cmd`) transmis à `openTab` :

- Sans modificateur : active l'onglet existant ou en crée un nouveau (`activateOrOpenTab`).
- `Ctrl` : met en évidence l'onglet existant sans l'activer, ou l'ouvre en arrière-plan (`highlightOrOpenTab`).
- `Alt`/`Cmd` : ouvre une nouvelle fenêtre dédiée (`openTabInNewWindow`).

### Cycle de vie d'une fenêtre

Chaque fenêtre correspond à une session client ouverte via l'API `client.openSession`. L'acteur s'abonne à l'événement `<window-closed>` du gestionnaire de fenêtres (`xcraft-core-server`/labs) pour détecter sa fermeture et nettoyer l'état (`handleWindowClosed`), désabonner le listener et supprimer les vues associées de la `Map` `views`.

### Navigation maître-détail (`DetailNavigation`)

`DetailNavigation` est un acteur instanciable qui gère un panneau « détail » affiché à côté d'un widget parent (via `Splitter`), avec :

- Un historique de navigation (`detailHistory`) permettant de revenir en arrière (`backDetail`).
- L'ouverture du détail dans un nouvel onglet principal (`openNewTab`/`openDetailInNewTab`).
- Le remplacement du widget parent par le détail courant (`replaceParent`).

Il délègue la résolution du type d'entité et du service Elf correspondant à une table `services` (dictionnaire `type → classe Elf`) fournie à la création.

### Widgets/quêtes (`WidgetWithNav` / `WidgetWithQuest`)

`WidgetWithQuest` est un acteur `Elf.Alone` (singleton) qui permet à un widget React d'invoquer une quête backend et d'en attendre le résultat de façon asynchrone, en stockant temporairement le résultat dans son état (`results[questId]`) et en le nettoyant après lecture. `WidgetWithNav` s'appuie sur `WidgetWithQuest` pour ouvrir des dialogues via `MagicNavigation` depuis un widget et en attendre la fermeture (`openDialogForResult`), tout en gardant la trace des dialogues ouverts par desktop pour pouvoir les fermer automatiquement au démontage du composant ou à la réinitialisation du desktop.

### Système de style

Les widgets utilisent un système de style cohérent basé sur des variables CSS (`--text-color`, `--accent-color`, `--button-accent-color`, `--field-background-color`) mélangées avec `color-mix()`, un support natif du thème sombre/clair via `@media (prefers-color-scheme)`, ainsi qu'une prise en charge du mode « transparence réduite » (`.prefers-reduced-transparency`). Les effets de flou (`backdrop-filter`) et les ombres portées donnent l'esthétique « glassmorphism » caractéristique du module.

## Exemples d'utilisation

### Navigation principale : ouvrir un onglet et un dialogue

```javascript
const mainNavigation = await new MagicNavigation(this).api(
  'magicNavigation@main'
);

// Ouvrir un nouvel onglet avec un acteur Elf
const tabId = await mainNavigation.openTab(
  {
    service: MyService, // classe Elf
    serviceArgs: [param1, param2],
  },
  desktopId
);

// Ouvrir une boîte de confirmation et attendre la réponse
const confirmed = await mainNavigation.confirm(
  desktopId,
  'Voulez-vous vraiment supprimer cet élément ?',
  {kind: 'yes-no'}
);
```

### Navigation maître-détail

```javascript
const services = {
  contact: ContactService,
  invoice: InvoiceService,
};

const detailNav = await new DetailNavigation(this).create(
  detailNavigationId,
  desktopId,
  parentWorkitemId,
  services
);

// Ouvre (ou ferme si déjà ouvert) le détail d'une entité
await detailNav.open('contact@1234');
```

### Ouvrir un dialogue depuis un widget React (`WidgetWithNav`)

```javascript
class MyWidget extends WidgetWithNav {
  handleEdit = async () => {
    const result = await this.openDialogForResult(
      {
        service: EditDialogService,
        serviceArgs: [this.props.id],
      },
      this.props.id
    );
    if (result) {
      // traiter le résultat...
    }
  };
}
```

### Formulaire avec les widgets Magic

```javascript
<MagicBox>
  <MagicLabel>
    Nom :
    <MagicTextField value={C('.name')} onChange={this.setName} emojiPicker />
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
    Rappel :
    <MagicTriggerField
      value={C('.reminder')}
      onChange={this.setReminder}
      kind="event"
    />
  </MagicLabel>

  <MagicButton onClick={this.save} spinner={this.state.saving}>
    Enregistrer
  </MagicButton>
</MagicBox>
```

## Interactions avec d'autres modules

- **[xcraft-core-goblin]** : socle des acteurs `Elf` (`Elf.Spirit`, `Elf.Sculpt`, `Elf.Alone`, `Elf.birth`) utilisés par `MagicNavigation`, `DetailNavigation`, `WidgetWithNav` et `WidgetWithQuest`.
- **[xcraft-core-stones]** : définition des shapes d'état (`string`, `option`, `array`, `record`, `boolean`, `object`).
- **[xcraft-core-shredder]** : état immuable utilisé dans le reducer de `MagicTable`.
- **[xcraft-core-utils]** : verrous (`locks.js`) utilisés par `MagicNavigation` pour synchroniser `highlightOrOpenTab`.
- **[xcraft-core-converters]** : conversion/formatage des dates, heures, nombres et durées pour les champs `MagicDateField`, `MagicTimeField`, `MagicNumberField`, `MagicTriggerField`, `SmallCalendar`, `YearMonth`.
- **goblin-laboratory** : classe de base `Widget` pour tous les composants React, helpers de connexion (`withC`, `C`, `Widget.connect`, `Widget.connectBackend`), `WithModel`, `ErrorHandler`.
- **goblin-nabu** : traduction des libellés d'interface via le composant `T`.
- Le module s'appuie enfin sur le service `client` (fenêtrage) pour ouvrir de nouvelles fenêtres (`openSession`) et sur `xcraft-core-server`/le warehouse Xcraft (`quest.warehouse.graft`) pour déplacer un service d'un feed (fenêtre) à un autre lors du déplacement d'un onglet.

## Configuration avancée

Le module ne possède pas de fichier `config.js` ; il ne définit donc aucune configuration avancée via `xcraft-core-etc`.

## Détails des sources

### `magicNavigation.js`, `detailNavigation.js`, `widgetWithNav.js`, `widgetWithQuest.js`

Ces quatre fichiers, situés à la racine du module, sont les points d'entrée qui exposent respectivement les acteurs `MagicNavigation`, `DetailNavigation`, `WidgetWithNav` et `WidgetWithQuest` sur le bus Xcraft via `Elf.birth(Actor, ActorLogic)`.

### `widgets/magic-navigation/service.js`

Définit l'acteur singleton `MagicNavigation` (identifiant conventionnel `magicNavigation@main`), pièce maîtresse du module.

#### État et modèle de données

- **`MagicNavigationShape`** : état racine, avec `windowIds` (ordre des fenêtres), `windows` (dictionnaire `WindowShape`), `panels` (dictionnaire `PanelShape`) et `tabs` (dictionnaire `ViewStateShape`, qui contient aussi bien les onglets que les dialogues).
- **`WindowShape`** : `panelIds`, `dialogIds`, `activePanelId`.
- **`PanelShape`** : `tabIds`, `currentTabId` (optionnel), `lastTabIds` (pile d'historique pour la réactivation après fermeture).
- **`ViewStateShape`** : `serviceId` (optionnel), `widget` (optionnel, requis si `serviceId` absent), `widgetProps`, `highlighted`, `parentViewId` (pour les dialogues en cascade) et `tabId` (utilisé lors d'une restauration).

En complément de l'état persisté, l'acteur maintient en mémoire une `Map<id, View>` (`this.views`) qui conserve la définition complète de chaque vue (service, arguments, widget, vue précédente pour la navigation arrière) — non persistée car elle peut contenir des références non sérialisables (classes Elf).

#### Cycle de vie

- **`create(id, desktopId, clientSessionId, existingWindowId?, existingLabId?)`** — Initialise l'acteur ; si une fenêtre existe déjà (redémarrage), s'y abonne pour détecter sa fermeture.
- L'acteur ne possède pas de quête `delete` explicite dans le sens instanciable classique, mais une méthode **`delete()`** qui désabonne tous les listeners de fermeture de fenêtres lors de sa destruction.

#### Méthodes publiques

- **`openEmptyWindow(rootWidget = 'yeti-root')`** — Ouvre une nouvelle fenêtre vide (session client) avec un panneau unique sans onglet.
- **`openTab(view, desktopId, modifiers?)`** — Point d'entrée principal pour ouvrir un onglet ; le comportement dépend des modificateurs clavier (voir [Fonctionnement global](#fonctionnement-global)).
- **`openNewTab(view, desktopId, panelId?, activateTab = true)`** — Crée un nouvel onglet dans un panneau donné (ou déduit du panneau actif) et instancie le service associé si nécessaire ; émet un événement `${tabId}-opened`.
- **`openTabInNewWindow(view, desktopId)`** — Ouvre l'onglet dans une toute nouvelle fenêtre.
- **`activateOrOpenTab(view, desktopId)`** / **`highlightOrOpenTab(view, desktopId, panelId?)`** — Réutilisent une vue existante identique si trouvée (`findExistingView`), sinon en créent une nouvelle.
- **`activateTab(tabId, keepHistory = false)`** — Active un onglet et met à jour l'historique du panneau.
- **`highlightTab(tabId)`** — Marque un onglet comme mis en évidence sans l'activer.
- **`moveTab(tabId, dstPanelId, dstIndex)`**, **`moveTabToPanel(tabId, nextPanel?)`**, **`moveTabToWindow(tabId, dstWindowId)`**, **`moveTabToNewWindow(tabId)`** — Déplacent un onglet entre positions/panneaux/fenêtres, en transférant le service associé vers le nouveau feed via `quest.warehouse.graft` si nécessaire.
- **`duplicateTab(tabId)`** — Duplique la vue d'un onglet dans le même panneau.
- **`closeTab(tabId, result?)`**, **`closeCurrentTab(desktopId)`**, **`closeView(desktopId, viewId, result?)`**, **`requestClose(desktopId, viewId, result?)`** — Ferment un onglet ou un dialogue ; `requestClose` interroge d'abord le service via `onCloseRequested` pour permettre l'annulation ; `closeView` ferme récursivement les dialogues enfants (`parentViewId`).
- **`openDialog(view, parentId, modal = true, openNew = false)`** / **`closeDialog(desktopId, dialogId, result?)`** — Ouvrent/ferment une boîte de dialogue rattachée à une fenêtre ou à une vue parente.
- **`confirm(parentId, prompt, options?)`**, **`prompt(parentId, prompt, options?)`**, **`alert(parentId, prompt, advice?)`** — Raccourcis de haut niveau au-dessus de `openDialog` + `waitClosed` pour les dialogues standards.
- **`replace(viewOrServiceId, view, desktopId, back = false)`** / **`back(viewOrServiceId, desktopId)`** — Remplacent le contenu d'une vue tout en conservant la vue précédente pour permettre un retour arrière.
- **`switchTab(desktopId, reverse?)`**, **`activateTabIndex(desktopId, index)`**, **`backCurrentTab(desktopId)`** — Raccourcis de navigation clavier (Ctrl+Tab, Ctrl+chiffre, Alt+←).
- **`waitClosed(viewOrServiceId)`** — Attend l'événement `${viewId}-closed` et retourne son résultat ; utilisé par toutes les méthodes de dialogue synchrones.
- **`moveDialogToTab(viewOrServiceId, desktopId)`** — Convertit un dialogue en onglet.

### `widgets/magic-navigation/widget.js`

Composant React principal qui rend l'ensemble de l'arborescence de navigation (panneaux, onglets, vues, dialogues) pour une fenêtre donnée. Gère les raccourcis clavier globaux : `Ctrl+W` (fermer l'onglet courant), `Ctrl+O` (ouvrir par identifiant), `Ctrl+Tab`/`Ctrl+Shift+Tab` (changer d'onglet), `Ctrl/Alt+1-9` (activer un onglet par index), `Alt+←`/`Cmd+←` (retour arrière). Le rendu s'appuie sur des sous-composants internes (`MagicNavigationPanels`, `MagicNavigationPanel`, `MagicNavigationTabs`, `MagicNavigationTab`, `MagicNavigationViews`, `MagicNavigationDialogs`) connectés à l'état backend via `C()`/`withC`. Chaque onglet propose, via un menu contextuel, les actions déplacer (panneau gauche/droit, nouvelle fenêtre), mettre en évidence, dupliquer et fermer. `MultiSplitter` répartit récursivement plusieurs panneaux dans des `Splitter` imbriqués.

Exemple d'intégration minimal :

```javascript
<MagicNavigation
  id="magicNavigation@main"
  windowId={desktopId}
  widgets={{contact: ContactWidget, invoice: InvoiceWidget}}
/>
```

### `widgets/magic-navigation/view-context.js`

Contexte React (`ViewContext`) qui fournit l'accès à la vue courante (identifiant, propriétés, visibilité) à tous les descendants d'un onglet ou d'un dialogue. Expose le HOC **`withView(Component)`** pour injecter la vue en prop.

### `widgets/magic-navigation/with-window-number.js` / `with-is-main-window.js`

`withWindowNumber` connecte un composant à l'index de la fenêtre courante dans `windowIds` (via `DesktopIdContext`). `withIsMainWindow` dérive de ce numéro une prop booléenne `isMainWindow` (vrai pour la première fenêtre ouverte).

### `widgets/magic-navigation/with-parent-id.js`

HOC **`withParentId`** qui injecte l'identifiant du service de la vue courante (`serviceId`) comme prop `parentId`, utile pour ouvrir des dialogues enfants rattachés à la vue affichée.

### `widgets/detail-navigation/service.js`

Définit l'acteur instanciable **`DetailNavigation`**, dédié à l'affichage d'un panneau de détail à côté d'un widget « maître ».

#### État et modèle de données

**`DetailNavigationShape`** : `parentWorkitemId` (identifiant du workitem parent), `detailId` (optionnel, entité actuellement affichée en détail), `detailServiceId` (optionnel, service instancié pour ce détail) et `detailHistory` (pile des détails précédemment consultés).

#### Cycle de vie

- **`create(id, desktopId, parentWorkitemId, services, detailId?)`** — Crée l'acteur, mémorise la table `services` (dictionnaire `type → classe Elf`) et ouvre éventuellement un détail initial.
- **`delete()`** — Aucune action spécifique (vide).

#### Méthodes publiques

- **`open(entityId, modifiers?)`** — Ouvre l'entité en détail ; si `Ctrl` est enfoncé, l'ouvre plutôt dans un nouvel onglet principal via `MagicNavigation` ; si l'entité est déjà affichée, ferme le détail (bascule).
- **`changeDetail(detailId, useHistory = true)`** — Instancie le service correspondant au type de l'entité et remplace le détail courant, en détruisant l'ancien service.
- **`backDetail()`** — Revient au détail précédent de l'historique, ou ferme le panneau si l'historique est vide.
- **`closeDetail()`** — Ferme le détail courant et émet l'événement `closed`.
- **`openNewTab(entityId, modifiers?)`** / **`openDetailInNewTab(modifiers?)`** — Ouvrent l'entité (ou le détail courant) dans un nouvel onglet de la navigation principale (`magicNavigation@main`).
- **`replaceParent()`** — Remplace le widget du workitem parent par le détail actuellement affiché (navigation « plein écran » du détail).

### `widgets/detail-navigation/widget.js`

Composant React **`DetailNavigation.MainDetail`** qui affiche, via un `Splitter`, le contenu principal (enfants ou fonction de rendu recevant `{open, detailId, detailServiceId}`) et le panneau de détail correspondant au type de l'entité (`detailWidgets`, dictionnaire `type → composant`). Fournit dans les actions du détail des boutons « ouvrir dans un nouvel onglet » et « fermer le détail ».

### `widgets/widget-with-nav/service.js`

Acteur instanciable **`WidgetWithNav`** qui garde la trace, par desktop, des dialogues ouverts depuis les widgets afin de pouvoir les fermer automatiquement (au démontage d'un composant ou lors de la réinitialisation d'un desktop).

#### Méthodes publiques

- **`openDialog(desktopId, args)`** — Ouvre un dialogue via `MagicNavigation.openDialog(...args)` et l'enregistre dans l'état.
- **`waitClosed(desktopId, dialogId)`** — Attend la fermeture du dialogue puis nettoie son enregistrement.
- **`closeDialogs(desktopId, dialogIds)`** / **`resetDesktop(desktopId)`** — Ferment un ensemble de dialogues, notamment tous ceux ouverts pour un desktop donné.

### `widgets/widget-with-nav/widget.js`

Classe de base React **`WidgetWithNav`** (étend `WidgetWithQuest`) qui expose la méthode **`openDialogForResult(view, parentId)`** : ouvre un dialogue via l'acteur `WidgetWithNav` (identifiant conventionnel `widgetWithNav@magicNavigation@main`) et attend son résultat. Ferme automatiquement les dialogues restés ouverts au démontage du composant, et réinitialise les dialogues du desktop au premier montage.

### `widgets/widget-with-quest/service.js`

Acteur singleton **`WidgetWithQuest`** (`Elf.Alone`) qui permet à un widget d'exécuter une quête sur un service backend et d'en récupérer le résultat.

#### Méthodes publiques

- **`doQuest(questId, serviceId, questName, questArgs)`** — Invoque `service[questName](questArgs)` via `quest.getAPI` et stocke le résultat sous `results[questId]`.
- **`clearResult(questId)`** — Supprime le résultat une fois consommé.

### `widgets/widget-with-quest/widget.js`

Classe de base React **`WidgetWithQuest`** qui expose **`doQuest(serviceId, questName, questArgs)`** : génère un identifiant de quête, déclenche l'action `widgetWithQuest.doQuest`, attend (via une souscription au résultat backend et un composant interne `DidUpdate`) que le résultat apparaisse dans l'état, puis nettoie ce résultat. C'est le mécanisme bas niveau utilisé par `WidgetWithNav.openDialogForResult`.

### `widgets/calendar-helpers.js`

Bibliothèque de fonctions utilitaires pures pour manipuler des dates calendaires (`plainDate` au format `YYYY-MM-DD`) et des plages horodatées (`zonedDateTime`), utilisée par `SmallCalendar`, `YearMonth` et les champs de date.

- **`getMonthStart(plainDate, monthDiff?)`** / **`getMonthEnd(plainDate, monthDiff?)`** — Premier/dernier jour du mois, avec décalage optionnel.
- **`addDays(plainDate, days)`** — Ajoute (ou retranche) un nombre de jours.
- **`getWeekNumber(date)`** — Numéro de semaine ISO 8601.
- **`getWeekStart(date?)`** — Premier jour (lundi) de la semaine contenant la date donnée.
- **`setSameDay(plainDate, otherPlainDate)`** — Applique le jour du mois d'une autre date, en revenant au dernier jour valide du mois si nécessaire (utile lors des changements de mois/année dans les champs de date).
- **`setMonth(plainDate, monthIndex)`** — Change le mois (0-11) en conservant le jour dans la limite du mois cible.
- **`getMonthNames(locale, format, options?)`** — Génère les 12 noms de mois localisés, avec option de mise en majuscule initiale.
- **`generateWeekStarts(startDate, numWeeks)`** — Génère les dates de début de `numWeeks` semaines consécutives.
- **`generateDays(firstDate, numDays = 7)`** — Génère `numDays` jours consécutifs à partir d'une date.
- **`eventIsInDay({start, end}, day)`** / **`eventIsInDays(event, firstDay, lastDay)`** — Déterminent si un événement (avec `start`/`end` au format `zonedDateTime`) recouvre un jour ou une plage de jours donnée.

### `widgets/small-calendar/widget.js` et `widgets/small-calendar-grid/widget.js`

**`SmallCalendar`** est un sélecteur de date compact avec navigation par jour/mois/année (boutons et flèches), un menu déroulant pour choisir directement le mois, et un raccourci « aujourd'hui ». La navigation au clavier (flèches, entrée) est gérée par `handleKeyDown`. **`SmallCalendarGrid`** affiche la grille des semaines du mois (avec numéros de semaine) en s'appuyant sur `calendar-helpers.js` et met en surbrillance le jour sélectionné et le jour courant (via `CurrentDay`).

### `widgets/calendar-menu/widget.js` et `widgets/calendar-menu-content/widget.js`

**`CalendarMenu`** enveloppe un déclencheur (`children`) dans un `Menu` dont le contenu est un `CalendarMenuContent` : un petit calendrier (`SmallCalendar`) avec boutons Annuler/Valider et, si `allowEmpty`, un bouton Effacer.

### `widgets/year-month/widget.js`, `widgets/year-month-grid/widget.js`, `widgets/year-month-menu/widget.js`

Équivalents de `SmallCalendar`/`SmallCalendarGrid`/`CalendarMenu` mais pour la sélection d'un couple année-mois (type `yearMonth`) plutôt qu'une date précise : **`YearMonth`** affiche deux grilles de 12 mois (année courante et suivante) via **`YearMonthsGrid`**, avec navigation par mois/année. **`YearMonthMenu`** propose le même sélecteur dans un menu déroulant, avec boutons Annuler/Valider/Effacer.

### `widgets/magic-date-field/widget.js`, `widgets/magic-time-field/widget.js`, `widgets/magic-datetime-field/widget.js`

**`MagicDateField`** et **`MagicTimeField`** sont des champs texte spécialisés basés sur `MagicTextField`, avec parsing/formatage via `xcraft-core-converters`, navigation par sections au clavier (`Ctrl+←`/`Ctrl+→`) et incrémentation par flèches haut/bas (`Shift` pour un pas plus grand, ou pour incrémenter la semaine sur le champ date). Ils intègrent un bouton associé : un `CalendarMenu` pour la date, une icône d'horloge (non interactive) pour l'heure. **`MagicDatetimeField`** combine les deux, en gérant la construction/décomposition d'une valeur `zonedDateTime` unique.

### `widgets/magic-number-field/widget.js`

Champ numérique avec boutons +/- (`InputGroup`), validation `min`/`max`, incrémentation par flèches clavier (`Shift` multiplie le pas par 10) et parsing via `xcraft-core-converters`.

### `widgets/magic-color-field/widget.js`

Champ combinant un `MagicTextField` (valeur texte de la couleur) et un bouton `MagicColorFieldButton` ouvrant un sélecteur de couleur natif (`<input type="color">`), avec aperçu de la couleur courante.

### `widgets/magic-trigger-field/widget.js`

Champ composite permettant de définir un déclencheur temporel relatif (ex. « 15 minutes avant le début de l'événement ») : combine un `MagicNumberField`, un `MagicSelect` pour l'unité de durée (secondes à semaines) et un `MagicSelect` pour la relation (avant/après le début/la fin), en s'appuyant sur `xcraft-core-converters/lib/duration.js` pour la décomposition/inversion des durées. Le paramètre `kind` (`'event'` ou `'task'`) adapte les libellés affichés.

### `widgets/magic-input/widget.js`, `widgets/magic-text-field/widget.js`, `widgets/magic-inplace-input/widget.js`

**`MagicInput`** est le composant bas niveau partagé par tous les champs texte : il gère indifféremment un `<input>`, un `<textarea>` (`rows`) ou une div `contenteditable` (`autoRows`, via le sous-composant interne `EditableDiv`), la navigation automatique vers le champ suivant à la touche Entrée, et un sélecteur d'emoji optionnel (`emojiPicker`, raccourci `Ctrl+Espace`) ouvert dans un `MagicDialog`. **`MagicTextField`** ajoute le style visuel standard et le support d'une `dataList`. **`MagicInplaceInput`** est une variante sans bordure visible tant que le champ n'est pas survolé/focalisé, pour l'édition en place.

### `widgets/magic-select/widget.js`

Sélecteur basé sur `Menu`, acceptant soit des enfants `<option>`, soit une prop `options` (objet ou tableau `{value, text}`). Affiche la valeur sélectionnée (ou son libellé) dans le bouton déclencheur et propose la liste des choix dans le contenu du menu.

### `widgets/magic-table/widget.js` et `widgets/magic-table/reducer.js`

**`MagicTable`** est un tableau avancé en CSS Grid supportant : le tri par colonne (ascendant/descendant/neutre, avec tri personnalisable via `sortCustom` ou un menu de filtrage `autoFilter`), la sélection multiple de lignes (case à cocher par ligne + « tout/aucun/inverser »), le rendu personnalisé des cellules (`renderItem`/`renderRow`) et l'insertion de séparateurs entre les lignes sélectionnées hors page et les lignes visibles. Le tri est appliqué directement sur les nœuds DOM (réordonnancement des enfants) plutôt que sur les données, via `MagicTableContainer.sort`. L'état de tri/menu est géré par le **reducer** `widgets/magic-table/reducer.js` (actions `INITIALISE`, `TOGGLE_MENU`, `SORT_COLUMN`), stocké dans le state `widgets` du backend et lu via `Widget.connect`.

### `widgets/magic-overlay/widget.js`

Composant générique d'affichage superposé (« overlay ») supportant plusieurs modes : `popover` (natif, non fermable au clic extérieur), `popover-closable` (ferme au clic extérieur), `popover-dialog` (popover rendu comme `<dialog>`) et `modal-dialog` (boîte de dialogue modale classique). Expose un contexte (`MagicOverlay.Context`) et des sous-composants `Button`, `Content`, `CloseButton` pour composer librement le déclencheur et le contenu.

### `widgets/magic-dialog/widget.js`, `widgets/dialog/widget.js`, `widgets/cancelable-dialog/widget.js`, `widgets/menu-dialog/widget.js`

**`Dialog`** encapsule l'élément HTML natif `<dialog>` avec gestion de l'ouverture/fermeture programmatique (`show`/`showModal`/`close`) et rendu optionnel en portail. **`CancelableDialog`** ajoute une gestion personnalisée de l'événement d'annulation (touche Échap, clic extérieur) permettant de l'intercepter (`event.preventDefault()`), en contournant une limitation des navigateurs sur l'attribut `closedby`. **`MagicDialog`** combine `CancelableDialog` avec `Movable` (déplacement par glisser-déposer) et une fermeture au clic extérieur en mode non modal. **`MenuDialog`** est une variante de `Dialog` utilisée spécifiquement par le système `Menu`, avec sa propre gestion du clic extérieur.

### `widgets/magic-zen/widget.js`

Mode plein écran (« zen ») qui affiche son contenu dans un `Dialog` modal en plein écran avec un fond personnalisable (`MagicBackground` par défaut) et une notice temporaire rappelant le raccourci de sortie (Échap). Rendu neutre (retourne simplement `children`) lorsque `active` est faux.

### `widgets/menu/widget.js`

Système de menu contextuel complet : bouton déclencheur (`Menu.Button`), contenu positionné dynamiquement (`Menu.Content`, avec calcul de position selon l'espace disponible à l'écran — `getStyle`), éléments (`Menu.Item`), titres (`Menu.Title`), séparateurs (`Menu.Hr`), lignes (`Menu.Row`) et sous-menus (`Menu.Submenu`, affichés au survol). Prend en charge l'ouverture via clic droit (menu contextuel, `onContextMenu`) et la navigation clavier (flèches haut/bas entre les éléments).

### `widgets/checkbox-menu-items/widget.js`

Liste d'éléments de menu à cocher (utilisée typiquement pour des filtres à choix multiples), avec actions groupées « Tout », « Aucun » et « Inverser », et gestion du clic simple (sélectionne uniquement cette valeur) versus `Ctrl+clic` (bascule cette valeur dans la sélection).

### `widgets/magic-emoji/widget.js` et `widgets/magic-emoji-picker/widget.js`

**`MagicEmojiPickerNC`** encapsule le composant `emoji-mart` (`@emoji-mart/react`) avec thème adaptatif clair/sombre et localisation française. **`MagicEmoji`** l'expose dans un `Menu` déclenché par un bouton affichant l'emoji actuellement sélectionné.

### `widgets/popover/widget.js`

Wrapper autour de l'API native Popover (`popover`, `showPopover`/`hidePopover`), avec gestion de l'ancrage (`source`, ou déduit de `style.positionAnchor`) et fermeture par la touche Échap (via une pile de gestionnaires partagée `ListenerStack` pour n'activer que le popover le plus récent).

### `widgets/listener-stack/listener-stack.js`

Utilitaire générique gérant une pile de gestionnaires d'événements `window` par type d'événement : seul le gestionnaire le plus récemment empilé (`push`) est appelé, ce qui permet par exemple à plusieurs dialogues empilés de ne réagir à la touche Échap que pour le dernier ouvert. Utilisé par `Popover` et `CancelableDialog`.

### `widgets/element-helpers/`

Trois fonctions utilitaires bas niveau utilisées pour déterminer si un clic a eu lieu dans une zone « vide » (non interactive) d'une fenêtre, afin de piloter le déplacement (`Movable`) ou la fermeture au clic extérieur des dialogues/overlays :

- **`isFlatElement(element)`** — Vrai si la balise fait partie d'une liste de conteneurs non interactifs (`DIV`, `SECTION`, etc.) et ne porte pas de rôle ARIA interactif.
- **`elementHasDirectText(element)`** — Vrai si l'élément contient directement du texte (hors éléments enfants).
- **`isEmptyAreaElement(element, stopAtElement?)`** — Remonte l'arborescence depuis `element` jusqu'à `stopAtElement` en vérifiant que chaque ancêtre est « plat » et sans texte direct.

### `widgets/movable/widget.js`

Rend un conteneur déplaçable par glisser-déposer (pointeur), en ne déclenchant le déplacement que si le point de saisie est dans une zone vide (`isEmptyAreaElement`) et en contraignant la translation aux limites de la fenêtre.

### `widgets/resizer/widget.js`

Composant permettant de redimensionner son contenu par glisser-déposer d'une poignée (coin choisi via la prop `position`), avec tailles minimales configurables.

### `widgets/get-modifiers/get-modifiers.js`

Normalise les modificateurs clavier/souris entre plateformes : sur macOS, inverse `ctrlKey` et `metaKey` pour aligner le comportement sur les conventions du système (`Cmd` prend la place de `Ctrl`). Exporte aussi `getPlatform(userAgent)`.

### `widgets/time-interval/`

Ensemble d'utilitaires pour réagir à l'écoulement du temps « calendaire » plutôt qu'à un simple minuteur :

- **`get-date.js`** — Décompose une `Date` en champs textuels paddés (année, mois, jour, heures, minutes, secondes).
- **`time-interval.js`** — Fonction `timeInterval(fct, type, options?)` qui planifie l'appel de `fct` à chaque changement de jour/heure/minute/seconde (calcul dynamique du prochain instant, avec un `maxTick` pour rattraper rapidement une éventuelle mise en veille du système) ; retourne une fonction d'arrêt.
- **`current-day.js`** / **`current-minute.js`** — Composants React « render props » qui exposent respectivement le jour courant (`YYYY-MM-DD`) et la minute courante (`YYYY-MM-DDTHH:mm`), mis à jour automatiquement via `timeInterval`. Utilisés par `SmallCalendarGrid` et `YearMonthsGrid` pour mettre en évidence le jour/mois courant.

### `widgets/view-background/widget.js`

Fond stylisé (`MagicDiv`) pour le contenu d'une vue de navigation, qui adapte son style (`data-is-dialog`) selon que la vue affichée est un onglet ou un dialogue (déduit du préfixe `dialog` de l'identifiant de vue, obtenu via `ViewContext`).

### `widgets/main-tabs/widget.js` et `widgets/tab-layout/widget.js`

**`TabLayout`** structure verticalement une zone d'onglets et son contenu. **`TabLayout.Tabs`** gère le réordonnancement des onglets par glisser-déposer natif HTML5 (calcul de la position d'insertion selon la souris, y compris sur plusieurs lignes). **`MainTabs`** est une spécialisation stylée de `TabLayout.Tabs` utilisée par `MagicNavigation` pour la barre d'onglets principale.

### `widgets/splitter/widget.js`

Diviseur redimensionnable basé sur `react-splitter-layout`, avec style personnalisé (ligne pointillée au survol) et support de l'orientation verticale/horizontale et du redimensionnement en pourcentage.

### `widgets/magic-button/widget.js`, `widgets/magic-checkbox/widget.js`, `widgets/magic-radio/widget.js`, `widgets/magic-tag/widget.js`

Composants de base réutilisés dans tout le module : **`MagicButton`** (variantes `simple`, `big`, `enabled`, `underlined`, indicateur de chargement `spinner`), **`MagicCheckbox`**/**`MagicRadio`** (cases à cocher/boutons radio stylisés, avec variante `small` pour la checkbox) et **`MagicTag`** (étiquette cliquable ou non, avec état désactivé).

### `widgets/magic-box/widget.js`, `widgets/magic-box-old/widget.js`, `widgets/magic-div/widget.js`, `widgets/magic-background/widget.js`, `widgets/magic-panel/widget.js`, `widgets/input-group/widget.js`, `widgets/magic-scroll/widget.js`

Composants de mise en page : **`MagicDiv`** (bloc au style glassmorphism de base), **`MagicBox`** (`MagicDiv` + défilement intégré via `MagicScroll`), **`MagicBackground`** (fond plein écran avec dégradés animés adaptatifs), **`MagicPanel`** (panneau latéral rétractable avec raccourci), **`InputGroup`** (regroupement visuel de champs/boutons adjacents) et **`MagicBoxOld`** (variante historique conservée pour compatibilité, avec thèmes de couleur « mood »).

### `widgets/magic-action/widget.js`, `widgets/magic-wave/widget.js`, `widgets/magic-timer/widget.js`, `widgets/inline-icon/widget.js`, `widgets/magic-label/widget.js`, `widgets/max-text-width/widget.js`

**`MagicAction`** est un lien d'action textuel avec agrandissement au survol. **`MagicWave`** affiche une animation de barres (type égaliseur audio) à hauteur/vitesse aléatoires, utile comme indicateur d'activité (ex. enregistrement vocal). **`MagicTimer`** est un chronomètre avec bouton play/pause et affichage du temps écoulé mis à jour chaque seconde (`TimerUpdater`). **`InlineIcon`** aligne verticalement une icône MDI dans du texte. **`MagicLabel`** aligne un libellé et son champ associé. **`MaxTextWidth`** réserve la largeur du plus long texte possible parmi une liste, pour éviter les sauts de mise en page lors du changement de valeur affichée (ex. nom de mois).

### `widgets/with-computed-size/widget.js`

Composant « render props » qui mesure la taille réelle de son contenu après montage (`getBoundingClientRect`, avec `ResizeObserver` optionnel via `observeResize`) tout en le gardant invisible pendant la mesure ; utilisé notamment par `Menu.Content` pour calculer la position optimale d'un menu selon sa taille réelle.

### `test/navigation.spec.js`

Suite de tests unitaires (Mocha/Chai) exécutés via `Elf.trial` sur `MagicNavigationLogic`, validant en détail la méthode `moveTab` : réordonnancement au sein d'un même panneau et déplacement entre deux panneaux, avec vérification de l'ordre final des onglets dans chaque cas.

## Licence

Ce module est distribué sous [licence MIT](./LICENSE).

_Ce contenu a été généré par IA_

[xcraft-core-goblin]: https://github.com/Xcraft-Inc/xcraft-core-goblin
[xcraft-core-stones]: https://github.com/Xcraft-Inc/xcraft-core-stones
[xcraft-core-shredder]: https://github.com/Xcraft-Inc/xcraft-core-shredder
[xcraft-core-utils]: https://github.com/Xcraft-Inc/xcraft-core-utils
[xcraft-core-converters]: https://github.com/Xcraft-Inc/xcraft-core-converters

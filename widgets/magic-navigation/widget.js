import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';
import C from 'goblin-laboratory/widgets/connect-helpers/c.js';
import WithModel from 'goblin-laboratory/widgets/with-model/widget.js';
import ErrorHandler from 'goblin-laboratory/widgets/error-handler/widget.js';
import TabLayout from '../tab-layout/widget.js';
import MainTabs from '../main-tabs/widget.js';
import MagicDialog from '../magic-dialog/widget.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faColumns,
  faClone,
  faTimesCircle,
  faArrowLeft,
  faArrowRight,
  faPlus,
  faPaintBrush,
} from '@fortawesome/free-solid-svg-icons';
import Menu from '../menu/widget.js';
import getModifiers, {getPlatform} from '../get-modifiers/get-modifiers.js';
import ViewContext from './view-context.js';
import Icon from '@mdi/react';
import {mdiClose} from '@mdi/js';
import Splitter from '../splitter/widget.js';

let MagicNavigationView = class extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {view, viewId, widgets, visible} = this.props;
    if (!view) {
      return null;
    }
    const widget = view.get('widget') || view.get('serviceId').split('@', 1)[0];
    if (!(widget in widgets)) {
      throw new Error(`Unknown widget '${widget}'`);
    }
    const widgetProps = view.get('widgetProps')?.toObject();
    const serviceId = view.get('serviceId');
    const Component = widgets[widget];
    return (
      <div className={this.styles.classNames.view} data-visible={visible}>
        <WithModel model={serviceId ? `backend.${serviceId}` : ''}>
          <ViewContext.Provider value={view.set('id', viewId)}>
            <ErrorHandler big>
              <Component id={serviceId} viewId={viewId} {...widgetProps} />
            </ErrorHandler>
          </ViewContext.Provider>
        </WithModel>
      </div>
    );
  }
};
MagicNavigationView = withC(MagicNavigationView);

let MagicNavigationViews = class extends Widget {
  constructor() {
    super(...arguments);
  }

  render() {
    const tabIds = this.props.tabIds;
    const currentTabId = this.props.currentTabId;
    if (this.props.unmountHidden) {
      return (
        <MagicNavigationView
          id={this.props.id}
          viewId={currentTabId}
          view={C(`.tabs.${currentTabId}`)}
          widgets={this.props.widgets}
          visible={true}
        />
      );
    }
    return tabIds.map((tabId) => (
      <MagicNavigationView
        key={tabId}
        id={this.props.id}
        viewId={tabId}
        view={C(`.tabs.${tabId}`)}
        widgets={this.props.widgets}
        visible={tabId === currentTabId}
      />
    ));
  }
};
MagicNavigationViews = withC(MagicNavigationViews);

class MagicNavigationTabNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.close = this.close.bind(this);
    this.duplicateTab = this.duplicateTab.bind(this);
    this.highlightTab = this.highlightTab.bind(this);
    this.moveTabToNewWindow = this.moveTabToNewWindow.bind(this);
    this.moveTabToRightPanel = this.moveTabToRightPanel.bind(this);
    this.moveTabToLeftPanel = this.moveTabToLeftPanel.bind(this);
  }

  close(event) {
    this.doFor('magicNavigation@main', 'closeTab', {tabId: this.props.value});
    event.stopPropagation();
  }

  duplicateTab() {
    this.doFor('magicNavigation@main', 'duplicateTab', {
      tabId: this.props.value,
    });
  }

  highlightTab() {
    this.doFor('magicNavigation@main', 'highlightTab', {
      tabId: this.props.value,
    });
  }

  moveTabToNewWindow() {
    this.doFor('magicNavigation@main', 'moveTabToNewWindow', {
      tabId: this.props.value,
    });
  }

  moveTabToRightPanel() {
    this.doFor('magicNavigation@main', 'moveTabToPanel', {
      tabId: this.props.value,
      nextPanel: true,
    });
  }

  moveTabToLeftPanel() {
    this.doFor('magicNavigation@main', 'moveTabToPanel', {
      tabId: this.props.value,
      nextPanel: false,
    });
  }

  render() {
    const {tab, value, widgets, ...props} = this.props;
    if (!tab) {
      return null;
    }

    const widget = tab.get('widget') || tab.get('serviceId').split('@', 1)[0];
    const TabName = widgets[widget]?.TabName;
    const highlighted = tab.get('highlighted');
    return (
      <Menu>
        <div data-value={value} data-highlighted={highlighted} {...props}>
          <div className={this.styles.classNames.tabName}>
            <ErrorHandler>
              {TabName ? <TabName tab={tab} /> : widget}
            </ErrorHandler>
          </div>
          {/* <Menu.Button
            Component="a"
            className={this.styles.classNames.tabMenuButton}
          >
            <FontAwesomeIcon icon={faBars} />
          </Menu.Button> */}
          <a
            className={this.styles.classNames.closeButton}
            onClick={this.close}
          >
            <Icon path={mdiClose} />
          </a>

          <Menu.Content>
            <Menu.Submenu
              item={
                <>
                  <FontAwesomeIcon icon={faColumns} /> Déplacer l'onglet
                </>
              }
            >
              <Menu.Item onPointerUp={this.moveTabToLeftPanel}>
                <FontAwesomeIcon icon={faArrowLeft} /> Vers le panneau de gauche
              </Menu.Item>
              <Menu.Item onPointerUp={this.moveTabToRightPanel}>
                <FontAwesomeIcon icon={faArrowRight} /> Vers le panneau de
                droite
              </Menu.Item>
              <Menu.Item onPointerUp={this.moveTabToNewWindow}>
                <FontAwesomeIcon icon={faPlus} /> Vers une nouvelle fenêtre
              </Menu.Item>
              {/* <Menu.Item>Vers la fenêtre ...</Menu.Item> */}
            </Menu.Submenu>
            <Menu.Item onPointerUp={this.highlightTab}>
              <FontAwesomeIcon icon={faPaintBrush} /> Mettre en évidence
            </Menu.Item>
            <Menu.Item onPointerUp={this.duplicateTab}>
              <FontAwesomeIcon icon={faClone} /> Dupliquer l&apos;onglet
            </Menu.Item>
            <Menu.Item onPointerUp={this.close}>
              <FontAwesomeIcon icon={faTimesCircle} /> Fermer l&apos;onglet
            </Menu.Item>
          </Menu.Content>
        </div>
      </Menu>
    );
  }
}
const MagicNavigationTab = withC(MagicNavigationTabNC);

let MagicNavigationTabs = class extends Widget {
  constructor() {
    super(...arguments);
  }

  handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      this.doFor('magicNavigation@main', 'switchTab', {reverse: true});
    } else if (event.key === 'ArrowRight') {
      this.doFor('magicNavigation@main', 'switchTab');
    }
  };

  setTab = (tabId) => {
    this.doFor('magicNavigation@main', 'activateTab', {tabId});
  };

  moveTab = (srcTabId, dstTabId, side) => {
    this.doFor('magicNavigation@main', 'moveTab', {
      srcTabId,
      dstTabId,
      side,
    });
  };

  handleAuxClick = (event) => {
    if (event.button === 1) {
      // Middle click
      const tabId = event.currentTarget.dataset.value;
      this.doFor('magicNavigation@main', 'closeTab', {tabId});
    }
  };

  render() {
    const tabIds = this.props.tabIds;
    const currentTabId = this.props.currentTabId;
    return (
      <MainTabs
        currentTab={currentTabId}
        onTabClick={this.setTab}
        onTabDrop={this.moveTab}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
      >
        {tabIds.map((tabId) => (
          <MagicNavigationTab
            key={tabId}
            value={tabId}
            tab={C(`.tabs.${tabId}`)}
            onAuxClick={this.handleAuxClick}
            widgets={this.props.widgets}
          />
        ))}
      </MainTabs>
    );
  }
};
MagicNavigationTabs = withC(MagicNavigationTabs);

let MagicNavigationPanel = class extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  handleFocus = () => {
    const {id, windowId, panelId} = this.props;
    const activePanelId = this.getBackendState(id)
      .get('windows')
      .get(windowId)
      .get('activePanelId');
    if (activePanelId !== panelId) {
      this.doFor(id, 'activatePanel', {
        panelId,
      });
    }
  };

  render() {
    const {panel, topRight} = this.props;
    return (
      <TabLayout
        tabIndex="0"
        onFocusCapture={this.handleFocus}
        className={this.styles.classNames.panel}
      >
        <div className={this.styles.classNames.panelTop}>
          <MagicNavigationTabs
            id={this.props.id}
            currentTabId={panel.get('currentTabId')}
            tabIds={panel.get('tabIds')}
            widgets={this.props.widgets}
          />
          {topRight}
        </div>
        <MagicNavigationViews
          id={this.props.id}
          tabIds={panel.get('tabIds')}
          currentTabId={panel.get('currentTabId')}
          widgets={this.props.widgets}
          unmountHidden={false}
        />
      </TabLayout>
    );
  }
};
MagicNavigationPanel = withC(MagicNavigationPanel);

function MultiSplitter({children}) {
  const array = React.Children.toArray(children);
  if (array.length === 1) {
    return array[0];
  }
  const [first, ...other] = array;
  return (
    <Splitter
      primaryMinSize={15}
      secondaryMinSize={15}
      secondaryInitialSize={Math.floor(100 - 100 / array.length)}
      percentage={true}
    >
      {first}
      {MultiSplitter({children: other})}
    </Splitter>
  );
}

let MagicNavigationPanels = class extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {id, windowId, panelIds, widgets, topRight, rightPanel} = this.props;
    if (!panelIds) {
      return null; // Loading
    }
    const lastPanelIndex = panelIds.length - 1;
    return (
      <div className={this.styles.classNames.panels}>
        <MultiSplitter key={panelIds.length}>
          {panelIds.map((panelId, index) => (
            <MagicNavigationPanel
              key={panelId}
              id={id}
              windowId={windowId}
              panelId={panelId}
              panel={C(`.panels.${panelId}`)}
              widgets={widgets}
              topRight={index === lastPanelIndex ? topRight : null}
            />
          ))}
        </MultiSplitter>
        {rightPanel}
      </div>
    );
  }
};
MagicNavigationPanels = withC(MagicNavigationPanels);

let MagicNavigationDialog = class extends Widget {
  constructor() {
    super(...arguments);
  }

  handleClose = (event) => {
    const returnValue = event.currentTarget.returnValue;
    const dialogId = this.props.dialogId;
    this.doFor('magicNavigation@main', 'closeDialog', {
      dialogId,
      result: returnValue !== '' ? returnValue : undefined,
    });
  };

  handleCancel = (event) => {
    const dialogId = this.props.dialogId;
    this.doFor('magicNavigation@main', 'requestClose', {
      viewId: dialogId,
    });
    event.preventDefault();
  };

  render() {
    const dialogId = this.props.dialogId;
    const widgetProps = this.props.view.get('widgetProps')?.toObject();
    return (
      <MagicDialog
        modal={widgetProps?.modal}
        open
        onClose={this.handleClose}
        onCancel={this.handleCancel}
      >
        <MagicNavigationView
          id={this.props.id}
          viewId={dialogId}
          view={this.props.view}
          widgets={this.props.widgets}
        />
      </MagicDialog>
    );
  }
};
MagicNavigationDialog = withC(MagicNavigationDialog);

let MagicNavigationDialogs = class extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {dialogIds, widgets} = this.props;
    if (!dialogIds) {
      return null; // Loading
    }
    return dialogIds.map((dialogId) => (
      <MagicNavigationDialog
        key={dialogId}
        dialogId={dialogId}
        view={C(`.tabs.${dialogId}`)}
        widgets={widgets}
      />
    ));
  }
};
MagicNavigationDialogs = withC(MagicNavigationDialogs);

class MagicNavigation extends Widget {
  constructor() {
    super(...arguments);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const platform = getPlatform(navigator.userAgent);
    const modifiers = getModifiers(event);
    if (modifiers.ctrlKey) {
      if (event.key === 'w') {
        this.closeCurrentTab();
      } else if (event.key === 'o') {
        this.openById();
      }
    }
    if (modifiers.ctrlKey || modifiers.altKey) {
      if (
        [
          'Digit1',
          'Digit2',
          'Digit3',
          'Digit4',
          'Digit5',
          'Digit6',
          'Digit7',
          'Digit8',
          'Digit9',
        ].includes(event.code)
      ) {
        this.activateTabIndex(Number(event.key));
      }
    }
    if (event.ctrlKey) {
      // Platform independent
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          this.reverseSwitchTab();
        } else {
          this.switchTab();
        }
      }
    }
    if (
      (platform !== 'macos' && modifiers.altKey) ||
      (platform === 'macos' && modifiers.metaKey)
    ) {
      if (event.key === 'ArrowLeft') {
        this.backCurrentTab();
      }
    }
  }

  openById = () => {
    this.doFor('magicNavigation@main', 'openDialog', {
      view: {
        service: 'openWizard',
      },
      parentId: this.context.desktopId,
    });
  };

  closeCurrentTab() {
    this.doFor('magicNavigation@main', 'closeCurrentTab');
  }

  switchTab() {
    this.doFor('magicNavigation@main', 'switchTab');
  }

  reverseSwitchTab() {
    this.doFor('magicNavigation@main', 'switchTab', {reverse: true});
  }

  activateTabIndex(index) {
    this.doFor('magicNavigation@main', 'activateTabIndex', {index});
  }

  backCurrentTab() {
    this.doFor('magicNavigation@main', 'backCurrentTab');
  }

  render() {
    const {id, widgets, windowId, topRight, rightPanel} = this.props;
    const newWidgets = {
      ...Object.fromEntries(
        Object.entries(widgets).map(([name, widget]) => [
          name[0].toLowerCase() + name.slice(1),
          widget,
        ])
      ),
      ...widgets,
    };
    return (
      <WithModel model={`backend.${id}`}>
        <MagicNavigationPanels
          id={id}
          windowId={windowId}
          widgets={newWidgets}
          panelIds={C(`.windows.${windowId}.panelIds`)}
          topRight={topRight}
          rightPanel={rightPanel}
        />
        <MagicNavigationDialogs
          widgets={newWidgets}
          dialogIds={C(`.windows.${windowId}.dialogIds`)}
        />
      </WithModel>
    );
  }
}

export default MagicNavigation;

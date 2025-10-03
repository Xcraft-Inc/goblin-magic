// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {
  string,
  object,
  Sculpt,
  array,
  option,
  record,
  boolean,
} = require('xcraft-core-stones');
const isEqual = require('lodash/isEqual.js');

/**
 * @typedef {`desktop@${string}@${string}`} DesktopId
 */

const id = string;

/**
 * @typedef {string} id
 */

class PanelShape {
  tabIds = array(id);
  currentTabId = option(id);
  lastTabIds = array(id);
}

class WindowShape {
  panelIds = array(id);
  dialogIds = array(id);
  activePanelId = id;
}

class ViewStateShape {
  serviceId = option(id);
  widget = option(string); // 'serviceId' is required when 'widget' is not defined
  widgetProps = option(object);
  highlighted = boolean;
  parentViewId = option(id);
  tabId = option(id); //used when we restore a tab
}

class ViewState extends Sculpt(ViewStateShape) {}

/**
 * @typedef {new (...args: any) => Elf} ElfClass
 */

/**
 * @template {(...args: any) => any} T
 * @typedef {T extends (a: any, b: any, ...args: infer P) => any ? P : never} OtherParams
 */

/**
 * @template {ElfClass} T
 * @typedef {object} ElfView
 * @property {T} [View.service]
 * @property {`${T["name"]}@${string}`} [View.serviceId]
 * @property {OtherParams<InstanceType<T>["create"]> } [View.serviceArgs]
 * @property {string} [View.widget]
 * @property {object} [View.widgetProps]
 * @property {View} [View.previousView]
 * @property {string} [View.tabId]
 */

/**
 * @template {string} T
 * @typedef {object} GoblinView
 * @property {T} [View.service]
 * @property {`${T}@${string}` | T} [View.serviceId]
 * @property {object} [View.serviceArgs]
 * @property {string} [View.widget]
 * @property {object} [View.widgetProps]
 * @property {View} [View.previousView]
 * @property {string} [View.tabId]
 */

/**
 * @typedef {ElfClass | string} ViewParam
 */

/**
 * @template {ViewParam} [T=any]
 * @typedef {T extends string ? GoblinView<T> : T extends ElfClass ? ElfView<T> : never} View
 */

/**
 * @typedef {object} Modifiers
 * @property {boolean} shiftKey
 * @property {boolean} ctrlKey
 * @property {boolean} altKey
 * @property {boolean} metaKey
 */

class MagicNavigationShape {
  id = id;
  windows = record(id, WindowShape);
  panels = record(id, PanelShape);
  tabs = record(id, ViewStateShape);
}

/**
 * @param {ViewParam} service
 * @returns {string | null}
 */
function getServiceName(service) {
  if (!service) {
    return null;
  }
  if (typeof service === 'string') {
    return service;
  }
  return Elf.goblinName(service);
}

class MagicNavigationState extends Elf.Sculpt(MagicNavigationShape) {}

class MagicNavigationLogic extends Elf.Spirit {
  state = new MagicNavigationState({
    id: undefined,
    windows: {},
    panels: {},
    tabs: {},
  });

  create(id, existingWindowId) {
    let {state} = this;
    state.id = id;
    if (existingWindowId) {
      this.openEmptyWindow(existingWindowId);
    }
  }

  change(path, newValue) {
    const {state} = this;
    state._state.set(path, newValue);
  }

  /**
   * @param {id} windowId
   */
  handleWindowClosed(windowId) {
    const {state} = this;
    const window = state.windows[windowId];
    for (const panelId of window.panelIds) {
      const panel = state.panels[panelId];
      panel.currentTabId = null;
      for (const tabId of panel.tabIds) {
        delete state.tabs[tabId];
      }
      delete state.panels[panelId];
    }
    delete state.windows[windowId];
  }

  /**
   * @param {id} windowId
   * @param {id} panelId
   */
  activatePanel(windowId, panelId) {
    const {state} = this;
    state.windows[windowId].activePanelId = panelId;
  }

  /**
   * @param {id} windowId
   */
  openEmptyWindow(windowId) {
    const {state} = this;
    const panelId = `panel@${windowId}@0`;
    state.panels[panelId] = {
      currentTabId: null,
      tabIds: [],
      lastTabIds: [],
    };
    state.windows[windowId] = {
      panelIds: [panelId],
      dialogIds: [],
      activePanelId: panelId,
    };
  }

  /**
   * @param {typeof this["state"]} state
   * @param {id} windowId
   * @param {id} tabId
   * @param {ViewState} tab
   */
  _openTabInNewWindow(state, windowId, tabId, tab) {
    state.tabs[tabId] = tab;
    const panelId = `panel@${windowId}@0`;
    state.panels[panelId] = {
      currentTabId: tabId,
      tabIds: [tabId],
      lastTabIds: [],
    };
    state.windows[windowId] = {
      panelIds: [panelId],
      dialogIds: [],
      activePanelId: panelId,
    };
  }

  /**
   * @param {id} windowId
   * @param {id} tabId
   * @param {ViewState} tab
   */
  openTabInNewWindow(windowId, tabId, tab) {
    const {state} = this;
    this._openTabInNewWindow(state, windowId, tabId, tab);
  }

  /**
   * @param {id} panelId
   * @param {id} tabId
   * @param {ViewState} tab
   * @param {boolean} activateTab
   */
  openNewTab(panelId, tabId, tab, activateTab) {
    const {state} = this;
    state.tabs[tabId] = tab;
    state.panels[panelId].tabIds.push(tabId);
    const currentTabId = state.panels[panelId].currentTabId;
    if (activateTab) {
      if (currentTabId) {
        state.panels[panelId].lastTabIds.push(currentTabId);
      }
      state.panels[panelId].currentTabId = tabId;
    }
  }

  highlightTab(tabId) {
    const {state} = this;
    state.tabs[tabId].highlighted = true;
  }

  /**
   * @param {id} panelId
   * @param {id} tabId
   * @param {boolean} keepHistory
   */
  activateTab(panelId, tabId, keepHistory) {
    const {state} = this;
    const currentTabId = state.panels[panelId].currentTabId;
    if (keepHistory && currentTabId && currentTabId !== tabId) {
      state.panels[panelId].lastTabIds.deleteByValue(currentTabId);
      state.panels[panelId].lastTabIds.push(currentTabId);
    } else {
      state.panels[panelId].lastTabIds = [];
    }
    state.panels[panelId].currentTabId = tabId;
    const tab = state.tabs[tabId];
    if (tab.highlighted) {
      tab.highlighted = false;
    }
  }

  /**
   * @param {id} srcPanelId
   * @param {id} srcTabId
   * @param {id} dstPanelId
   * @param {id} dstTabId
   */
  moveTab(srcPanelId, srcTabId, dstPanelId, dstTabId) {
    const {state} = this;

    const srcIndex = state.panels[srcPanelId].tabIds.indexOf(srcTabId);
    const dstIndex = state.panels[dstPanelId].tabIds.indexOf(dstTabId);

    /* Case where the panels are the same */
    if (srcPanelId === dstPanelId) {
      state.panels[dstPanelId].tabIds[dstIndex] = srcTabId;
      state.panels[srcPanelId].tabIds[srcIndex] = dstTabId;
      return;
    }

    /* Case where the panels are differents
     *
     *   0   1   2                0   1   2
     *  ___ ___ ___              ___ ___ ___
     * | A | B | C |            | D | E | F |
     *  ``` ``` ```              ``` ``` ```
     *       |                        ^
     *       '--------- move ---------'
     *
     *   0   1                    0   1   2   3
     *  ___ ___                  ___ ___ ___ ___
     * | A | C |                | D | B | E | F |
     *  ``` ```                  ``` ``` ``` ```
     */
    state.panels[dstPanelId].tabIds.push('');
    for (
      let i = state.panels[dstPanelId].tabIds.length - 1;
      i > dstIndex;
      --i
    ) {
      state.panels[dstPanelId].tabIds[i] =
        state.panels[dstPanelId].tabIds[i - 1];
    }
    state.panels[dstPanelId].tabIds[dstIndex] = srcTabId;
    this._removeTabAndUpdatePanel(state, srcPanelId, srcTabId);
  }

  /**
   * @param {typeof this["state"]} state
   * @param {id} panelId
   * @param {id} tabId
   */
  _removeTabAndUpdatePanel(state, panelId, tabId) {
    const panel = state.panels[panelId];
    let panelRemoved = false;
    if (panel.currentTabId === tabId) {
      const newCurrentTabId = (() => {
        if (panel.lastTabIds.length > 0) {
          const lastTabIds = [...panel.lastTabIds];
          const lastTabId = lastTabIds.pop();
          panel.lastTabIds = lastTabIds;
          return lastTabId;
        } else {
          let index = panel.tabIds.indexOf(tabId) + 1;
          if (index >= panel.tabIds.length) {
            index = panel.tabIds.length - 2;
          }
          if (index >= 0) {
            return panel.tabIds[index];
          }
        }
        return null;
      })();

      panel.currentTabId = newCurrentTabId;

      if (!newCurrentTabId) {
        const window = Object.entries(
          state.windows
        ).find(([windowId, window]) => window.panelIds.includes(panelId))?.[1];
        if (!window) {
          throw new Error(`Unknown panel '${panelId}'`);
        }
        if (window.panelIds.length > 1) {
          if (window.activePanelId === panelId) {
            const panelIndex = window.panelIds.indexOf(panelId);
            if (panelIndex < 1) {
              window.activePanelId = window.panelIds[1];
            } else {
              window.activePanelId = window.panelIds[panelIndex - 1];
            }
          }
          window.panelIds.deleteByValue(panelId);
          delete state.panels[panelId];
          panelRemoved = true;
        }
      }
    }
    if (!panelRemoved) {
      panel.tabIds.deleteByValue(tabId);
      panel.lastTabIds.deleteByValue(tabId);
    }
  }

  /**
   * @param {id} panelId
   * @param {id} tabId
   */
  _removeTab(panelId, tabId) {
    const {state} = this;
    this._removeTabAndUpdatePanel(state, panelId, tabId);
    delete state.tabs[tabId];
  }

  /**
   * @param {id} panelId
   * @param {id} tabId
   * @param {id} windowId
   */
  moveTabToNewWindow(panelId, tabId, windowId) {
    const {state} = this;
    const tab = state.tabs[tabId];
    this._removeTabAndUpdatePanel(state, panelId, tabId);
    this._openTabInNewWindow(state, windowId, tabId, tab);
  }

  /**
   * @param {id} tabId
   * @param {id} panelId
   * @param {id} windowId
   * @param {boolean} nextPanel
   */
  moveTabToPanel(tabId, panelId, windowId, nextPanel) {
    const {state} = this;
    const window = state.windows[windowId];
    const panelIds = window.panelIds;
    let index = panelIds.indexOf(panelId);
    let newPanel = false;
    if (!nextPanel) {
      index--;
      if (index < 0) {
        newPanel = true;
      }
    } else {
      index++;
      if (index >= panelIds.length) {
        newPanel = true;
      }
    }
    let newPanelId;
    if (newPanel) {
      let i = 0;
      do {
        newPanelId = `panel@${windowId}@${i++}`;
      } while (panelIds.includes(newPanelId));
      if (nextPanel) {
        panelIds.push(newPanelId);
      } else {
        // panelIds.unshift(newPanelId);
        window.panelIds = [newPanelId, ...panelIds];
      }
      state.panels[newPanelId] = {
        currentTabId: tabId,
        tabIds: [tabId],
        lastTabIds: [],
      };
    } else {
      newPanelId = panelIds[index];
      state.panels[newPanelId].tabIds.push(tabId);
      state.panels[newPanelId].currentTabId = tabId;
      state.panels[newPanelId].lastTabIds = [];
    }
    this._removeTabAndUpdatePanel(state, panelId, tabId);
  }

  /**
   * @param {id} windowId
   * @param {id} dialogId
   * @param {ViewState} dialog
   */
  openDialog(windowId, dialogId, dialog) {
    const {state} = this;
    state.tabs[dialogId] = dialog;
    state.windows[windowId].dialogIds.push(dialogId);
  }

  /**
   * @param {id} windowId
   * @param {id} dialogId
   */
  _removeDialog(windowId, dialogId) {
    const {state} = this;
    const window = state.windows[windowId];
    window.dialogIds.deleteByValue(dialogId);
    delete state.tabs[dialogId];
  }

  /**
   * @param {id} viewId
   * @param {ViewState} view
   */
  replace(viewId, view) {
    const {state} = this;
    state.tabs[viewId] = view;
  }
}

class MagicNavigation extends Elf {
  logic = Elf.getLogic(MagicNavigationLogic);
  state = new MagicNavigationState();

  /** @type {string} */
  clientSessionId;

  /** @type {Map<id,View>} */
  views = new Map();

  /** @type {Map<DesktopId,Function>} */
  unsubs = new Map();

  /**
   * @param {string} id
   * @param {DesktopId} desktopId
   * @param {string} clientSessionId
   * @param {string} [existingWindowId]
   * @returns {Promise<this>}
   */
  async create(id, desktopId, clientSessionId, existingWindowId) {
    this.desktopId = desktopId;
    this.clientSessionId = clientSessionId;
    this.logic.create(id, existingWindowId);
    return this;
  }

  /**
   * @template {keyof this['state']} K
   * @param {K} path
   * @param {this['state'][K]} newValue
   */
  async change(path, newValue) {
    this.logic.change(path, newValue);
  }

  /**
   * @returns {Promise<DesktopId>}
   */
  async _newWindow() {
    const clientAPI = this.quest.getAPI('client');
    const session = this.quest.uuidV4();
    const username = this.quest.user.login;
    const userId = this.quest.user.id;
    const rootWidget = 'yeti-root';
    const configuration = {};
    const mainGoblin = 'yeti';
    const mandate = 'yeti';
    await clientAPI.openSession({
      session,
      username,
      userId,
      rootWidget,
      configuration,
      mainGoblin,
      mandate,
    });
    /** @type {DesktopId} */
    const desktopId = `desktop@${mandate}@${session}`;

    const labId = (await this.quest.getState('client')).get(
      `private.labByDesktop.${desktopId}`
    );
    const winId = `wm@${labId}`;
    const navigationId = this.id;
    const unsub = this.quest.sub.local(
      `*::${winId}.${this.clientSessionId}.<window-closed>`,
      function* (err, {msg, resp}) {
        console.log('Window closed:', desktopId);
        yield resp.cmd('magicNavigation.handleWindowClosed', {
          id: navigationId,
          windowId: desktopId,
        });
      }
    );
    this.unsubs.set(desktopId, unsub);
    return desktopId;
  }

  /**
   * @param {DesktopId} windowId
   */
  async handleWindowClosed(windowId) {
    const {state} = this;
    const window = state.windows[windowId];
    for (const panelId of window.panelIds) {
      const panel = state.panels[panelId];
      for (const tabId of panel.tabIds) {
        this.views.delete(tabId);
      }
    }
    for (const tabId of window.dialogIds) {
      this.views.delete(tabId);
    }
    const unsub = this.unsubs.get(windowId);
    if (!unsub) {
      throw new Error('Already unsubscribed');
    }
    unsub();
    this.unsubs.delete(windowId);
    this.logic.handleWindowClosed(windowId);
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @returns {Promise<string | undefined>}
   */
  async _createService(view, desktopId) {
    if (!view.service) {
      return;
    }

    let serviceId = view.serviceId;
    if (!serviceId) {
      if (typeof view.service === 'string') {
        serviceId = `${view.service}@${Elf.uuid()}`;
        await this.quest.create(serviceId, {
          ...view.serviceArgs,
          id: serviceId,
          desktopId,
        });
      } else {
        const ServiceClass = view.service;
        serviceId = `${Elf.goblinName(ServiceClass)}@${Elf.uuid()}`;
        const serviceArgs = view.serviceArgs || [];
        await new ServiceClass(this).create(
          serviceId,
          this.desktopId,
          ...serviceArgs
        );
      }
    }
    return serviceId;
  }

  /**
   * @param {id} viewId
   * @param {id | null | undefined} serviceId
   * @param {DesktopId} desktopId
   */
  async _removeView(viewId, serviceId, desktopId) {
    if (!this.views.has(viewId)) {
      throw new Error(`Bad viewId '${viewId}'`);
    }
    this.views.delete(viewId);
    if (serviceId) {
      await this.kill(serviceId, this.id, desktopId);
    }
  }

  /**
   * @param {id} parentId
   * @param {string} prompt
   * @param {object} [options]
   * @param {'default' | 'yes-no'} [options.kind]
   * @param {string} [options.advice]
   * @param {string} [options.okLabel]
   * @param {string} [options.noLabel]
   * @param {string} [options.cancelLabel]
   * @param {'cancel' | 'reject' | 'confirm'} [options.main]
   * @returns {Promise<true | false | undefined>}
   *
   * Possible return values:
   * Confirm / Yes -> true
   * No -> false
   * Cancel / ESC / Outside click / Parent closed -> undefined
   */
  async confirm(
    parentId,
    prompt,
    {kind, advice, okLabel, noLabel, cancelLabel, main} = {}
  ) {
    const dialogId = await this.openDialog(
      {
        widget: 'ConfirmDialog',
        widgetProps: {
          prompt,
          kind,
          advice,
          okLabel,
          noLabel,
          cancelLabel,
          main,
        },
      },
      parentId
    );
    return await this.waitClosed(dialogId);
  }

  /**
   * @param {id} parentId
   * @param {string} prompt
   * @param {object} [options]
   * @param {string} [options.advice]
   * @param {string} [options.okLabel]
   * @param {string} [options.cancelLabel]
   * @param {string} [options.initialValue]
   * @returns {Promise<string>}
   */
  async prompt(
    parentId,
    prompt,
    {advice, okLabel, cancelLabel, initialValue} = {}
  ) {
    const dialogId = await this.openDialog(
      {
        widget: 'PromptDialog',
        widgetProps: {
          prompt,
          advice,
          okLabel,
          cancelLabel,
          initialValue,
        },
      },
      parentId
    );
    return await this.waitClosed(dialogId);
  }

  /**
   * @param {id} parentId
   * @param {string} prompt
   * @param {string} [advice]
   * @returns {Promise<any>}
   */
  async alert(parentId, prompt, advice) {
    const dialogId = await this.openDialog(
      {
        widget: 'AlertDialog',
        widgetProps: {prompt, advice},
      },
      parentId
    );
    return await this.waitClosed(dialogId);
  }

  async activatePanel(panelId) {
    const windowId = await this.findPanelWindowId(panelId);
    if (!windowId) {
      throw new Error(`Unknown panel '${panelId}'`);
    }
    this.logic.activatePanel(windowId, panelId);
  }

  async openEmptyWindow() {
    const windowId = await this._newWindow();
    this.logic.openEmptyWindow(windowId);
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @returns {Promise<id>}
   */
  async openTabInNewWindow(view, desktopId) {
    const windowId = await this._newWindow();

    const tabId = `tab@${this.quest.uuidV4()}`;
    const serviceId = await this._createService(view, windowId);
    const tab = {
      serviceId,
      widget: view.widget,
      widgetProps: view.widgetProps,
      highlighted: false,
    };
    this.views.set(tabId, view);

    this.logic.openTabInNewWindow(windowId, tabId, tab);
    return tabId;
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @param {id} [panelId]
   * @param {boolean} [activateTab]
   * @returns {Promise<id>}
   */
  async openNewTab(view, desktopId, panelId, activateTab = true) {
    if (!panelId) {
      const windowId = desktopId;
      const window = this.state.windows[windowId];
      const panelIndex = window.panelIds.indexOf(window.activePanelId);
      const newPanelIndex = (() => {
        if (panelIndex < window.panelIds.length - 1) {
          return panelIndex + 1;
        }
        if (panelIndex > 0) {
          return panelIndex - 1;
        }
        return panelIndex;
      })();
      panelId = window.panelIds[newPanelIndex];
    }
    const tabId = view.tabId || `tab@${this.quest.uuidV4()}`;
    const serviceId =
      view.serviceId || (await this._createService(view, desktopId));
    const tab = {
      serviceId,
      widget: view.widget,
      widgetProps: view.widgetProps,
      highlighted: false,
    };
    if (!tab.widget && !tab.serviceId) {
      throw new Error(`Cannot open a tab without a widget or a service`);
    }

    this.views.set(tabId, view);
    this.logic.openNewTab(panelId, tabId, tab, activateTab);
    if (serviceId) {
      const evt = {tabId, serviceArgs: [], service: serviceId.split('@', 1)[0]};
      if (view.serviceArgs) {
        evt.serviceArgs = view.serviceArgs;
      }
      this.quest.evt(`${tabId}-opened`, evt);
    }

    return tabId;
  }

  async _hasEqualViewArgs(viewId, currentView, newView) {
    const serviceId = this.state.tabs[viewId].serviceId;
    if (newView.service && serviceId) {
      if (typeof newView.service === 'string') {
        const serviceAPI = this.quest.getAPI(serviceId);
        if (serviceAPI.hasSameViewArgs) {
          return await serviceAPI.hasSameViewArgs(newView.serviceArgs);
        }
      } else {
        const ServiceClass = newView.service;
        const serviceAPI = await new ServiceClass(this).api(serviceId);
        if (serviceAPI.hasSameViewArgs) {
          return await serviceAPI.hasSameViewArgs(...newView.serviceArgs);
        }
      }
    }

    return isEqual(currentView.serviceArgs, newView.serviceArgs);
  }

  async _hasSameWidget(view1, view2) {
    const widget1 =
      view1.widget ||
      getServiceName(view1.service) ||
      view1.serviceId.split('@', 1)[0];
    const widget2 =
      view2.widget ||
      getServiceName(view2.service) ||
      view2.serviceId.split('@', 1)[0];
    return (
      widget1[0].toLowerCase() + widget1.slice(1) ===
      widget2[0].toLowerCase() + widget2.slice(1)
    );
  }

  async findExistingView(view, desktopId, kind) {
    for (const [viewId, v] of this.views) {
      if (getServiceName(view.service) !== getServiceName(v.service)) {
        continue;
      }
      if (view.serviceId && view.serviceId !== v.serviceId) {
        continue;
      }
      if (!(await this._hasSameWidget(v, view))) {
        continue;
      }
      if (!(await this._hasEqualViewArgs(viewId, v, view))) {
        continue;
      }
      if (!isEqual(view.widgetProps, v.widgetProps)) {
        continue;
      }
      if (kind === 'dialog') {
        if (!this.state.windows[desktopId].dialogIds.includes(viewId)) {
          continue;
        }
      } else {
        const panelId = await this.findPanelId(viewId);
        if (!panelId) {
          continue;
        }
        const windowId = await this.findPanelWindowId(panelId);
        if (windowId !== desktopId) {
          continue;
        }
      }
      return viewId;
    }
  }

  /**
   * @template {ViewParam} T
   * @param {id} viewId
   * @param {View<T>} view
   */
  async changeView(viewId, view) {
    const currentView = this.views.get(viewId);
    if (!currentView) {
      throw new Error(`Missing view '${viewId}'`);
    }
    const serviceId = this.state.tabs[viewId].serviceId;
    if (!view.service || !serviceId) {
      return;
    }
    // this.views.set(viewId, {...currentView, ...view});
    if (typeof view.service === 'string') {
      const serviceAPI = this.quest.getAPI(serviceId);
      if (serviceAPI.onViewChange) {
        await serviceAPI.onViewChange(view.serviceArgs);
      }
    } else {
      const ServiceClass = view.service;
      const serviceAPI = await new ServiceClass(this).api(serviceId);
      if (
        'onViewChange' in serviceAPI &&
        typeof serviceAPI.onViewChange === 'function'
      ) {
        await serviceAPI.onViewChange(...view.serviceArgs);
      }
    }
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @returns {Promise<id>}
   */
  async activateOrOpenTab(view, desktopId) {
    const viewId = await this.findExistingView(view, desktopId, 'tab');
    if (!viewId) {
      return await this.openNewTab(view, desktopId);
    }
    await this.changeView(viewId, view);
    await this.activateTab(viewId, true);
    return viewId;
  }

  /**
   * @param {id} tabId
   */
  async highlightTab(tabId) {
    this.logic.highlightTab(tabId);
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @param {id} [panelId]
   * @returns {Promise<id>}
   */
  async highlightOrOpenTab(view, desktopId, panelId) {
    let viewId = await this.findExistingView(view, desktopId, 'tab');
    if (!viewId) {
      viewId = await this.openNewTab(view, desktopId, panelId, false);
    }
    const tabPanelId = await this.findPanelId(viewId);
    if (!tabPanelId) {
      throw new Error(`Bad viewId '${viewId}'`);
    }
    const panel = this.state.panels[tabPanelId];
    if (panel.currentTabId === viewId) {
      return viewId;
    }
    await this.changeView(viewId, view);
    if (panel.tabIds.length > 1) {
      await this.highlightTab(viewId);
    } else {
      await this.activateTab(viewId);
    }
    return viewId;
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @param {Modifiers} [modifiers]
   * @returns {Promise<id>}
   */
  async openTab(view, desktopId, modifiers) {
    if (modifiers) {
      if (modifiers.ctrlKey) {
        return await this.highlightOrOpenTab(view, desktopId);
      }
      if (modifiers.altKey || modifiers.metaKey) {
        return await this.openTabInNewWindow(view, desktopId);
      }
    }
    return await this.activateOrOpenTab(view, desktopId);
  }

  /**
   * @param {id} serviceId
   * @returns {Promise<id | undefined >}
   */
  async findViewId(serviceId) {
    return Object.entries(this.state.tabs).find(
      ([viewId, view]) => view.serviceId === serviceId
    )?.[0];
  }

  /**
   * @param {id} viewOrServiceId
   * @returns {Promise<id>}
   */
  async getViewId(viewOrServiceId) {
    if (this.state._state.get('tabs').has(viewOrServiceId)) {
      return viewOrServiceId;
    }

    const id = await this.findViewId(viewOrServiceId);
    if (!id) {
      throw new Error(
        `Unable to find a navigation view for serviceId '${viewOrServiceId}'`
      );
    }
    return id;
  }

  /**
   * @param {id} tabId
   * @returns {Promise<id | undefined >}
   */
  async findPanelId(tabId) {
    return Object.entries(this.state.panels).find(([panelId, panel]) =>
      panel.tabIds.includes(tabId)
    )?.[0];
  }

  /**
   * @param {id} panelId
   * @returns {Promise<DesktopId | undefined >}
   */
  async findPanelWindowId(panelId) {
    return Object.entries(this.state.windows).find(([windowId, window]) =>
      window.panelIds.includes(panelId)
    )?.[0];
  }

  /**
   * @param {id} viewId
   * @returns {Promise<DesktopId | undefined >}
   */
  async findViewWindowId(viewId) {
    return Object.entries(this.state.windows).find(
      ([windowId, window]) =>
        window.dialogIds.includes(viewId) ||
        [...window.panelIds].some((panelId) =>
          this.state.panels[panelId].tabIds.includes(viewId)
        )
    )?.[0];
  }

  /**
   * @param {id} tabId
   * @param {boolean} keepHistory
   */
  async activateTab(tabId, keepHistory = false) {
    const panelId = await this.findPanelId(tabId);
    if (!panelId) {
      throw new Error(`Unknown tab '${tabId}'`);
    }
    this.logic.activateTab(panelId, tabId, keepHistory);
  }

  /**
   * @param {id} srcTabId
   * @param {id} dstTabId
   */
  async moveTab(srcTabId, dstTabId) {
    if (srcTabId === dstTabId) {
      return;
    }
    const srcPanelId = await this.findPanelId(srcTabId);
    if (!srcPanelId) {
      throw new Error(`Unknown tab '${srcTabId}'`);
    }
    const dstPanelId = await this.findPanelId(dstTabId);
    if (!dstPanelId) {
      throw new Error(`Unknown tab '${dstTabId}'`);
    }
    this.logic.moveTab(srcPanelId, srcTabId, dstPanelId, dstTabId);
  }

  /**
   * @param {DesktopId} desktopId
   * @returns {Promise<id | null | undefined>}
   */
  async getCurrentTab(desktopId) {
    const windowId = desktopId;
    const window = this.state.windows[windowId];
    const panel = this.state.panels[window.activePanelId];
    return panel.currentTabId;
  }

  /**
   * @param {DesktopId} desktopId
   */
  async closeCurrentTab(desktopId) {
    const tabId = await this.getCurrentTab(desktopId);
    if (tabId) {
      await this.closeView(desktopId, tabId);
    }
  }

  /**
   * @param {id} panelId
   * @param {id} tabId
   */
  async _removeTab(panelId, tabId) {
    this.logic._removeTab(panelId, tabId);
  }

  /**
   * @param {id} tabId
   * @param {any} [result]
   */
  async closeTab(tabId, result) {
    const panelId = await this.findPanelId(tabId);
    if (!panelId) {
      throw new Error(`Unknown tab '${tabId}'`);
    }
    const desktopId = await this.findPanelWindowId(panelId);
    if (!desktopId) {
      throw new Error(`Unknown panel '${panelId}'`);
    }
    const serviceId = this.state.tabs[tabId].serviceId;
    await this._removeTab(panelId, tabId);
    await this._removeView(tabId, serviceId, desktopId);
    this.quest.evt(`${tabId}-closed`, result);
  }

  /**
   * @param {id} tabId
   */
  async duplicateTab(tabId) {
    const panelId = await this.findPanelId(tabId);
    if (!panelId) {
      throw new Error(`Unknown tab '${tabId}'`);
    }
    const windowId = await this.findPanelWindowId(panelId);
    if (!windowId) {
      throw new Error(`Unknown panel '${panelId}'`);
    }
    const view = this.views.get(tabId);
    if (!view) {
      throw new Error(`Missing view for tab '${tabId}'`);
    }
    await this.openNewTab(view, windowId, panelId);
  }

  /**
   * @param {id} tabId
   */
  async moveTabToNewWindow(tabId) {
    const panelId = await this.findPanelId(tabId);
    if (!panelId) {
      throw new Error(`Unknown tab '${tabId}'`);
    }
    const oldWindowId = await this.findPanelWindowId(panelId);
    if (!oldWindowId) {
      throw new Error(`Unknown panel '${panelId}'`);
    }
    const windowId = await this._newWindow();
    const serviceId = this.state.tabs[tabId].serviceId;
    if (serviceId) {
      // Attach the service to the new window
      await this.quest.create(serviceId, {
        id: serviceId,
        desktopId: windowId,
      });
      await this.kill(serviceId, this.id, oldWindowId);
    }
    this.logic.moveTabToNewWindow(panelId, tabId, windowId);
  }

  /**
   * @param {id} tabId
   * @param {boolean} [nextPanel]
   */
  async moveTabToPanel(tabId, nextPanel = true) {
    const panelId = await this.findPanelId(tabId);
    if (!panelId) {
      throw new Error(`Unknown tab '${tabId}'`);
    }
    const windowId = await this.findPanelWindowId(panelId);
    if (!windowId) {
      throw new Error(`Unknown panel '${panelId}'`);
    }
    this.logic.moveTabToPanel(tabId, panelId, windowId, nextPanel);
  }

  /**
   * @param {DesktopId} desktopId
   * @param {boolean} [reverse]
   */
  async switchTab(desktopId, reverse) {
    const windowId = desktopId;
    const window = this.state.windows[windowId];
    const panel = this.state.panels[window.activePanelId];
    const currentTabId = panel.currentTabId;
    if (!currentTabId) {
      return;
    }
    let index = panel.tabIds.indexOf(currentTabId);
    if (reverse) {
      index--;
      if (index < 0) {
        index = panel.tabIds.length - 1;
      }
    } else {
      index++;
      if (index >= panel.tabIds.length) {
        index = 0;
      }
    }
    const newTabId = panel.tabIds[index];
    await this.activateTab(newTabId);
  }

  /**
   * @param {DesktopId} desktopId
   * @param {number} index 1-9
   */
  async activateTabIndex(desktopId, index) {
    const windowId = desktopId;
    const window = this.state.windows[windowId];
    const panel = this.state.panels[window.activePanelId];
    const length = panel.tabIds.length;
    let arrayIndex = index - 1;
    if (index === 9) {
      arrayIndex = length - 1;
    }
    if (arrayIndex >= length || arrayIndex < 0) {
      return;
    }
    const tabId = panel.tabIds[arrayIndex];
    await this.activateTab(tabId);
  }

  /**
   * @param {id | DesktopId} parentId
   * @returns {Promise<{windowId: DesktopId, parentViewId: id | null}>}
   */
  async parseParentId(parentId) {
    if (Object.keys(this.state.windows).includes(parentId)) {
      return {
        windowId: parentId,
        parentViewId: null,
      };
    } else {
      const parentViewId = await this.getViewId(parentId);
      const windowId = await this.findViewWindowId(parentViewId);
      if (!windowId) {
        throw new Error(`Unknown view '${parentViewId}'`);
      }
      return {
        windowId,
        parentViewId,
      };
    }
  }

  /**
   * @template {ViewParam} T
   * @param {View<T>} view
   * @param {id | DesktopId} parentId
   * @param {boolean} [modal]
   * @param {boolean} [openNew]
   * @returns {Promise<id>}
   */
  async openDialog(view, parentId, modal = true, openNew = false) {
    const {windowId, parentViewId} = await this.parseParentId(parentId);

    /** @type {View<T>} */
    const newView = {
      ...view,
      widgetProps: {...view.widgetProps, modal},
    };

    if (!openNew) {
      const viewId = await this.findExistingView(newView, windowId, 'dialog');
      if (viewId) {
        return viewId;
      }
    }

    const dialogId = `dialog@${this.quest.uuidV4()}`;

    const serviceId =
      newView.serviceId || (await this._createService(newView, windowId));
    const dialog = {
      serviceId,
      widget: newView.widget,
      widgetProps: newView.widgetProps,
      highlighted: false,
      parentViewId,
    };
    this.views.set(dialogId, newView);

    this.logic.openDialog(windowId, dialogId, dialog);
    return dialogId;
  }

  /**
   * @param {id} windowId
   * @param {id} dialogId
   */
  _removeDialog(windowId, dialogId) {
    this.logic._removeDialog(windowId, dialogId);
  }

  /**
   * @param {DesktopId} desktopId
   * @param {id} dialogId
   * @param {any} [result]
   */
  async closeDialog(desktopId, dialogId, result) {
    const windowId = desktopId;
    const serviceId = this.state.tabs[dialogId]?.serviceId;
    await this._removeDialog(windowId, dialogId);
    await this._removeView(dialogId, serviceId, desktopId);
    this.quest.evt(`${dialogId}-closed`, result);
  }

  /**
   * @param {id} viewOrServiceId id of dialog, tab or service
   * @returns {Promise<any>}
   */
  async waitClosed(viewOrServiceId) {
    const viewId = await this.getViewId(viewOrServiceId);
    const result = await this.quest.sub.wait(
      `*::magicNavigation@main.${viewId}-closed`
    );
    return result;
  }

  /**
   * @template {ViewParam} T
   * @param {id} viewOrServiceId
   * @param {View<T>} view
   * @param {DesktopId} desktopId
   * @param {boolean} [back=false]
   */
  async replace(viewOrServiceId, view, desktopId, back = false) {
    const viewId = await this.getViewId(viewOrServiceId);
    const currentView = this.views.get(viewId);
    if (!currentView) {
      throw new Error(`Missing view '${viewId}'`);
    }
    const serviceId =
      view.serviceId || (await this._createService(view, desktopId));

    const viewState = {
      serviceId,
      widget: view.widget,
      widgetProps: view.widgetProps,
      highlighted: false,
    };
    const newView = back ? view : {...view, previousView: currentView};
    this.views.set(viewId, newView);
    this.logic.replace(viewId, viewState);
  }

  /**
   * @param {DesktopId} desktopId
   * @param {id} viewId
   * @param {any} [result]
   */
  async closeView(desktopId, viewId, result) {
    for (const [id, view] of Object.entries(this.state.tabs)) {
      if (view.parentViewId === viewId) {
        await this.closeView(desktopId, id);
      }
    }
    if (viewId.startsWith('dialog@')) {
      await this.closeDialog(desktopId, viewId, result);
    } else {
      await this.closeTab(viewId, result);
    }
  }

  /**
   * @param {id} viewOrServiceId
   * @param {DesktopId} desktopId
   */
  async back(viewOrServiceId, desktopId) {
    const viewId = await this.getViewId(viewOrServiceId);
    const currentView = this.views.get(viewId);
    if (!currentView) {
      throw new Error(`Missing view '${viewId}'`);
    }
    const previousView = currentView.previousView;
    if (previousView) {
      await this.replace(viewId, previousView, desktopId, true);
    } else {
      await this.closeView(desktopId, viewId);
    }
  }

  /**
   * @param {DesktopId} desktopId
   */
  async backCurrentTab(desktopId) {
    const tabId = await this.getCurrentTab(desktopId);
    if (tabId) {
      await this.back(tabId, desktopId);
    }
  }

  delete() {
    for (const unsub of this.unsubs.values()) {
      unsub();
    }
    this.unsubs.clear();
  }
}

module.exports = {MagicNavigation, MagicNavigationLogic};

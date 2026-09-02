// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, record, any, array} = require('xcraft-core-stones');
const {MagicNavigation} = require('../magic-navigation/service.js');
const {id} = require('xcraft-core-goblin/lib/types.js');

class WidgetWithNavShape {
  id = id('widgetWithNav');
  magicNavigationId = id('magicNavigation');
  dialogs = record(string, array(string));
}

class WidgetWithNavState extends Elf.Sculpt(WidgetWithNavShape) {}

class WidgetWithNavLogic extends Elf.Spirit {
  state = new WidgetWithNavState({
    id: undefined,
    magicNavigationId: undefined,
    dialogs: {},
  });

  create(id, magicNavigationId) {
    const {state} = this;
    state.id = id;
    state.magicNavigationId = magicNavigationId;
  }

  openDialog(desktopId, dialogId) {
    const {state} = this;
    if (!state.dialogs[desktopId]) {
      state.dialogs[desktopId] = [];
    }
    state.dialogs[desktopId].push(dialogId);
  }

  handleDialogClosed(desktopId, dialogId) {
    const {state} = this;
    state.dialogs[desktopId].deleteByValue(dialogId);
    if (state.dialogs[desktopId].length === 0) {
      delete state.dialogs[desktopId];
    }
  }
}

class WidgetWithNav extends Elf {
  logic = Elf.getLogic(WidgetWithNavLogic);
  state = new WidgetWithNavState();

  async create(id, desktopId, magicNavigationId) {
    this.logic.create(id, magicNavigationId);
  }

  async closeDialogs(desktopId, dialogIds) {
    const mainNavigation = await new MagicNavigation(this).api(
      this.state.magicNavigationId
    );
    for (const dialogId of dialogIds) {
      await mainNavigation.closeDialog(desktopId, dialogId);
    }
  }

  async resetDesktop(desktopId) {
    const dialogIds = this.state.dialogs[desktopId];
    if (dialogIds) {
      await this.closeDialogs(desktopId, dialogIds);
    }
  }

  async openDialog(desktopId, args) {
    const mainNavigation = await new MagicNavigation(this).api(
      this.state.magicNavigationId
    );
    const dialogId = await mainNavigation.openDialog(...args);
    this.logic.openDialog(desktopId, dialogId);
    return dialogId;
  }

  async handleDialogClosed(desktopId, dialogId) {
    this.logic.handleDialogClosed(desktopId, dialogId);
  }

  async waitClosed(desktopId, dialogId) {
    const mainNavigation = await new MagicNavigation(this).api(
      this.state.magicNavigationId
    );
    const result = await mainNavigation.waitClosed(dialogId);
    await this.handleDialogClosed(desktopId, dialogId);
    return result;
  }
}

module.exports = {WidgetWithNav, WidgetWithNavLogic};

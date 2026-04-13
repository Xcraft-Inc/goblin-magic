// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, option, array} = require('xcraft-core-stones');
const {
  MagicNavigation,
} = require('goblin-magic/widgets/magic-navigation/service.js');

/** @import {Modifiers} from '../get-modifiers/get-modifiers.js' */

class DetailNavigationShape {
  id = string;
  parentWorkitemId = string;
  detailId = option(string);
  detailServiceId = option(string);
  detailHistory = array(string);
}

class DetailNavigationState extends Elf.Sculpt(DetailNavigationShape) {}

class DetailNavigationLogic extends Elf.Spirit {
  state = new DetailNavigationState({
    id: undefined,
    parentWorkitemId: undefined,
    detailId: null,
    detailServiceId: null,
    detailHistory: [],
  });

  /**
   * @param {`detailNavigation@${string}`} id
   * @param {string} parentWorkitemId
   */
  create(id, parentWorkitemId) {
    let {state} = this;
    state.id = id;
    state.parentWorkitemId = parentWorkitemId;
  }

  /**
   * @param {string} detailId
   * @param {string} detailServiceId
   * @param {boolean} useHistory
   */
  changeDetail(detailId, detailServiceId, useHistory) {
    const {state} = this;
    const oldDetailId = state.detailId;
    if (useHistory && oldDetailId) {
      state.detailHistory.push(oldDetailId);
    }
    state.detailId = detailId;
    state.detailServiceId = detailServiceId;
  }

  backDetail() {
    const {state} = this;
    const newHistory = [...state.detailHistory];
    newHistory.pop();
    state.detailHistory = newHistory;
  }

  closeDetail() {
    const {state} = this;
    state.detailId = null;
    state.detailServiceId = null;
  }
}

class DetailNavigation extends Elf {
  logic = Elf.getLogic(DetailNavigationLogic);
  state = new DetailNavigationState();

  /** @type {Record<string,typeof Elf>} */
  services;

  /**
   * @param {`detailNavigation@${string}`} id
   * @param {string} desktopId
   * @param {string} parentWorkitemId
   * @param {Record<string,typeof Elf>} services
   * @param {string} [detailId]
   */
  async create(id, desktopId, parentWorkitemId, services, detailId) {
    this.logic.create(id, parentWorkitemId);
    this.services = services;
    if (detailId) {
      await this.changeDetail(detailId);
    }
  }

  /**
   * @param {string} entityId
   * @param {Modifiers} [modifiers]
   */
  async openNewTab(entityId, modifiers) {
    const mainNavigation = await new MagicNavigation(this).api(
      'magicNavigation@main'
    );
    const type = entityId.split('@', 1)[0];
    const Service = this.services[type];
    if (!Service) {
      throw new Error(
        `Unable to open ${entityId}. Type ${type} is not in the services definition.`
      );
    }
    await mainNavigation.openTab(
      {
        service: Service,
        serviceArgs: [entityId, null],
      },
      await this.winDesktopId(),
      modifiers
    );
  }

  async replaceParent() {
    const mainNavigation = await new MagicNavigation(this).api(
      'magicNavigation@main'
    );
    const {detailId} = this.state;
    if (!detailId) {
      return;
    }
    const type = detailId.split('@', 1)[0];
    const Service = this.services[type];
    if (!Service) {
      throw new Error(
        `Unable to open ${detailId}. Type ${type} is not in the services definition.`
      );
    }
    await mainNavigation.replace(
      this.state.parentWorkitemId,
      {
        service: Service,
        serviceArgs: [detailId, null],
      },
      await this.winDesktopId()
    );
  }

  /**
   * @param {string} detailId
   * @param {boolean} [useHistory]
   */
  async changeDetail(detailId, useHistory = true) {
    if (!detailId) {
      return;
    }

    const type = detailId.split('@', 1)[0];
    const Service = this.services[type];
    if (!Service) {
      throw new Error(
        `Unable to change detail to ${detailId}. Type ${type} is not in the services definition.`
      );
    }
    const serviceId = Elf.newId(Elf.goblinName(Service));
    await new Service(this).create(
      serviceId,
      await this.winDesktopId(),
      detailId,
      this.state.parentWorkitemId
    );

    const oldServiceId = this.state.detailServiceId;

    this.logic.changeDetail(detailId, serviceId, useHistory);

    if (oldServiceId) {
      await this.kill(oldServiceId, this.id, await this.winDesktopId());
    }
  }

  /**
   * @param {string} entityId
   * @param {Modifiers} [modifiers]
   */
  async open(entityId, modifiers = {}) {
    if (modifiers.ctrlKey) {
      await this.openNewTab(entityId, modifiers);
      return;
    }

    if (this.state.detailId === entityId) {
      await this.closeDetail();
      return;
    }

    await this.changeDetail(entityId);
  }

  async backDetail() {
    const {detailHistory} = this.state;
    if (detailHistory.length === 0) {
      this.logic.closeDetail();
      return;
    }
    const entityId = detailHistory[detailHistory.length - 1];
    this.logic.backDetail();
    await this.changeDetail(entityId, false);
  }

  async closeDetail() {
    const oldServiceId = this.state.detailServiceId;
    this.logic.closeDetail();
    if (oldServiceId) {
      await this.kill(oldServiceId, this.id, await this.winDesktopId());
    }
  }

  /**
   * @param {Modifiers} [modifiers]
   */
  async openDetailInNewTab(modifiers = {}) {
    const {detailId} = this.state;
    if (!detailId) {
      return;
    }
    await this.openNewTab(detailId, modifiers);
  }

  delete() {}
}

module.exports = {DetailNavigation, DetailNavigationLogic};

'use strict';

const {expect} = require('chai');
const {Elf} = require('xcraft-core-goblin/lib/test.js');

function restore(navLogic) {
  navLogic.change('windows', {
    'win@1': {
      panelIds: ['panel@1', 'panel@2'],
      dialogIds: ['dialog@1'],
      activePanelId: 'panel@1',
    },
  });
  navLogic.change('panels', {
    'panel@1': {
      tabIds: ['tab@1', 'tab@2', 'tab@3'],
      lastTabIds: [],
    },
    'panel@2': {
      tabIds: ['tab@4', 'tab@5', 'tab@6'],
      lastTabIds: [],
    },
  });
  navLogic.change('tabs', {
    'tab@1': {highlighted: false},
    'tab@2': {highlighted: false},
    'tab@3': {highlighted: false},
    'tab@4': {highlighted: false},
    'tab@5': {highlighted: false},
    'tab@6': {highlighted: false},
  });
}

describe('goblin.magic.navigation', function () {
  const {
    MagicNavigationLogic,
  } = require('../widgets/magic-navigation/service.js');

  it('moveTab', function () {
    const navLogic = Elf.trial(MagicNavigationLogic);
    navLogic.create('magicNavigation@test');

    // --- one panel -----------------------------------------------------------

    /* 1,2,3 → 2,3,1 */
    restore(navLogic);
    navLogic.moveTab('tab@1', 'panel@1', 'panel@1', 2);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@2', 'tab@3', 'tab@1']);

    /* 1,2,3 → 2,1,3 */
    restore(navLogic);
    navLogic.moveTab('tab@1', 'panel@1', 'panel@1', 1);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@2', 'tab@1', 'tab@3']);

    /* 1,2,3 → 1,2,3 */
    restore(navLogic);
    navLogic.moveTab('tab@1', 'panel@1', 'panel@1', 0);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@1', 'tab@2', 'tab@3']);

    /* 1,2,3 → 3,1,2 */
    restore(navLogic);
    navLogic.moveTab('tab@3', 'panel@1', 'panel@1', 0);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@3', 'tab@1', 'tab@2']);

    /* 1,2,3 → 1,3,2 */
    restore(navLogic);
    navLogic.moveTab('tab@3', 'panel@1', 'panel@1', 1);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@1', 'tab@3', 'tab@2']);

    // --- two panels ----------------------------------------------------------

    /* 2,3 → 4,5,6,1 */
    restore(navLogic);
    navLogic.moveTab('tab@1', 'panel@1', 'panel@2', 3);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@2', 'tab@3']);
    expect(navLogic.state.panels['panel@2'].tabIds.toJS()) //
      .to.be.eql(['tab@4', 'tab@5', 'tab@6', 'tab@1']);

    /* 1,3 → 2,4,5,6 */
    restore(navLogic);
    navLogic.moveTab('tab@2', 'panel@1', 'panel@2', 0);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@1', 'tab@3']);
    expect(navLogic.state.panels['panel@2'].tabIds.toJS()) //
      .to.be.eql(['tab@2', 'tab@4', 'tab@5', 'tab@6']);

    /* 1,2 → 4,5,3,6 */
    restore(navLogic);
    navLogic.moveTab('tab@3', 'panel@1', 'panel@2', 2);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql(['tab@1', 'tab@2']);
    expect(navLogic.state.panels['panel@2'].tabIds.toJS()) //
      .to.be.eql(['tab@4', 'tab@5', 'tab@3', 'tab@6']);

    /* . → 2,4,1,5,6,3 */
    restore(navLogic);
    navLogic.moveTab('tab@2', 'panel@1', 'panel@2', 0);
    navLogic.moveTab('tab@1', 'panel@1', 'panel@2', 2);
    navLogic.moveTab('tab@3', 'panel@1', 'panel@2', 5);
    expect(navLogic.state.panels['panel@1'].tabIds.toJS()) //
      .to.be.eql([]);
    expect(navLogic.state.panels['panel@2'].tabIds.toJS()) //
      .to.be.eql(['tab@2', 'tab@4', 'tab@1', 'tab@5', 'tab@6', 'tab@3']);
  });
});

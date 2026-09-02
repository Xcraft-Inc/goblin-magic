// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, record, any} = require('xcraft-core-stones');

class WidgetWithQuestShape {
  id = string;
  results = record(string, {value: any});
}

class WidgetWithQuestState extends Elf.Sculpt(WidgetWithQuestShape) {}

class WidgetWithQuestLogic extends Elf.Spirit {
  state = new WidgetWithQuestState({
    id: 'widgetWithQuest',
    results: {},
  });

  doQuest(questId, result) {
    const {state} = this;
    state.results[questId] = {value: result};
  }

  clearResult(questId) {
    const {state} = this;
    delete state.results[questId];
  }
}

class WidgetWithQuest extends Elf.Alone {
  logic = Elf.getLogic(WidgetWithQuestLogic);
  state = new WidgetWithQuestState();

  /**
   * @param {string} questId
   * @param {string} serviceId
   * @param {string} questName
   * @param {{}} questArgs
   */
  async doQuest(questId, serviceId, questName, questArgs) {
    const service = this.quest.getAPI(serviceId);
    const result = await service[questName](questArgs);
    this.logic.doQuest(questId, result);
  }

  /**
   * @param {string} questId
   */
  async clearResult(questId) {
    this.logic.clearResult(questId);
  }
}

module.exports = {WidgetWithQuest, WidgetWithQuestLogic};

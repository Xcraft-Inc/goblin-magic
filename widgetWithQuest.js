const {Elf} = require('xcraft-core-goblin');
const {
  WidgetWithQuest,
  WidgetWithQuestLogic,
} = require('./widgets/widget-with-quest/service.js');

exports.xcraftCommands = Elf.birth(WidgetWithQuest, WidgetWithQuestLogic);

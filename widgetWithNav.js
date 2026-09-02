const {Elf} = require('xcraft-core-goblin');
const {
  WidgetWithNav,
  WidgetWithNavLogic,
} = require('./widgets/widget-with-nav/service.js');

exports.xcraftCommands = Elf.birth(WidgetWithNav, WidgetWithNavLogic);

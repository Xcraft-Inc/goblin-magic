const {Elf} = require('xcraft-core-goblin');
const {
  MagicNavigation,
  MagicNavigationLogic,
} = require('./widgets/magic-navigation/service.js');

exports.xcraftCommands = Elf.birth(MagicNavigation, MagicNavigationLogic);

const {Elf} = require('xcraft-core-goblin');
const {
  DetailNavigation,
  DetailNavigationLogic,
} = require('./widgets/detail-navigation/service.js');

exports.xcraftCommands = Elf.birth(DetailNavigation, DetailNavigationLogic);

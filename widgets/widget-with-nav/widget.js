import WidgetWithQuest from '../widget-with-quest/widget.js';

let first = true;

class WidgetWithNav extends WidgetWithQuest {
  constructor() {
    super(...arguments);
    this.serviceId = 'widgetWithNav@magicNavigation@main';
    this.dialogIds = [];
    if (first) {
      first = false;
      this.doFor(this.serviceId, 'resetDesktop', {
        desktopId: this.context.desktopId,
      });
    }
  }

  componentWillUnmount() {
    if (this.dialogIds.length > 0) {
      this.doFor(this.serviceId, 'closeDialogs', {
        desktopId: this.context.desktopId,
        dialogIds: this.dialogIds,
      });
    }
  }

  openDialogForResult = async (view, parentId) => {
    const dialogId = await this.doQuest(this.serviceId, 'openDialog', {
      desktopId: this.context.desktopId,
      args: [view, parentId],
    });
    this.dialogIds.push(dialogId);
    const result = await this.doQuest(this.serviceId, 'waitClosed', {
      desktopId: this.context.desktopId,
      dialogId,
    });
    this.dialogIds = this.dialogIds.filter((id) => id !== dialogId);
    return result;
  };
}

export default WidgetWithNav;

import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Menu from '../menu/widget.js';
import CalendarMenuContent from '../calendar-menu-content/widget.js';
import {date as DateConverters} from 'xcraft-core-converters';

class CalendarMenu extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  handleCalendarChange = (date, menu) => {
    menu.close();
    this.props.onChange(date);
  };

  render() {
    const {allowEmpty, value, onChange, children} = this.props;
    return (
      <Menu>
        {children}
        <Menu.Content position="bottom center" addTabIndex={false}>
          <Menu.Context.Consumer>
            {(menu) => (
              <CalendarMenuContent
                allowEmpty={allowEmpty}
                value={value || DateConverters.getNowCanonical()}
                onChange={(date) => this.handleCalendarChange(date, menu)}
                onCancel={menu.close}
              />
            )}
          </Menu.Context.Consumer>
        </Menu.Content>
      </Menu>
    );
  }
}

export default CalendarMenu;

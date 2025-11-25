import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Menu from '../menu/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiBackspaceOutline, mdiCancel, mdiCheck} from '@mdi/js';
import DialogButtons from '../dialog-buttons/widget.js';
import {yearMonth as YearMonthConverters} from 'xcraft-core-converters';
import YearMonth from '../year-month/widget.js';

class YearMonthMenuContent extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      yearMonth: this.props.value,
    };
    this.calendarRef = React.createRef();
  }

  /** @type {React.KeyboardEventHandler} */
  handleKeyDown = (event) => {
    this.calendarRef.current?.handleKeyDown(event);
  };

  handleMonthChange = (yearMonth) => {
    this.setState({yearMonth});
  };

  handleMonthClick = (value) => {
    this.props.onChange(value);
  };

  clear = () => {
    this.props.onChange(null);
  };

  cancel = () => {
    this.props.onCancel();
  };

  validate = () => {
    this.props.onChange(this.state.yearMonth);
  };

  render() {
    return (
      <div
        className={this.styles.classNames.yearMonthMenuContent}
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
      >
        <YearMonth
          ref={this.calendarRef}
          value={this.state.yearMonth}
          onMonthChange={this.handleMonthChange}
          onMonthClick={this.handleMonthClick}
        />

        <DialogButtons className={this.styles.classNames.buttons}>
          {this.props.allowEmpty && (
            <MagicButton
              onClick={this.clear}
              className={this.styles.classNames.clearButton}
            >
              <Icon path={mdiBackspaceOutline} size={0.8} /> Effacer
            </MagicButton>
          )}
          <DialogButtons.Spacing />
          <MagicButton onClick={this.cancel}>
            <Icon path={mdiCancel} size={0.8} /> Annuler
          </MagicButton>
          <MagicButton onClick={this.validate} className="main">
            <Icon path={mdiCheck} size={0.8} />{' '}
            {YearMonthConverters.toLocaleString(this.state.yearMonth, 'fr-CH')}
          </MagicButton>
        </DialogButtons>
      </div>
    );
  }
}

class YearMonthMenu extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  handleChange = (value, menu) => {
    menu.close();
    this.props.onChange(value);
  };

  render() {
    const {allowEmpty, value, onChange, children} = this.props;
    return (
      <Menu>
        {children}
        <Menu.Content position="bottom center" addTabIndex={false}>
          <Menu.Context.Consumer>
            {(menu) => (
              <YearMonthMenuContent
                allowEmpty={allowEmpty}
                value={value || YearMonthConverters.getNowCanonical()}
                onChange={(value) => this.handleChange(value, menu)}
                onCancel={menu.close}
              />
            )}
          </Menu.Context.Consumer>
        </Menu.Content>
      </Menu>
    );
  }
}

export default YearMonthMenu;

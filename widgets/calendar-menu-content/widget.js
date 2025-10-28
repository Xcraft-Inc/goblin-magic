import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import SmallCalendar from '../small-calendar/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiBackspaceOutline, mdiCancel, mdiCheck} from '@mdi/js';
import {date as DateConverters} from 'xcraft-core-converters';
import DialogButtons from '../dialog-buttons/widget.js';

class CalendarMenuContent extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      date: this.props.value,
    };
    this.calendarRef = React.createRef();
  }

  /** @type {React.KeyboardEventHandler} */
  handleKeyDown = (event) => {
    this.calendarRef.current?.handleKeyDown(event);
  };

  handleDateChange = (date) => {
    this.setState({date});
  };

  handleDayClick = (date) => {
    this.props.onChange(date);
  };

  clear = () => {
    this.props.onChange(null);
  };

  cancel = () => {
    this.props.onCancel();
  };

  validate = () => {
    this.props.onChange(this.state.date);
  };

  render() {
    return (
      <div
        className={this.styles.classNames.calendarMenuContent}
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
      >
        <SmallCalendar
          ref={this.calendarRef}
          date={this.state.date}
          onDateChange={this.handleDateChange}
          onDayClick={this.handleDayClick}
        />

        <DialogButtons className={this.styles.classNames.buttons}>
          {this.props.allowEmpty && (
            <MagicButton
              onClick={this.clear}
              title="Effacer la date"
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
            {DateConverters.getDisplayed(this.state.date)}
          </MagicButton>
        </DialogButtons>
      </div>
    );
  }
}

export default CalendarMenuContent;

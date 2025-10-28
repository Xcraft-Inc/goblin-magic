import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import MagicButton from '../magic-button/widget.js';
import {mdiCalendarToday, mdiChevronLeft, mdiChevronRight} from '@mdi/js';
import Icon from '@mdi/react';
import SmallCalendarGrid from '../small-calendar-grid/widget.js';
import CalendarHelpers from '../calendar-helpers.js';
import MaxTextWidth from '../max-text-width/widget.js';
import {date as DateConverters} from 'xcraft-core-converters';
import Menu from '../menu/widget.js';

class SmallCalendar extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  setToday = (event) => {
    const newDate = DateConverters.getNowCanonical();
    this.props.onDateChange(newDate);
  };

  previousDay = (event) => {
    const newDate = DateConverters.addDays(this.props.date, -1);
    this.props.onDateChange(newDate);
  };

  nextDay = (event) => {
    const newDate = DateConverters.addDays(this.props.date, 1);
    this.props.onDateChange(newDate);
  };

  previousMonth = (event) => {
    const newDate = DateConverters.addMonths(this.props.date, -1);
    this.props.onDateChange(newDate);
  };

  setMonth = (index) => {
    const date = new Date(this.props.date);
    date.setUTCMonth(index);
    const newDate = date.toISOString().split('T', 1)[0];
    this.props.onDateChange(newDate);
  };

  nextMonth = (event) => {
    const newDate = DateConverters.addMonths(this.props.date, 1);
    this.props.onDateChange(newDate);
  };

  previousYear = (event) => {
    const newDate = DateConverters.addYears(this.props.date, -1);
    this.props.onDateChange(newDate);
  };

  nextYear = (event) => {
    const newDate = DateConverters.addYears(this.props.date, 1);
    this.props.onDateChange(newDate);
  };

  previousWeek = (event) => {
    const newDate = DateConverters.addDays(this.props.date, -7);
    this.props.onDateChange(newDate);
  };

  nextWeek = (event) => {
    const newDate = DateConverters.addDays(this.props.date, 7);
    this.props.onDateChange(newDate);
  };

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);
    if (event.key === 'Enter') {
      if (event.target === event.currentTarget) {
        this.props.onDayClick(this.props.date, event);
        event.stopPropagation();
      }
    } else if (event.key === 'ArrowUp') {
      this.previousWeek(event);
      event.stopPropagation();
    } else if (event.key === 'ArrowDown') {
      this.nextWeek(event);
      event.stopPropagation();
    } else if (event.key === 'ArrowLeft') {
      this.previousDay(event);
      event.stopPropagation();
    } else if (event.key === 'ArrowRight') {
      this.nextDay(event);
      event.stopPropagation();
    }
  };

  render() {
    const {date, onDayClick, bottomActions, ...props} = this.props;
    const [year, month, day] = date.split('-');
    const monthNames = CalendarHelpers.getMonthNames('fr-CH', 'long', {
      upperCase: true,
    });
    const monthName = monthNames[Number(month) - 1];
    return (
      <div
        className={this.styles.classNames.smallCalendar}
        onKeyDown={this.handleKeyDown}
      >
        <div className={this.styles.classNames.top}>
          <div className={this.styles.classNames.group}>
            <MagicButton
              simple
              onClick={this.previousDay}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronLeft} size={1.1} />
            </MagicButton>
            <MagicButton
              simple
              onClick={this.editDay}
              className={this.styles.classNames.datePart}
            >
              {day}
            </MagicButton>
            <MagicButton
              simple
              onClick={this.nextDay}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronRight} size={1.1} />
            </MagicButton>
          </div>
          <div className={this.styles.classNames.group}>
            <MagicButton
              simple
              onClick={this.previousMonth}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronLeft} size={1.1} />
            </MagicButton>
            <Menu>
              <Menu.Button simple className={this.styles.classNames.datePart}>
                <MaxTextWidth texts={monthNames}>{monthName}</MaxTextWidth>
              </Menu.Button>
              <Menu.Content>
                <div className={this.styles.classNames.monthMenu}>
                  {monthNames.map((monthName, index) => (
                    <Menu.Item
                      key={index}
                      onPointerUp={() => this.setMonth(index)}
                    >
                      {monthName}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Content>
            </Menu>
            <MagicButton
              simple
              onClick={this.nextMonth}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronRight} size={1.1} />
            </MagicButton>
          </div>
          <div className={this.styles.classNames.group}>
            <MagicButton
              simple
              onClick={this.previousYear}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronLeft} size={1.1} />
            </MagicButton>
            <MagicButton
              simple
              onClick={this.editYear}
              className={this.styles.classNames.datePart}
            >
              {year}
            </MagicButton>
            <MagicButton
              simple
              onClick={this.nextYear}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronRight} size={1.1} />
            </MagicButton>
          </div>
        </div>
        <SmallCalendarGrid
          {...props}
          startDate={date}
          onDayClick={onDayClick}
          topLeft={
            <MagicButton
              simple
              onClick={this.setToday}
              title="Aujourd'hui"
              className={this.styles.classNames.today}
            >
              <Icon path={mdiCalendarToday} size={0.8} />
            </MagicButton>
          }
        />
        {/* <div className={this.styles.classNames.bottom}>
          <div className={this.styles.classNames.group}>
            <MagicButton
              simple
              onClick={this.previousWeek}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronLeft} size={1.1} />
            </MagicButton>
            <MagicButton
              simple
              onClick={this.editWeek}
              className={this.styles.classNames.weekButton}
            >
              Semaine {weekNumber}
            </MagicButton>
            <MagicButton
              simple
              onClick={this.nextWeek}
              className={this.styles.classNames.arrow}
            >
              <Icon path={mdiChevronRight} size={1.1} />
            </MagicButton>
          </div>
        </div> */}
      </div>
    );
  }
}

export default SmallCalendar;

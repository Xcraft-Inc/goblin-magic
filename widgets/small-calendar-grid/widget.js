import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import CurrentDay from '../time-interval/current-day.js';
import {toJsDate} from 'xcraft-core-converters/lib/calendar.js';
import CalendarHelpers from '../calendar-helpers.js';

const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

class SmallCalendarGrid extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  /** @type {React.PointerEventHandler} */
  handleDayClick = (event) => {
    const date = event.currentTarget.getAttribute('data-date');
    this.props.onDayClick?.(date, event);
  };

  renderDayHeader(day) {
    const {dayWidth = 'small', weekendWidth = dayWidth} = this.props;
    const width = day === 'sat' || day === 'sun' ? weekendWidth : dayWidth;
    const widthIndex = ['tiny', 'small', 'large'].indexOf(width);
    return (
      <div key={day} className={this.styles.classNames.dayHeader}>
        {
          {
            mon: ['Lu', 'Lun', 'Lundi'],
            tue: ['Ma', 'Mar', 'Mardi'],
            wed: ['Me', 'Mer', 'Mercredi'],
            thu: ['Je', 'Jeu', 'Jeudi'],
            fri: ['Ve', 'Ven', 'Vendredi'],
            sat: ['Sa', 'Sam', 'Samedi'],
            sun: ['Di', 'Dim', 'Dimanche'],
          }[day][widthIndex]
        }
      </div>
    );
  }

  renderDay(day, currentDay) {
    const {startDate, onDayClick} = this.props;

    const date = toJsDate(day);
    const dayNum = date.getDay();

    const isOutOfRange = date.getMonth() !== toJsDate(startDate).getMonth();

    return (
      <div
        key={day}
        className={this.styles.classNames.day}
        data-selected={day === startDate}
        data-today={day === currentDay}
        data-weekend={dayNum === 0 || dayNum === 6}
        data-out-of-range={isOutOfRange}
        data-enable-selection={Boolean(onDayClick)}
        onClick={this.handleDayClick}
        data-date={day}
      >
        <span className={this.styles.classNames.dayNumber}>
          {date.getDate()}
        </span>
      </div>
    );
  }

  renderWeeks(currentDay) {
    const {startDate} = this.props;
    const weekStarts = CalendarHelpers.generateWeekStarts(
      CalendarHelpers.getMonthStart(startDate),
      6
    );
    return weekStarts.map((weekStart) => {
      const days = CalendarHelpers.generateDays(weekStart);
      return (
        <div key={weekStart} className={this.styles.classNames.weekRow}>
          <div className={this.styles.classNames.weekNumber}>
            {CalendarHelpers.getWeekNumber(toJsDate(weekStart))}
          </div>
          {days.map((day) => this.renderDay(day, currentDay))}
        </div>
      );
    });
  }

  render() {
    return (
      <div role="grid" className={this.styles.classNames.smallCalendarGrid}>
        <div className={this.styles.classNames.headerRow}>
          <div className={this.styles.classNames.dayHeader}>
            {this.props.topLeft}
          </div>
          {weekdays.map((day) => this.renderDayHeader(day))}
        </div>
        <div className={this.styles.classNames.daysGrid}>
          <CurrentDay>
            {(currentDay) => this.renderWeeks(currentDay)}
          </CurrentDay>
        </div>
      </div>
    );
  }
}

export default SmallCalendarGrid;

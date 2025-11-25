import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import CurrentDay from '../time-interval/current-day.js';
import CalendarHelpers from '../calendar-helpers.js';
import {yearMonth as YearMonthConverters} from 'xcraft-core-converters';

class YearMonthsGrid extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  /** @type {React.PointerEventHandler} */
  handleMonthClick = (event) => {
    const yearMonth = event.currentTarget.getAttribute('data-month');
    this.props.onMonthClick?.(yearMonth, event);
  };

  renderMonth(name, index, currentMonth) {
    const {year, value, onMonthClick} = this.props;
    const yearMonth = YearMonthConverters.from(year, index + 1);
    return (
      <div
        key={index}
        className={this.styles.classNames.month}
        data-selected={yearMonth === value}
        data-today={yearMonth === currentMonth}
        data-enable-selection={Boolean(onMonthClick)}
        onClick={this.handleMonthClick}
        data-month={yearMonth}
      >
        {name}
      </div>
    );
  }

  renderMonths(currentDay) {
    const monthNames = CalendarHelpers.getMonthNames('fr-CH', 'long', {
      upperCase: true,
    });
    const currentMonth = currentDay.split('-', 2).join('-');
    return monthNames.map((name, index) =>
      this.renderMonth(name, index, currentMonth)
    );
  }

  render() {
    const {year} = this.props;
    return (
      <div role="grid" className={this.styles.classNames.yearMonthGrid}>
        <div className={this.styles.classNames.yearHeader}>{year}</div>
        <div className={this.styles.classNames.monthsGrid}>
          <CurrentDay>
            {(currentDay) => this.renderMonths(currentDay)}
          </CurrentDay>
        </div>
      </div>
    );
  }
}

export default YearMonthsGrid;

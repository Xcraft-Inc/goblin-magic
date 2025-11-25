import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import MagicButton from '../magic-button/widget.js';
import {mdiCalendarToday, mdiChevronLeft, mdiChevronRight} from '@mdi/js';
import Icon from '@mdi/react';
import CalendarHelpers from '../calendar-helpers.js';
import MaxTextWidth from '../max-text-width/widget.js';
import YearMonthsGrid from '../year-month-grid/widget.js';
import {yearMonth as YearMonthConverters} from 'xcraft-core-converters';

class YearMonth extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  setToday = (event) => {
    const yearMonth = YearMonthConverters.getNowCanonical();
    this.props.onMonthChange(yearMonth);
  };

  validateToday = (event) => {
    const yearMonth = YearMonthConverters.getNowCanonical();
    this.props.onMonthClick(yearMonth, event);
  };

  addMonth = (event, count) => {
    let newDate = YearMonthConverters.addMonths(this.props.value, count);
    this.props.onMonthChange(newDate);
  };

  previousMonth = (event) => {
    this.addMonth(event, -1);
  };

  nextMonth = (event) => {
    this.addMonth(event, 1);
  };

  previousYear = (event) => {
    let newDate = YearMonthConverters.addYears(this.props.value, -1);
    this.props.onMonthChange(newDate);
  };

  nextYear = (event) => {
    let newDate = YearMonthConverters.addYears(this.props.value, 1);
    this.props.onMonthChange(newDate);
  };

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);
    if (event.key === 'Enter') {
      if (event.target === event.currentTarget) {
        this.props.onMonthClick(this.props.value, event);
        event.stopPropagation();
      }
    } else if (event.key === 'ArrowUp') {
      this.addMonth(event, -3);
      event.stopPropagation();
    } else if (event.key === 'ArrowDown') {
      this.addMonth(event, 3);
      event.stopPropagation();
    } else if (event.key === 'ArrowLeft') {
      this.addMonth(event, -1);
      event.stopPropagation();
    } else if (event.key === 'ArrowRight') {
      this.addMonth(event, 1);
      event.stopPropagation();
    }
  };

  render() {
    const {value, onMonthClick} = this.props;
    const [year, month] = YearMonthConverters.parse(value);
    const monthNames = CalendarHelpers.getMonthNames('fr-CH', 'long', {
      upperCase: true,
    });
    const monthName = monthNames[month - 1];
    return (
      <div
        className={this.styles.classNames.yearMonth}
        onKeyDown={this.handleKeyDown}
      >
        <div className={this.styles.classNames.top}>
          <div className={this.styles.classNames.topLeft}>
            <MagicButton
              simple
              onClick={this.setToday}
              onDoubleClick={this.validateToday}
              title="Aujourd'hui"
              className={this.styles.classNames.today}
            >
              <Icon path={mdiCalendarToday} size={0.8} />
            </MagicButton>
            <div className={this.styles.classNames.group}>
              <MagicButton
                simple
                onClick={this.previousMonth}
                className={this.styles.classNames.arrow}
              >
                <Icon path={mdiChevronLeft} size={1.1} />
              </MagicButton>
              <MagicButton
                simple
                disabled
                className={this.styles.classNames.datePart}
              >
                <MaxTextWidth texts={monthNames}>{monthName}</MaxTextWidth>
              </MagicButton>
              <MagicButton
                simple
                onClick={this.nextMonth}
                className={this.styles.classNames.arrow}
              >
                <Icon path={mdiChevronRight} size={1.1} />
              </MagicButton>
            </div>
          </div>
          <div className={this.styles.classNames.topRight}>
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
                disabled
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
        </div>
        <div className={this.styles.classNames.years}>
          <YearMonthsGrid
            year={year}
            value={value}
            onMonthClick={onMonthClick}
          />
          <YearMonthsGrid
            year={year + 1}
            value={value}
            onMonthClick={onMonthClick}
          />
        </div>
      </div>
    );
  }
}

export default YearMonth;

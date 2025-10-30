import {plainDateISO, toJsDate} from 'xcraft-core-converters/lib/calendar.js';

/**
 * @typedef {string} plainDate
 * @typedef {string} zonedDateTime
 */

/**
 * @param {plainDate} plainDate
 * @param {number} [monthDiff]
 * @returns {plainDate}
 */
export function getMonthStart(plainDate, monthDiff) {
  const newDate = new Date(plainDate);
  newDate.setUTCDate(1);
  if (monthDiff) {
    newDate.setUTCMonth(newDate.getUTCMonth() + monthDiff);
  }
  return newDate.toISOString().split('T', 1)[0];
}

/**
 * @param {plainDate} plainDate
 * @param {number} [monthDiff]
 * @returns {plainDate}
 */
export function getMonthEnd(plainDate, monthDiff = 0) {
  const newDate = new Date(plainDate);
  newDate.setUTCDate(1);
  newDate.setUTCMonth(newDate.getUTCMonth() + 1 + monthDiff);
  newDate.setUTCDate(0);
  return newDate.toISOString().split('T', 1)[0];
}

/**
 * @param {plainDate} plainDate
 * @param {number} [days]
 * @returns {plainDate}
 */
export function addDays(plainDate, days) {
  const newDate = new Date(plainDate);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate.toISOString().split('T', 1)[0];
}

/**
 * @param {Date} date
 * @returns {number}
 */
export function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * @param {Date} date
 * @returns {plainDate}
 */
export function getWeekStart(date = new Date()) {
  const diff = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - diff);
  return plainDateISO(date);
}

/**
 * @param {plainDate} plainDate
 * @param {plainDate} otherPlainDate
 * @returns {plainDate}
 */
export function setSameDay(plainDate, otherPlainDate) {
  const [year, month, day] = plainDate.split('-');
  const [_, __, beforeDay] = otherPlainDate.split('-');
  if (day !== beforeDay) {
    const newDate = new Date(`${year}-${month}-${beforeDay}`);
    const monthNum = Number(month) - 1;
    while (newDate.getMonth() > monthNum) {
      newDate.setDate(newDate.getDate() - 1);
    }
    return newDate.toISOString().split('T', 1)[0];
  }
  return plainDate;
}

/**
 * @param {plainDate} plainDate
 * @param {number} monthIndex 0-11
 * @returns {plainDate}
 */
export function setMonth(plainDate, monthIndex) {
  const date = new Date(plainDate);
  date.setUTCMonth(monthIndex);
  while (date.getUTCMonth() > monthIndex) {
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return date.toISOString().split('T', 1)[0];
}

/**
 * @typedef {NonNullable<Intl.DateTimeFormatOptions["month"]>} MonthFormat
 */

/**
 * @param {Intl.LocalesArgument} locale
 * @param {MonthFormat} format
 * @param {{upperCase?: boolean}} [options]
 * @returns {string[]}
 */
export function getMonthNames(locale, format, options = {}) {
  const formater = new Intl.DateTimeFormat(locale, {month: format});
  const monthNames = Array.from({length: 12}, (_, i) =>
    formater.format(new Date(`2000-${(i + 1).toString().padStart(2, '0')}-01`))
  );
  if (options.upperCase) {
    return monthNames.map((month) => month[0].toUpperCase() + month.slice(1));
  }
  return monthNames;
}

/**
 * @param {plainDate} startDate
 * @param {number} numWeeks
 * @returns {plainDate[]}
 */
export function generateWeekStarts(startDate, numWeeks) {
  let weekStart = toJsDate(getWeekStart(toJsDate(startDate)));
  const weekStarts = [];
  for (let i = 0; i < numWeeks; i++) {
    weekStarts.push(plainDateISO(weekStart));
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return weekStarts;
}

/**
 * @param {plainDate} firstDate
 * @param {number} [numDays]
 * @returns {plainDate[]}
 */
export function generateDays(firstDate, numDays = 7) {
  let date = toJsDate(firstDate);
  const days = [];
  for (let i = 0; i < numDays; i++) {
    days.push(plainDateISO(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function eventIsInDay({start, end}, day) {
  const [startDay, startTime] = start.split('T');
  if (!end) {
    return startDay === day;
  }
  const [endDay, endTime] = end.split('T');
  return (
    (day >= startDay && day < endDay) ||
    (endDay === day && !endTime?.startsWith('00:00:00'))
  );
}

/**
 * @param {{start: zonedDateTime, end?: zonedDateTime}} event
 * @param {plainDate} firstDay
 * @param {plainDate} lastDay
 * @returns {boolean}
 */
export function eventIsInDays(event, firstDay, lastDay) {
  const {start, end} = event;
  const [startDay, startTime] = start.split('T');
  if (!end) {
    return startDay >= firstDay && startDay <= lastDay;
  }
  const [endDay, endTime] = end.split('T');
  return !(
    startDay > lastDay ||
    endDay < firstDay ||
    (endDay === firstDay && endTime?.startsWith('00:00:00'))
  );
}

const CalendarHelpers = {
  getMonthStart,
  getMonthEnd,
  addDays,
  getWeekNumber,
  getWeekStart,
  setSameDay,
  setMonth,
  getMonthNames,
  generateWeekStarts,
  generateDays,
  eventIsInDay,
  eventIsInDays,
};

export default CalendarHelpers;

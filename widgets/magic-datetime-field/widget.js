import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicDateField from '../magic-date-field/widget.js';
import MagicTimeField from '../magic-time-field/widget.js';
import {
  nowZonedDateTimeISO,
  parseZonedDateTime,
  zonedDateTimeFromParts,
} from 'xcraft-core-converters/lib/calendar.js';

class MagicDatetimeFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  changeDate = (date) => {
    const {value} = this.props;
    let newDate;
    if (date && value && value.includes('T')) {
      const afterDate = value.slice(value.indexOf('T') + 1);
      newDate = `${date}T${afterDate}`;
    } else {
      newDate = date;
    }
    this.props.onChange?.(newDate);
  };

  changeTime = (time) => {
    const {value, initialDate} = this.props;
    let newDate;
    if (value) {
      const current = parseZonedDateTime(value);
      if (time) {
        const timezone = current.time
          ? current.timezone
          : Intl.DateTimeFormat().resolvedOptions().timeZone;
        newDate = zonedDateTimeFromParts({...current, time, timezone});
      } else {
        newDate = current.date;
      }
    } else {
      if (time) {
        const initial = parseZonedDateTime(
          initialDate || nowZonedDateTimeISO()
        );
        const timezone = initial.time
          ? initial.timezone
          : Intl.DateTimeFormat().resolvedOptions().timeZone;
        newDate = zonedDateTimeFromParts({
          ...initial,
          time,
          timezone,
        });
      } else {
        newDate = null;
      }
    }
    this.props.onChange?.(newDate);
  };

  render() {
    const {
      value,
      onChange,
      requiredDate,
      requiredTime,
      isEndTime,
      ...props
    } = this.props;
    const {date, time} = value ? parseZonedDateTime(value) : {};
    return (
      <div className={this.styles.classNames.datetimeContainer}>
        <MagicDateField
          {...props}
          value={date}
          onChange={this.changeDate}
          required={requiredDate || requiredTime}
        />
        <MagicTimeField
          {...props}
          value={time}
          onChange={this.changeTime}
          required={requiredTime}
          isEndTime={isEndTime}
        />
      </div>
    );
  }
}
const MagicDatetimeField = withC(MagicDatetimeFieldNC, {value: 'onChange'});
MagicDatetimeField.displayName = 'MagicDatetimeField';

export default MagicDatetimeField;

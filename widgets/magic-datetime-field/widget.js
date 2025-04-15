import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicDateField from '../magic-date-field/widget.js';
import MagicTimeField from '../magic-time-field/widget.js';
import {date as DateConverters} from 'xcraft-core-converters';
import {plainDateISO, plainTimeISO} from 'xcraft-core-utils/lib/calendar.js';

class MagicDatetimeFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  changeDate = (date) => {
    const [_, time] = this.props.value?.split('T') || [];
    const newDate = date && time ? `${date}T${time}` : date;
    this.props.onChange?.(newDate);
  };

  changeTime = (time) => {
    const day = this.props.value?.split('T', 1)?.[0] || null;
    let newDate;
    if (!time) {
      newDate = day;
    } else if (!day) {
      const initialDate =
        this.props.initialDate?.split('T', 1)?.[0] ||
        DateConverters.getNowCanonical();
      newDate = `${initialDate}T${time}`;
    } else {
      newDate = `${day}T${time}`;
    }
    this.props.onChange?.(newDate);
  };

  render() {
    const {
      value,
      onChange,
      requiredDate,
      requiredTime,
      dispatch,
      ...props
    } = this.props;
    let date, time;
    if (value) {
      if (value.includes('T')) {
        const localDate = new Date(value);
        date = plainDateISO(localDate);
        time = plainTimeISO(localDate);
      } else {
        date = value;
        time = null;
      }
    }
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
        />
      </div>
    );
  }
}
const MagicDatetimeField = withC(MagicDatetimeFieldNC, {value: 'onChange'});
MagicDatetimeField.displayName = 'MagicDatetimeField';

export default MagicDatetimeField;

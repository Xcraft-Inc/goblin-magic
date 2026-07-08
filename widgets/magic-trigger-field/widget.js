import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import T from 'goblin-nabu/widgets/helpers/nabu.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';
import MagicSelect from 'goblin-magic/widgets/magic-select/widget.js';
import MagicNumberField from 'goblin-magic/widgets/magic-number-field/widget.js';
import {negativeDuration} from 'xcraft-core-converters/lib/calendar.js';

const intervalOrder = ['weeks', 'days', 'hours', 'minutes', 'seconds'];

class MagicTriggerFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  changeNumber = (name, number) => {
    let value = this.props.value;
    value = value.toJS?.() || value;
    this.props.onChange({
      ...value,
      interval: {
        ...value.interval,
        [name]: number,
      },
    });
  };

  changeType = (name, type) => {
    let value = this.props.value;
    value = value.toJS?.() || value;
    const {[name]: oldValue, ...oldInterval} = value.interval;
    this.props.onChange({
      ...value,
      interval: {
        ...oldInterval,
        [type]: oldValue,
      },
    });
  };

  setRelatedType = (relatedType, isBefore) => {
    let value = this.props.value;
    value = value.toJS?.() || value;
    const relatedTo = relatedType.includes('start') ? 'start' : 'end';
    const inverted =
      (isBefore && !relatedType.includes('before')) ||
      (!isBefore && relatedType.includes('before'));
    if (inverted && value.interval) {
      value.interval = negativeDuration(value.interval);
    }
    this.props.onChange({
      ...value,
      relatedTo,
    });
  };

  render() {
    const {disabled, kind = 'event'} = this.props;
    let value = this.props.value;
    value = value.toJS?.() || value;
    let interval = [];
    if (value.interval) {
      interval = Object.entries(value.interval)
        .filter(([name, number]) => typeof number === 'number')
        .sort(
          ([name1], [name2]) =>
            intervalOrder.indexOf(name1) - intervalOrder.indexOf(name2)
        );
    }
    if (interval.length === 0) {
      interval = [['minutes', 0]];
    }
    const isBefore = interval[0][1] <= 0;
    const beforeType = isBefore ? 'before' : 'after';
    const relatedType = `${beforeType}-${value.relatedTo || 'start'}`;
    return (
      <span className={this.styles.classNames.triggerField}>
        {interval.map(([name, number]) => (
          <span key={name} className="triggerInterval">
            <MagicNumberField
              value={isBefore ? -number : number}
              onChange={(newNumber) =>
                this.changeNumber(name, isBefore ? -newNumber : newNumber)
              }
              disabled={disabled}
            />{' '}
            <MagicSelect
              value={name}
              onChange={(type) => this.changeType(name, type)}
              disabled={disabled}
            >
              <option value="seconds">{T('secondes')}</option>
              <option value="minutes">{T('minutes')}</option>
              <option value="hours">{T('heures')}</option>
              <option value="days">{T('jours')}</option>
              <option value="weeks">{T('semaines')}</option>
            </MagicSelect>
          </span>
        ))}
        <MagicSelect
          value={relatedType}
          onChange={(relatedType) => this.setRelatedType(relatedType, isBefore)}
          disabled={disabled}
        >
          {/* <option value="start">{T("du début de l'événement")}</option> */}
          {/* <option value="end">{T("de la fin de l'événement")}</option> */}
          <option value="before-start">
            {kind === 'task'
              ? T('avant le début de la tâche')
              : T("avant le début de l'événement")}
          </option>
          <option value="after-start">
            {kind === 'task'
              ? T('après le début de la tâche')
              : T("après le début de l'événement")}
          </option>
          <option value="before-end">
            {kind === 'task'
              ? T('avant la fin de la tâche')
              : T("avant la fin de l'événement")}
          </option>
          <option value="after-end">
            {kind === 'task'
              ? T('après la fin de la tâche')
              : T("après la fin de l'événement")}
          </option>
        </MagicSelect>
      </span>
    );
  }
}
const MagicTriggerField = withC(MagicTriggerFieldNC, {value: 'onChange'});

export default MagicTriggerField;

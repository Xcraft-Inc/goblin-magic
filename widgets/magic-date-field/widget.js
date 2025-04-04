import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicTextField from '../magic-text-field/widget.js';

import {date as DateConverters} from 'xcraft-core-converters';
import InputGroup from '../input-group/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiCalendarMonth} from '@mdi/js';

class MagicDateFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  static parseEdited(value) {
    if (!value) {
      return null;
    }
    const edited = DateConverters.parseEdited(value);
    // if (edited.error) {
    //   return null;
    // }
    return edited.value;
  }

  parse = (value) => {
    const newValue = MagicDateFieldNC.parseEdited(value);
    if (this.props.required && !newValue) {
      return DateConverters.getNowCanonical();
    }
    return newValue;
  };

  format = (value) => {
    if (!value) {
      return '';
    }
    return DateConverters.getDisplayed(value.split('T', 1)[0]);
  };

  render() {
    const {className = '', required, ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          format={this.format}
          parse={this.parse}
          {...props}
          className={this.styles.classNames.dateField + ' ' + className}
        />
        <MagicButton disabled>
          <Icon path={mdiCalendarMonth} size={0.8} />
        </MagicButton>
      </InputGroup>
    );
  }
}
const MagicDateField = withC(MagicDateFieldNC, {value: 'onChange'});
MagicDateField.displayName = 'MagicDateField';

export default MagicDateField;

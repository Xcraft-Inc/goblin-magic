import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicTextField from '../magic-text-field/widget.js';
import {time as TimeConverters} from 'xcraft-core-converters';
import InputGroup from '../input-group/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiClockOutline} from '@mdi/js';

class MagicTimeFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  static parseEdited(value) {
    if (!value) {
      return null;
    }
    const edited = TimeConverters.parseEdited(value);
    return edited.value;
  }

  parse = (value) => {
    const newValue = MagicTimeFieldNC.parseEdited(value);
    if (this.props.required && !newValue) {
      return TimeConverters.getNowCanonical();
    }
    return newValue;
  };

  format = (value) => {
    if (!value) {
      return '';
    }
    return TimeConverters.getDisplayed(value.split(/[.\-+Z]/, 1)[0]);
  };

  render() {
    const {className = '', ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          format={this.format}
          parse={this.parse}
          {...props}
          className={this.styles.classNames.timeField + ' ' + className}
        />
        <MagicButton disabled>
          <Icon path={mdiClockOutline} size={0.8} />
        </MagicButton>
      </InputGroup>
    );
  }
}
const MagicTimeField = withC(MagicTimeFieldNC, {value: 'onChange'});
MagicTimeField.displayName = 'MagicTimeField';

export default MagicTimeField;

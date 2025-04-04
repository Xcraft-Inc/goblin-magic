import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicTextField from '../magic-text-field/widget.js';
import {number as NumberConverters} from 'xcraft-core-converters';
import InputGroup from '../input-group/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiMinus, mdiPlus} from '@mdi/js';

class MagicNumberFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  parse = (value) => {
    const {min, max} = this.props;
    const edited = NumberConverters.parseEdited(value, min, max);
    return edited.value;
  };

  format = (value) => {
    if (!value && value !== 0) {
      return '';
    }
    return NumberConverters.getDisplayed(value);
  };

  increase = () => {
    const {value, max, step = 1} = this.props;
    if (max === undefined || value < max) {
      this.props.onChange?.(value + step);
    }
  };

  decrease = () => {
    const {value, min, step = 1} = this.props;
    if (min === undefined || value > min) {
      this.props.onChange?.(value - step);
    }
  };

  render() {
    const {className = '', ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          format={this.format}
          parse={this.parse}
          {...props}
          className={this.styles.classNames.numberField + ' ' + className}
        />
        <MagicButton onClick={this.decrease} disabled={props.disabled}>
          <Icon path={mdiMinus} size={0.8} />
        </MagicButton>
        <MagicButton onClick={this.increase} disabled={props.disabled}>
          <Icon path={mdiPlus} size={0.8} />
        </MagicButton>
      </InputGroup>
    );
  }
}
const MagicNumberField = withC(MagicNumberFieldNC, {value: 'onChange'});
MagicNumberField.displayName = 'MagicNumberField';

export default MagicNumberField;

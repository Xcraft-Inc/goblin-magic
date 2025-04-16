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
    this.inputRef = this.props.inputRef || React.createRef();
  }

  get input() {
    return this.inputRef.current;
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

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const {max, min, step = 1} = this.props;
      const value = this.parse(event.target.value);
      const newStep = event.shiftKey ? 10 * step : step;
      const direction = event.key === 'ArrowUp' ? 1 : -1;
      let newValue = value + newStep * direction;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (newValue !== value) {
        const text = this.format(newValue);
        this.input.changeAndSelect(
          text,
          event.shiftKey ? 0 : text.length,
          text.length
        );
      }

      event.preventDefault();
    }
  };

  render() {
    const {className = '', ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          inputRef={this.inputRef}
          format={this.format}
          parse={this.parse}
          {...props}
          onKeyDown={this.handleKeyDown}
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

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
    this.inputRef = this.props.inputRef || React.createRef();
  }

  get input() {
    return this.inputRef.current;
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

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const {value, selectionStart, selectionEnd} = event.target;
      const cursorPosition =
        selectionStart < 2
          ? selectionStart
          : (selectionStart + selectionEnd) / 2;
      const step = event.shiftKey && cursorPosition <= 2 ? 7 : 1;
      const direction = event.key === 'ArrowUp' ? 1 : -1;
      const result = DateConverters.incEdited(
        value,
        cursorPosition,
        direction,
        step
      );
      if (result.edited) {
        this.input.changeAndSelect(
          result.edited,
          result.selectionStart,
          result.selectionEnd
        );
      }

      event.preventDefault();
    }
  };

  render() {
    const {className = '', required, ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          inputRef={this.inputRef}
          format={this.format}
          parse={this.parse}
          {...props}
          onKeyDown={this.handleKeyDown}
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

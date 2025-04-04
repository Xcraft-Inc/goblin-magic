import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicTextField from '../magic-text-field/widget.js';
import InputGroup from '../input-group/widget.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiPalette} from '@mdi/js';

class MagicColorFieldButtonNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {value, onChange, className = '', ...props} = this.props;

    return (
      <MagicButton disabled>
        <label
          {...props}
          className={this.styles.classNames.colorPreview + ' ' + className}
          style={{
            backgroundColor: value,
          }}
        >
          {!value && <Icon path={mdiPalette} size={0.8} />}
          <input
            type="color"
            value={value || ''}
            onChange={(event) => onChange?.(event.target.value)}
          />
        </label>
      </MagicButton>
    );
  }
}

export const MagicColorFieldButton = withC(MagicColorFieldButtonNC, {
  value: 'onChange',
});
MagicColorFieldButton.displayName = 'MagicColorFieldButton';

class MagicColorFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <InputGroup>
        <MagicTextField
          {...props}
          className={this.styles.classNames.colorField + ' ' + className}
        />
        <MagicColorFieldButton value={props.value} onChange={props.onChange} />
      </InputGroup>
    );
  }
}
const MagicColorField = withC(MagicColorFieldNC, {value: 'onChange'});
MagicColorField.displayName = 'MagicColorField';

export default MagicColorField;

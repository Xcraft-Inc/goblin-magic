import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';

class InputCheckbox extends Widget {
  constructor() {
    super(...arguments);
    this.onChange = this.onChange.bind(this);
    this.styles = styles;
  }

  onChange(e) {
    this.props.onChange(e.target.checked);
  }

  render() {
    const {value, ...props} = this.props;
    return (
      <input
        {...props}
        type="checkbox"
        className={this.styles.classNames.input}
        onChange={this.onChange}
        checked={value}
      />
    );
  }
}

class MagicCheckboxNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {
      value,
      onChange,
      text,
      title,
      disabled,
      small,
      children,
      className = '',
      ...props
    } = this.props;
    return (
      <label
        className={this.styles.classNames.checkboxLabel + ' ' + className}
        title={title}
      >
        <InputCheckbox
          {...props}
          data-small={small}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <span className={this.styles.classNames.text}>{text || children}</span>
      </label>
    );
  }
}
const MagicCheckbox = withC(MagicCheckboxNC, {value: 'onChange'});
MagicCheckbox.displayName = 'MagicCheckbox';
export default MagicCheckbox;

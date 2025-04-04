import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';

class InputRadio extends Widget {
  constructor() {
    super(...arguments);
    this.onChange = this.onChange.bind(this);
    this.styles = styles;
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const {name, value, checked, state, ...props} = this.props;
    return (
      <input
        {...props}
        type="radio"
        name={name}
        value={value}
        checked={state !== undefined ? state === value : checked}
        className={this.styles.classNames.input}
        onChange={this.onChange}
      />
    );
  }
}

class MagicRadioNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {
      name,
      value,
      checked,
      state,
      onChange,
      text,
      title,
      disabled,
      children,
      className = '',
      ...props
    } = this.props;
    return (
      <label
        className={this.styles.classNames.radioLabel + ' ' + className}
        title={title}
      >
        <InputRadio
          {...props}
          name={name}
          value={value}
          checked={checked}
          state={state}
          onChange={onChange}
          disabled={disabled}
        />
        <span className={this.styles.classNames.text}>{text || children}</span>
      </label>
    );
  }
}
const MagicRadio = withC(MagicRadioNC, {state: 'onChange'});
MagicRadio.displayName = 'MagicRadio';
export default MagicRadio;

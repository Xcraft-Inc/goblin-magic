import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import {TranslatableButton} from 'goblin-nabu/widgets/helpers/element-helpers.js';

class MagicButtonNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.handlePointerDown = this.handlePointerDown.bind(this);
  }

  /**
   * @param {PointerEvent} event
   */
  handlePointerDown(event) {
    const button = event.currentTarget;
    const disabled = [
      ...button.parentElement.querySelectorAll(':disabled'),
    ].includes(button);
    if (disabled) {
      return;
    }
    this.props.onPointerDown(event);
  }

  renderChildren(spinner, len1) {
    const children = React.Children.map(this.props.children, (child) => {
      if (typeof child === 'string') {
        return <span>{child}</span>;
      }
      return child;
    });
    return (
      <>
        {!(Boolean(spinner) && len1) && children}
        {spinner && <span className={this.styles.classNames.spinner} />}
      </>
    );
  }

  render() {
    const {
      enabled,
      underlined,
      big,
      simple,
      spinner,
      onPointerDown,
      className = '',
      title,
      ...props
    } = this.props;
    const len1 =
      typeof this.props.children === 'string' &&
      this.props.children.length === 1;

    return title ? (
      <TranslatableButton
        {...props}
        className={this.styles.classNames.button + ' button ' + className}
        data-enabled={enabled}
        data-underlined={underlined}
        data-big={big}
        data-simple={simple}
        data-len1={len1}
        onPointerDown={onPointerDown && this.handlePointerDown}
        title={title}
      >
        {this.renderChildren(spinner, len1)}
      </TranslatableButton>
    ) : (
      <button
        {...props}
        className={this.styles.classNames.button + ' button ' + className}
        data-enabled={enabled}
        data-underlined={underlined}
        data-big={big}
        data-simple={simple}
        data-len1={len1}
        onPointerDown={onPointerDown && this.handlePointerDown}
      >
        {this.renderChildren(spinner, len1)}
      </button>
    );
  }
}
const MagicButton = withC(MagicButtonNC);
MagicButton.displayName = 'MagicButton';

export default MagicButton;

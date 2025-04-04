import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Menu from '../menu/widget.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';
import MagicEmojiPickerNC from '../magic-emoji-picker/widget.js';

class MagicEmojiNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {onChange, ...props} = this.props;
    const onEmojiSelect = (emoji) => onChange(emoji?.native);

    return (
      <Menu>
        <Menu.Button className={this.styles.classNames.button}>
          {props.value}
        </Menu.Button>
        <Menu.Content className={this.styles.classNames.content}>
          <MagicEmojiPickerNC onEmojiSelect={onEmojiSelect} {...props} />
        </Menu.Content>
      </Menu>
    );
  }
}

const MagicEmoji = withC(MagicEmojiNC, {value: 'onChange'});

export default MagicEmoji;

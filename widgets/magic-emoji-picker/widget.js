import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

class MagicEmojiPickerNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;

    let theme = 'light';
    let emojiButtonColors = 'rgba(0, 0, 0, 0.1)';
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      theme = 'dark';
      emojiButtonColors = 'rgba(255, 255, 255, 0.2)';
    }

    return (
      <div className={this.styles.classNames.picker + ' ' + className}>
        <Picker
          data={data}
          locale="fr"
          set="native"
          theme={theme}
          previewPosition="none"
          autoFocus={true}
          emojiButtonRadius="4px"
          emojiButtonColors={[emojiButtonColors]}
          {...props}
        />
      </div>
    );
  }
}

export default MagicEmojiPickerNC;

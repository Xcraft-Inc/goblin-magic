import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';

class MagicWave extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const bars = this.props.bars || 5;
    return (
      <div className={this.styles.classNames.wave}>
        {[...Array(bars)].map((_, i) => {
          const center = (bars - 1) / 2;
          const distance = Math.abs(i - center);
          const level = 0.1 + (1 - distance / center) * 0.1;
          const speed = `${(0.45 + Math.random() * 0.35).toFixed(2)}s`;
          return (
            <span
              key={i}
              style={{
                '--i': i,
                '--level': level.toFixed(2),
                '--speed': speed,
              }}
            />
          );
        })}
      </div>
    );
  }
}

export default MagicWave;

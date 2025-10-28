import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

class MaxTextWidth extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    return (
      <span className={this.styles.classNames.maxTextWidth}>
        <div className={this.styles.classNames.visible}>
          {this.props.children}
        </div>
        <div className={this.styles.classNames.hidden}>
          {this.props.texts.map((text, index) => (
            <div key={index}>{text}</div>
          ))}
        </div>
      </span>
    );
  }
}

export default MaxTextWidth;

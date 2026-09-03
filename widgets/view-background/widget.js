import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import * as styles from './styles.js';
import MagicDiv from '../magic-div/widget.js';
import {withView} from '../magic-navigation/view-context.js';

class ViewBackgroundNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {view, className = '', children, ...props} = this.props;
    const isDialog = view.get('id').startsWith('dialog');
    return (
      <MagicDiv
        data-is-dialog={isDialog}
        {...props}
        className={this.styles.classNames.viewBackground + ' ' + className}
      >
        {children}
      </MagicDiv>
    );
  }
}

const ViewBackground = withView(ViewBackgroundNC);

export default ViewBackground;

import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';

const hiddenStyle = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  visibility: 'hidden',
};

class WithComputedSize extends Widget {
  constructor() {
    super(...arguments);
    this.state = {
      size: null,
      mounted: false,
    };
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    // If we use getBoundingClientRect in componentDidMount, the width and height are zero
    this.setState({
      mounted: true,
    });
  }

  componentDidUpdate() {
    if (!this.state.size) {
      const element = this.contentRef.current;
      if (!element) {
        console.error(
          `Ref not available in <WithComputedSize>. Unable to render its content.`
        );
      }
      const {width, height} = element.getBoundingClientRect();
      this.setState({
        size: {width, height},
      });
    }
  }

  render() {
    const style = this.state.size ? null : hiddenStyle;
    return (
      this.state.mounted &&
      this.props.children(this.contentRef, style, this.state.size)
    );
  }
}

export default WithComputedSize;

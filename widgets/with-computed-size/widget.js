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
    this.resizeObserver = new ResizeObserver((entries) => {
      if (entries.length < 1) {
        return;
      }
      const entry = entries[0];
      const boxSize = entry.borderBoxSize[0];
      const width = boxSize.inlineSize;
      const height = boxSize.blockSize;
      const newSize = {width, height};

      let update = false;
      if (
        this.props.observeResize !== 'height' &&
        width !== 0 &&
        width !== this.state.size.width
      ) {
        update = true;
      }
      if (
        this.props.observeResize !== 'width' &&
        height !== 0 &&
        height !== this.state.size.height
      ) {
        update = true;
      }

      if (update) {
        this.setState({size: newSize});
      }
    });
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

      if (this.props.observeResize) {
        this.resizeObserver.observe(element);
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

import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';

class Resizer extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    const {width = 800, height = 600} = this.props;
    this.state = {
      isDragging: false,
      size: {width, height},
    };
  }

  onDragDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    this.setState({isDragging: true});
    this.initialPositionX = e.clientX;
    this.initialPositionY = e.clientY;
    this.initialWidth = this.state.size.width;
    this.initialHeight = this.state.size.height;
  };

  onDragMove = (e) => {
    if (!this.state.isDragging) {
      return;
    }

    const {minWidth = 0, minHeight = 0} = this.props;
    const deltaX = this.initialPositionX - e.clientX;
    const deltaY = this.initialPositionY - e.clientY;
    const width = Math.max(this.initialWidth + deltaX, minWidth);
    const height = Math.max(this.initialHeight + deltaY, minHeight);
    this.setState({size: {width, height}});
  };

  onDragUp = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    this.setState({isDragging: false});
  };

  renderButton() {
    return (
      <div
        className={this.styles.classNames.button}
        onPointerDown={this.onDragDown}
        onPointerMove={this.onDragMove}
        onPointerUp={this.onDragUp}
      ></div>
    );
  }

  render() {
    const {className = '', disable} = this.props;
    const style = {
      width: this.state.size.width,
      height: this.state.size.height,
      transition: this.state.isDragging ? 'none' : null,
    };
    return (
      <div
        className={this.styles.classNames.resizer + ' ' + className}
        style={!disable ? style : null}
      >
        {!disable ? this.renderButton() : null}
        {this.props.children}
      </div>
    );
  }
}

export default Resizer;

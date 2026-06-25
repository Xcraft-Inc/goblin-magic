import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import * as styles from './styles.js';
import InlineIcon from '../inline-icon/widget.js';
import {mdiClose} from '@mdi/js';
import MagicButton from '../magic-button/widget.js';
import Dialog from '../dialog/widget.js';
import Popover from '../popover/widget.js';

/**
 * @typedef {'popover' | 'popover-closable' | 'popover-dialog' | 'modal-dialog'} OverlayMode
 */

/** @type {React.Context<MagicOverlay>} */
const OverlayContext = React.createContext();
/** @type {React.Context<MagicOverlay['state']>} */
const OverlayStateContext = React.createContext();

class Overlay extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    /** @type {React.RefObject<Popover | Dialog>} */
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.updateOutsideClickHandler();
  }

  componentDidUpdate() {
    this.updateOutsideClickHandler();
  }

  componentWillUnmount() {
    this.removeOutsideClickHandler();
  }

  updateOutsideClickHandler() {
    if (this.props.mode === 'popover-closable') {
      this.addOutsideClickHandler();
    } else {
      this.removeOutsideClickHandler();
    }
  }

  addOutsideClickHandler() {
    // It's better to use 'pointerdown' and 'pointerup' instead of 'click'
    // as the click will trigger when the down is done inside the overlay and up outside.
    window.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  removeOutsideClickHandler() {
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
  }

  handlePointerDown = (event) => {
    const {target} = event;
    const element = this.ref.current?.popover?.current;
    if (element && !element.contains(target)) {
      this.downEvent = event;
    }
  };

  handlePointerUp = (event) => {
    if (this.downEvent) {
      if (event.target === this.downEvent.target) {
        this.ref.current.popover?.current?.hidePopover();
      }
      this.downEvent = null;
    }
  };

  render() {
    const {mode = 'popover', source, ...props} = this.props;
    if (mode === 'modal-dialog') {
      return <Dialog ref={this.ref} modal closedby="any" {...props} />;
    }

    return (
      <>
        <Popover
          ref={this.ref}
          Component={mode === 'popover-dialog' ? 'dialog' : 'div'}
          source={source}
          {...props}
        />
        {mode === 'popover-closable' && (
          <div className={this.styles.classNames.overlayBackdrop}></div>
        )}
      </>
    );
  }
}

class MagicOverlayButton extends Widget {
  constructor() {
    super(...arguments);
  }

  /**
   * @param {PointerEvent} event
   * @param {MagicOverlay} overlay
   */
  handleClick = (event, overlay) => {
    const {action = 'toggle', mode = 'modal-dialog'} = this.props;
    overlay[action]({mode});
    event.stopPropagation();
  };

  render() {
    const {Component = MagicButton, anchorName, ...props} = this.props;
    const anchorProps = anchorName
      ? {
          'style': {anchorName},
          'data-anchor-name': anchorName,
        }
      : {};
    return (
      <OverlayContext.Consumer>
        {(overlay) => (
          <Component
            onClick={(event) => this.handleClick(event, overlay)}
            {...anchorProps}
            {...props}
          >
            {this.props.children}
          </Component>
        )}
      </OverlayContext.Consumer>
    );
  }
}

class MagicOverlayCloseButton extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    return (
      <MagicOverlayButton simple action="close" {...this.props}>
        <InlineIcon path={mdiClose} size={0.8} />
      </MagicOverlayButton>
    );
  }
}

class MagicOverlayContent extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  /**
   * @param {Event} event
   * @param {MagicOverlay} overlay
   */
  handlePointerDown(event, overlay) {
    if (overlay.state.mode === 'popover') {
      overlay.setMode('popover-closable');
    }
  }

  /**
   * @param {Event} event
   * @param {MagicOverlay} overlay
   */
  handleToggle(event, overlay) {
    this.props.onToggle?.(event);
    if (event.newState === 'open') {
      overlay.open();
    } else if (event.newState === 'closed') {
      overlay.close();
    }
    event.stopPropagation();
  }

  render() {
    const {className = '', style = {}, ...props} = this.props;
    return (
      <OverlayStateContext.Consumer>
        {(state) => (
          <OverlayContext.Consumer>
            {(overlay) => (
              <Overlay
                {...props}
                onPointerDownCapture={(event) =>
                  this.handlePointerDown(event, overlay)
                }
                mode={state.mode}
                style={{positionAnchor: overlay.anchorName, ...style}}
                open={state.open}
                onToggle={(event) => this.handleToggle(event, overlay)}
                className={
                  this.styles.classNames.magicOverlay + ' ' + className
                }
              />
            )}
          </OverlayContext.Consumer>
        )}
      </OverlayStateContext.Consumer>
    );
  }
}

let overlayCount = 0;

class MagicOverlay extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      open: false,
      mode: 'dialog',
    };
    this.anchorName =
      this.props.anchorName || `--magic-overlay-anchor-${overlayCount++}`;
  }

  /**
   * @param {{mode?: OverlayMode}} [options]
   */
  open = (options = {}) => {
    if (!this.state.open) {
      this.setState({
        ...options,
        open: true,
      });
    }
  };

  close = () => {
    this.setState({
      open: false,
      mode: 'dialog',
    });
  };

  /**
   * @param {{mode?: OverlayMode}} [options]
   */
  toggle = (options) => {
    if (!this.state.open) {
      this.open(options);
    } else {
      this.close();
    }
  };

  /**
   * @param {OverlayMode} mode
   */
  setMode = (mode) => {
    this.setState({
      mode,
    });
  };

  render() {
    const {children} = this.props;
    let isFirstButton = true;
    return (
      <OverlayContext.Provider value={this}>
        <OverlayStateContext.Provider value={this.state}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
              return child;
            }
            if (child.type === MagicOverlayButton && isFirstButton) {
              isFirstButton = false;
              return React.cloneElement(child, {
                anchorName: this.anchorName,
              });
            }
            return child;
          })}
        </OverlayStateContext.Provider>
      </OverlayContext.Provider>
    );
  }
}

MagicOverlay.Content = MagicOverlayContent;
MagicOverlay.Button = MagicOverlayButton;
MagicOverlay.CloseButton = MagicOverlayCloseButton;

export default MagicOverlay;

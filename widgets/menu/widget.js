import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Dialog from '../dialog/widget.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import MagicButton from 'goblin-magic/widgets/magic-button/widget.js';
import WithComputedSize from '../with-computed-size/widget.js';

const MenuContext = React.createContext();
const MenuStateContext = React.createContext();

class MenuItem extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  /**
   * @param {PointerEvent} event
   * @param {Menu} menu
   */
  handleClick(event, menu) {
    this.props.onClick?.(event);
    if (!event.nativeEvent.pointerType) {
      // Keyboard action
      if (this.props.onPointerUp && !this.props.onClick) {
        this.props.onPointerUp?.(event);
      }
      if (!event.defaultPrevented) {
        menu.close();
      }
    }
  }

  /**
   * @param {PointerEvent} event
   * @param {Menu} menu
   */
  handlePointerUp(event, menu) {
    this.props.onPointerUp?.(event);
    if (!event.defaultPrevented) {
      menu.close();
    }
  }

  render() {
    const {className = '', rightIcon, children, ...props} = this.props;
    return (
      <MenuContext.Consumer>
        {(menu) => (
          <button
            {...props}
            className={this.styles.classNames.menuItem + ' ' + className}
            onPointerUp={(event) => this.handlePointerUp(event, menu)}
            onClick={(event) => this.handleClick(event, menu)}
          >
            {children}
            <div className={this.styles.classNames.menuItemRight}>
              {rightIcon}
            </div>
          </button>
        )}
      </MenuContext.Consumer>
    );
  }
}

class MenuTitle extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', children, ...props} = this.props;
    return (
      <div
        {...props}
        className={this.styles.classNames.menuTitle + ' ' + className}
      >
        {children}
        <hr />
      </div>
    );
  }
}

class Submenu extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  handlePointerUp(event) {
    event.preventDefault();
  }

  // handleKeyDown = (event) => {
  //   this.props.onKeyDown?.(event);
  //   if (event.key === 'ArrowRight') {
  //     event.currentTarget.click();
  //   }
  // };

  render() {
    const {item, ...props} = this.props;
    return (
      <div className={this.styles.classNames.submenu}>
        <MenuItem
          onPointerUp={this.handlePointerUp}
          rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
          // onKeyDown={this.handleKeyDown}
        >
          {item}
        </MenuItem>
        <SubmenuContent {...props} />
      </div>
    );
  }
}

class SubmenuContent extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }
  render() {
    const {className = '', children, position, ...props} = this.props;
    return (
      <div
        {...props}
        className={'content ' + className}
        data-position={position}
      >
        {children}
      </div>
    );
  }
}

class MenuHr extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <hr
        {...props}
        className={this.styles.classNames.menuHr + ' ' + className}
      />
    );
  }
}

class MenuButton extends Widget {
  constructor() {
    super(...arguments);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  /**
   * @param {PointerEvent} event
   * @param {Menu} menu
   */
  handleClick = (event, menu) => {
    // The click event is called when the space key is pressed
    menu.open(event);
    event.stopPropagation();
  };

  /**
   * @param {PointerEvent} event
   * @param {Menu} menu
   */
  handlePointerDown = (event, menu) => {
    event.currentTarget?.focus();
    window.addEventListener('click', (event) => event.stopPropagation(), {
      capture: true,
      once: true,
    });
    menu.open(event);
  };

  render() {
    const {Component = MagicButton, ...props} = this.props;
    return (
      <MenuContext.Consumer>
        {(menu) => (
          <Component
            onPointerDown={(event) => this.handlePointerDown(event, menu)}
            onPointerUp={this.stopPropagation}
            onClick={(event) => this.handleClick(event, menu)}
            {...props}
          >
            {this.props.children || <FontAwesomeIcon icon={faBars} />}
          </Component>
        )}
      </MenuContext.Consumer>
    );
  }
}

class MenuContent extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.handleClose = this.handleClose.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  /**
   * @param {Event} event
   * @param {Menu} menu
   */
  handleClose(event, menu) {
    menu.close();
    event.stopPropagation();
  }

  /**
   * @param {Event} event
   */
  stopPropagation(event) {
    event.stopPropagation();
  }

  focusNext(event, num = 1) {
    const element = event.currentTarget;
    const buttons = [...element.querySelectorAll('button')].filter(
      (element) =>
        element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement
    );
    const currentIndex = buttons.indexOf(document.activeElement);
    const nextIndex = (currentIndex + num + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  }

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);
    if (event.key === 'ArrowDown') {
      this.focusNext(event, 1);
    } else if (event.key === 'ArrowUp') {
      this.focusNext(event, -1);
    }
  };

  getStyle(state, size) {
    let {top, right, bottom, left} = state;
    const {offsetX = 0, offsetY = 0} = this.props;
    top -= 2 - offsetY;
    bottom += 2 + offsetY;
    left -= 1 - offsetX;
    right += 1 + offsetX;

    const position = state.fromContextMenu
      ? 'bottom right'
      : this.props.position || 'bottom right';

    if (!size) {
      size = {
        width: 0,
        height: 0,
      };
    }

    const [firstPos, secondPos] = position.split(' ');

    const verticalPos = (() => {
      const firstBottom = firstPos === 'bottom';
      const firstTop = firstPos === 'top';

      if (size.height > window.innerHeight) {
        return 'full';
      }

      if (firstBottom || firstTop) {
        const notBottom = bottom + size.height > window.innerHeight;
        const notTop = top - size.height < 0;

        if (firstTop) {
          if (notTop) {
            if (notBottom) {
              return 'start';
            }
            return 'bottom';
          }
          return 'top';
        }

        if (notBottom) {
          if (notTop) {
            return 'end';
          }
          return 'top';
        }
        return 'bottom';
      }

      const notSpanBottom = top + size.height > window.innerHeight;
      const notSpanTop = bottom - size.height < 0;

      if (secondPos === 'top') {
        if (notSpanTop) {
          return 'start';
        }
        return 'span-top';
      }

      if (notSpanBottom) {
        return 'end';
      }
      return 'span-bottom';
    })();

    const verticalStyle = {
      'bottom': {top: bottom},
      'top': {bottom: `calc(100% - ${top}px)`},
      'span-bottom': {top},
      'span-top': {bottom: `calc(100% - ${bottom}px)`},
      'start': {top: 0},
      'end': {bottom: 0},
      'full': {top: 0, bottom: 0},
    }[verticalPos];

    const horizontalPos = (() => {
      const firstRight = firstPos === 'right';
      const firstLeft = firstPos === 'left';

      if (size.width > window.innerWidth) {
        return 'full';
      }

      if (firstRight || firstLeft) {
        const notRight = right + size.width > window.innerWidth;
        const notLeft = left - size.width < 0;

        if (firstLeft) {
          if (notLeft) {
            if (notRight) {
              return 'start';
            }
            return 'right';
          }
          return 'left';
        }

        if (notRight) {
          if (notLeft) {
            return 'end';
          }
          return 'left';
        }
        return 'right';
      }

      const notSpanRight = left + size.width > window.innerWidth;
      const notSpanLeft = right - size.width < 0;

      if (secondPos === 'left') {
        if (notSpanLeft) {
          return 'start';
        }
        return 'span-left';
      }

      if (notSpanRight) {
        return 'end';
      }
      return 'span-right';
    })();

    const horizontalStyle = {
      'right': {left: right},
      'left': {right: `calc(100% - ${left}px)`},
      'span-right': {left},
      'span-left': {right: `calc(100% - ${right}px)`},
      'start': {left: 0},
      'end': {right: 0},
      'full': {left: 0, right: 0},
    }[horizontalPos];

    // console.log(verticalPos, horizontalPos, {
    //   ...verticalStyle,
    //   ...horizontalStyle,
    // });

    return {...verticalStyle, ...horizontalStyle};
  }

  renderDialog(state, menu) {
    const {open} = state;
    const {
      className = '',
      modal = true,
      children,
      offsetX,
      offsetY,
      portal = modal,
      ...props
    } = this.props;
    return (
      <Dialog
        open={open}
        modal={modal}
        onClose={(event) => this.handleClose(event, menu)}
        className={this.styles.classNames.menuDialog}
        portal={portal}
        onClick={this.stopPropagation}
        onPointerUp={this.stopPropagation}
        onPointerDown={this.stopPropagation}
        onContextMenu={this.stopPropagation}
        onKeyDown={this.handleKeyDown}
      >
        {open && (
          <WithComputedSize>
            {(ref, toComputeSizeStyle, size) => {
              return (
                <div
                  ref={ref}
                  className={this.styles.classNames.menuPosition}
                  style={toComputeSizeStyle || this.getStyle(state, size)}
                >
                  <div
                    {...props}
                    className={
                      this.styles.classNames.menuContent + ' ' + className
                    }
                  >
                    <div tabIndex={0} />
                    {children}
                  </div>
                </div>
              );
            }}
          </WithComputedSize>
        )}
      </Dialog>
    );
  }

  render() {
    return (
      <MenuStateContext.Consumer>
        {(state) => (
          <MenuContext.Consumer>
            {(menu) => this.renderDialog(state, menu)}
          </MenuContext.Consumer>
        )}
      </MenuStateContext.Consumer>
    );
  }
}

export default class Menu extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      open: false,
      x: null,
      y: null,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.menuContext = {
      open: this.open,
      close: this.close,
      toggle: this.toggle,
    };
  }

  /**
   * @param {MouseEvent} event
   */
  open(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const {top, right, bottom, left} = rect;
    this.setState({
      open: true,
      top,
      right,
      bottom,
      left,
      fromContextMenu: false,
    });
    event.stopPropagation();
  }

  close() {
    this.setState({open: false});
  }

  toggle(event) {
    if (this.state.open) {
      this.close();
    } else {
      this.open(event);
    }
  }

  /**
   * @param {MouseEvent} event
   */
  handleContextMenu(event) {
    event.preventDefault();
    this.setState({
      open: true,
      left: event.clientX,
      right: event.clientX,
      top: event.clientY,
      bottom: event.clientY,
      fromContextMenu: true,
    });
    event.stopPropagation();
  }

  render() {
    return (
      <MenuContext.Provider value={this.menuContext}>
        <MenuStateContext.Provider value={this.state}>
          {React.Children.map(this.props.children, (child) => {
            if (!React.isValidElement(child)) {
              return child;
            }
            if (child.type === MenuContent) {
              return child;
            }
            return React.cloneElement(child, {
              onContextMenu: this.handleContextMenu,
            });
          })}
        </MenuStateContext.Provider>
      </MenuContext.Provider>
    );
  }

  static Context = MenuContext;
  static Content = MenuContent;
  static Item = MenuItem;
  static Title = MenuTitle;
  static Submenu = Submenu;
  static Hr = MenuHr;
  static Button = MenuButton;
}

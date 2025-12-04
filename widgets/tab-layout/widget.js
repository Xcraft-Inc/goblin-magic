import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';

class TabLayout extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {children, className = '', ...props} = this.props;
    return (
      <div
        {...props}
        className={this.styles.classNames.tabLayout + ' ' + className}
      >
        {children}
      </div>
    );
  }
}

class TabLayoutTabs extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      dropElement: false,
      dropElementId: null,
      dropElementOrder: null,
      dropElementWidth: null,
    };
    // this.debug = true;
  }

  handleTabClick = (value, event) => {
    this.props.onTabClick?.(value, event);
  };

  /**
   * @param {DragEvent} event
   * @param {string} tabId
   */
  handleDragStart = (event, tabId) => {
    /** @type {HTMLElement} */
    const movedElement = event.currentTarget;
    const movedRect = movedElement.getBoundingClientRect();
    const movedWidth = movedRect.width;
    const movedDiff = (movedRect.left + movedRect.right) / 2 - event.clientX;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', tabId);
    event.dataTransfer.setData(`x-data/group-${this.props.dragGroup}`, '');
    event.dataTransfer.setData(`x-data/id-${tabId}`, '');
    event.dataTransfer.setData(`x-data/width-${movedWidth}`, '');
    event.dataTransfer.setData(`x-data/diff-${movedDiff}`, '');
  };

  /**
   * @param {DragEvent} event
   */
  handleDragEnd = (event) => {};

  addDebugV(x, y, color, duration = 5) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '3px';
    div.style.left = x - 1 + 'px';
    div.style.top = y + 'px';
    div.style.height = '40px';
    div.style.backgroundColor = color;
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, duration * 1000);
  }

  addDebugH(y, color, duration = 5) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '10px';
    div.style.right = '10px';
    div.style.top = y - 1 + 'px';
    div.style.height = '3px';
    div.style.backgroundColor = color;
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, duration * 1000);
  }

  /**
   * @param {DragEvent} event
   */
  getMovedGroup(event) {
    return event.dataTransfer.types
      .find((data) => data.startsWith('x-data/group-'))
      ?.slice('x-data/group-'.length);
  }

  /**
   * @param {DragEvent} event
   */
  getMovedTabId(event) {
    return event.dataTransfer.types
      .find((data) => data.startsWith('x-data/id-'))
      .slice('x-data/id-'.length);
  }

  /**
   * @param {DragEvent} event
   */
  getMovedWidth(event) {
    return Number(
      event.dataTransfer.types
        .find((data) => data.startsWith('x-data/width-'))
        .slice('x-data/width-'.length)
    );
  }

  /**
   * @param {DragEvent} event
   */
  getMovedDiff(event) {
    return Number(
      event.dataTransfer.types
        .find((data) => data.startsWith('x-data/diff-'))
        .slice('x-data/diff-'.length)
    );
  }

  /**
   * @param {DOMRect[]} rects
   */
  computeRows(rects) {
    rects = rects.filter((rect) => rect.width !== 0 || rect.height !== 0);
    const rows = [];
    let currentRow = {start: -Infinity, end: Infinity};
    for (let i = 1; i < rects.length; i++) {
      const leftRect = rects[i - 1];
      const rightRect = rects[i];
      if (rightRect.top > leftRect.bottom) {
        const mid = (leftRect.bottom + rightRect.top) / 2;
        currentRow.end = mid;
        rows.push(currentRow);
        currentRow = {start: mid, end: Infinity};
      }
    }
    rows.push(currentRow);
    return rows;
  }

  /**
   * @param {HTMLElement} listElement
   * @param {string} movedTabId
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  findNewIndex(listElement, movedTabId, x, y) {
    const children = [...listElement.children];
    const childrenAndRects = children.map((child) => ({
      child,
      rect: child.getBoundingClientRect(),
    }));
    const otherChildren = childrenAndRects.filter(
      ({child}) => child.dataset.value !== movedTabId
    );
    const otherChildrenRects = otherChildren.map(({rect}) => rect);
    if (otherChildrenRects.length === 0) {
      if (this.debug) {
        console.log('index:', 0);
      }
      return 0;
    }

    const rows = this.computeRows(childrenAndRects.map(({rect}) => rect));
    const row = rows.find((row) => y < row.end);
    if (!row) {
      throw new Error('Bad logic');
    }

    let startIndex = otherChildrenRects.findIndex(
      (rect) => rect.top >= row.start
    );
    if (startIndex < 0) {
      startIndex = otherChildrenRects.length;
    }
    let endIndex = otherChildrenRects.findIndex((rect) => rect.top > row.end);
    if (endIndex < 0) {
      endIndex = otherChildrenRects.length;
    }

    const rowRects = otherChildrenRects.slice(startIndex, endIndex);
    let colIndex = rowRects.findIndex(
      (rect) => x < (rect.left + rect.right) / 2
    );
    if (colIndex < 0) {
      colIndex = rowRects.length;
    }

    return startIndex + colIndex;
  }

  /**
   * @param {DragEvent} event
   */
  handleDragEnter = (event) => {
    if (this.getMovedGroup(event) !== this.props.dragGroup) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * @param {DragEvent} event
   */
  handleDragOver = (event) => {
    if (this.getMovedGroup(event) !== this.props.dragGroup) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = 'move';

    const movedTabId = this.getMovedTabId(event);
    const movedWidth = this.getMovedWidth(event);
    const movedDiff = this.getMovedDiff(event);

    let dx = 0;
    if (this.lastClientX !== undefined) {
      dx = event.clientX - this.lastClientX;
    }
    if (dx === 0) {
      dx = this.lastDx || 0;
    } else {
      this.lastDx = dx;
    }
    this.lastClientX = event.clientX;

    let movedX = event.clientX + movedDiff;
    if (dx > 0) {
      movedX = event.clientX + movedDiff + movedWidth / 3;
    } else if (dx < 0) {
      movedX = event.clientX + movedDiff - movedWidth / 3;
    }
    const movedY = event.clientY;

    if (this.debug) {
      this.addDebugV(movedX, movedY, 'rgba(0,200,0,0.4)', 0.2);
    }

    const newIndex = this.findNewIndex(
      event.currentTarget,
      movedTabId,
      movedX,
      movedY
    );

    const oldIndex = this.state.dropElement ? this.state.dropElementOrder : -1;

    if (newIndex !== oldIndex) {
      this.setState({
        dropElement: true,
        dropElementId: movedTabId,
        dropElementOrder: newIndex,
        dropElementWidth: movedWidth,
      });
    }

    this.newIndex = newIndex;
  };

  handleDragLeave = (event) => {
    if (this.getMovedGroup(event) !== this.props.dragGroup) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!event.currentTarget.contains(event.relatedTarget)) {
      if (this.debug) {
        console.log('drag leave:', event);
      }

      this.setState({
        dropElement: false,
      });
    }
  };

  handleDrop = (event) => {
    event.preventDefault();

    const movedTabId = this.getMovedTabId(event);

    const listElement = event.currentTarget;
    const children = [...listElement.children].filter(
      (child) => !child.className.includes('drop-element')
    );

    const newIndex = this.newIndex;
    const oldIndex = children.findIndex(
      (child) => child.dataset.value === movedTabId
    );
    if (newIndex !== oldIndex) {
      if (this.debug) {
        console.log('drop index:', newIndex);
      }
      this.props.onTabMove?.(movedTabId, newIndex);
    } else {
      if (this.debug) {
        console.log('drop canceled');
      }
      this.setState({dropElement: false});
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps && this.state.dropElement) {
      this.setState({dropElement: false});
    }
  }

  render() {
    const {
      currentTab,
      onTabClick,
      onTabDrop,
      onTabMove,
      dragGroup,
      children,
      ...props
    } = this.props;
    const className = this.props.className || '';
    const childrenArray = React.Children.toArray(
      children?.toJS?.() || children
    );
    if (this.state.dropElement) {
      let draggedIndex = childrenArray.findIndex(
        (child) => child?.props.value === this.state.dropElementId
      );
      const dropElementIndex =
        draggedIndex >= 0 && this.state.dropElementOrder > draggedIndex
          ? this.state.dropElementOrder + 1
          : this.state.dropElementOrder;
      childrenArray.splice(
        dropElementIndex,
        0,
        <div
          key="drop-element"
          className="drop-element"
          value={this.state.dropElementId}
          data-value={this.state.dropElementId}
          style={{width: this.state.dropElementWidth}}
        ></div>
      );
    }
    return (
      <div
        {...props}
        className={this.styles.classNames.tabs + ' ' + className}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {childrenArray.map((child) => {
          if (!child) {
            return child;
          }
          const value = child.props.value;
          const dragged =
            this.state.dropElement &&
            !child.props.className?.includes('drop-element') &&
            child.props.value === this.state.dropElementId;
          return React.cloneElement(child, {
            'onClick': (event) =>
              (child.props.onClick || this.handleTabClick)(value, event),
            'data-active': currentTab === value,
            'data-dragged': dragged,
            'draggable': Boolean(dragGroup),
            'onDragStart': (e) => this.handleDragStart(e, value),
            'onDragEnd': this.handleDragEnd,
          });
        })}
      </div>
    );
  }
}

TabLayout.Tabs = withC(TabLayoutTabs);

export default TabLayout;

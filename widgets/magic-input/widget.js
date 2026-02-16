import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import wrapRawInput from 'goblin-gadgets/widgets/input-wrapper/widget.js';
import MagicEmojiPickerNC from '../magic-emoji-picker/widget.js';
import MagicDialog from '../magic-dialog/widget.js';
import Icon from '@mdi/react';
import {mdiCat} from '@mdi/js';
import Mousetrap from 'mousetrap';

function focusInput(element) {
  if (element.contentEditable === 'plaintext-only') {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    element.focus();
  }
}

/**
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
function findParentContainer(element) {
  for (let e = element.parentElement; e; e = e.parentElement) {
    if (e.tagName === 'DIALOG') {
      return e;
    }
  }
  if (element.offsetParent) {
    return element.offsetParent;
  }
  return document;
}

/**
 * @param {HTMLElement} element
 * @returns {HTMLElement | null}
 */
function findNextInput(element) {
  const parent = findParentContainer(element);
  const inputs = parent.querySelectorAll('input, div[contenteditable].input');
  const inputsList = [...inputs];
  const index = inputsList.indexOf(element);
  const nextIndex = index + 1;

  if (nextIndex < inputsList.length) {
    return inputs[nextIndex];
  }
  return null;
}

function getEventValue(event) {
  return event?.target ? event.target.value : event;
}

/**
 * @param {Range} range
 * @returns {number}
 */
function computeRangeLength(range) {
  const div = document.createElement('div');
  div.appendChild(range.cloneContents());
  let length = 0;
  for (const node of div.childNodes) {
    if (node instanceof Text) {
      length += node.textContent.length;
    } else if (node.tagName === 'BR') {
      length += 1;
    }
  }
  return length;
}

/**
 * @param {HTMLElement} element
 * @param {number} position
 * @returns {{node: Node, offset: number}}
 */
function computeNodeAndOffset(element, position) {
  for (const node of element.childNodes) {
    if (node instanceof Text) {
      const nodeLength = node.textContent.length;
      if (position - nodeLength < 1) {
        return {node, offset: position};
      }
      position -= nodeLength;
    } else if (node.tagName === 'BR') {
      if (position < 1) {
        break;
      }
      position -= 1;
    }
  }
  return null;
}

class EditableDiv extends Widget {
  constructor() {
    super(...arguments);
    this.element = React.createRef();
  }

  get selectionStart() {
    const element = this.element.current;
    const range = window.getSelection().getRangeAt(0).cloneRange();
    const {startContainer, startOffset} = range;
    range.setStart(element, 0);
    range.setEnd(startContainer, startOffset);
    const position = computeRangeLength(range);
    return position;
  }

  get selectionEnd() {
    const element = this.element.current;
    const range = window.getSelection().getRangeAt(0).cloneRange();
    range.setStart(element, 0);
    const position = computeRangeLength(range);
    return position;
  }

  setSelectionRange(start, end) {
    const element = this.element.current;
    const range = document.createRange();
    range.selectNode(this.element.current);
    const startPos = computeNodeAndOffset(element, start);
    if (startPos) {
      range.setStart(startPos.node, startPos.offset);
    }
    const endPos = computeNodeAndOffset(element, end);
    if (endPos) {
      range.setEnd(endPos.node, endPos.offset);
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  focus() {
    this.element.current.focus();
  }

  blur() {
    this.element.current.blur();
  }

  handleBlur = (e) => {
    if (this.props.onBlur) {
      const value = e.target.innerText;
      this.props.onBlur(value);
    }
  };

  handleInput = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.innerText);
    }
  };

  currentValue() {
    const {value} = this.props;
    if (value === undefined || value === null) {
      return '';
    }
    return value;
  }

  componentDidUpdate() {
    const div = this.element.current;
    const value = this.currentValue();
    if (div.innerText !== value) {
      div.innerText = value;
    }
  }

  componentDidMount() {
    this.element.current.innerText = this.currentValue();
  }

  render() {
    const {autoRows, value, onChange, disabled, ...props} = this.props;
    const otherProps = {};
    if (!disabled) {
      otherProps.contentEditable = 'plaintext-only';
    } else {
      otherProps['data-disabled'] = true;
    }
    return (
      <div
        {...props}
        ref={this.element}
        {...otherProps}
        suppressContentEditableWarning={true}
        onInput={this.handleInput}
        onBlur={this.handleBlur}
      />
    );
  }
}

class MagicInputNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.htmlInputRef = React.createRef();
    this.state = {
      showPicker: false,
    };
  }

  get htmlInput() {
    return this.htmlInputRef.current;
  }

  changeAndSelect(value, selectionStart, selectionEnd) {
    this.props.onChange(value, () => {
      // After state changed.
      this.htmlInput?.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  onFocus = (event) => {
    if (this.props.onFocus) {
      const value = this.props.autoRows ? event : getEventValue(event);
      this.props.onFocus(value);
    }
    if (this.props.selectAllOnFocus) {
      this.htmlInput?.select();
    }
    Mousetrap.bind('ctrl+space', this.pick);
  };

  onBlur = (event) => {
    if (this.props.onBlur) {
      const value = this.props.autoRows ? event : getEventValue(event);
      this.props.onBlur(value);
    }
    Mousetrap.unbind('ctrl+space');
  };

  onChange = (event) => {
    if (this.props.onChange) {
      const value = this.props.autoRows ? event : getEventValue(event);
      this.props.onChange(value);
    }
  };

  handleKeyDown = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      if (this.props.onEnterKey) {
        const value = this.props.autoRows
          ? event.target.innerText
          : event.target.value;
        this.props.onEnterKey(value);
      }
      if (this.props.onValidate) {
        const value = this.props.autoRows
          ? event.target.innerText
          : event.target.value;
        this.props.onValidate(value);
      }
    }
    this.props.onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (!event.shiftKey && event.key === 'Enter') {
      if (!this.props.autoRows && !this.props.rows) {
        this.htmlInput.blur();
      }

      const nextInput = findNextInput(this.htmlInput);
      if (nextInput) {
        if (!this.props.autoRows && !this.props.rows) {
          event.preventDefault();
          focusInput(nextInput);
        }
        event.stopPropagation();
      }
    }
  };

  componentDidMount() {
    if (this.props.autoFocus) {
      this.htmlInput?.setAttribute?.('autofocus', true);
    }
  }

  insertEmoji = (emoji) => {
    const value = this.props.value;
    return (
      value.slice(0, this.currentSelection.start) +
      emoji +
      value.slice(this.currentSelection.end)
    );
  };

  pick = () => {
    this.currentSelection = {
      start: this.htmlInput.selectionStart,
      end: this.htmlInput.selectionEnd,
    };
    this.setState({showPicker: true});
  };

  hide = () => {
    this.setState({showPicker: false});
  };

  onSelectEmoji = (emoji) => {
    this.hide();

    this.htmlInput.focus();

    const newValue = this.insertEmoji(emoji);
    this.props.onChange?.(newValue);

    const newPosition = this.currentSelection.start + emoji.length;
    this.htmlInput.setSelectionRange(newPosition, newPosition);
  };

  render() {
    const {
      autoRows,
      onEnterKey,
      onValidate,
      className = '',
      emojiPicker,
      selectAllOnFocus,
      ...props
    } = this.props;
    let Component = 'input';
    if (this.props.rows) {
      Component = 'textarea';
    }
    if (this.props.autoRows) {
      Component = EditableDiv;
    }

    if (this.props.emojiPicker && !this.props.disabled) {
      return (
        <>
          <div className={this.styles.classNames.withEmoji + ' ' + className}>
            <Component
              {...props}
              className={'input mousetrap'}
              ref={this.htmlInputRef}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
              onKeyDown={this.handleKeyDown}
            />
            <div
              className="pickerButton"
              onClick={this.pick}
              title="Insérer un émoji (Ctrl+Espace)"
            >
              <Icon path={mdiCat} size={1} />
            </div>
          </div>
          {this.state.showPicker ? (
            <MagicDialog modal={true} open onClose={this.hide}>
              <MagicEmojiPickerNC
                onEmojiSelect={(emoji) => this.onSelectEmoji(emoji.native)}
              />
            </MagicDialog>
          ) : null}
        </>
      );
    }

    return (
      <Component
        {...props}
        className={'input' + ' ' + className}
        ref={this.htmlInputRef}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}

const MagicInput = wrapRawInput(
  ({forwardedRef, ...props}) => <MagicInputNC ref={forwardedRef} {...props} />,
  'value',
  true
);

export default MagicInput;

import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicInput from '../magic-input/widget.js';

let inputCount = 0;

class MagicTextFieldNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.listId = `input-data-${inputCount++}`;
  }

  renderDataList() {
    if (!this.props.dataList) {
      return;
    }
    return (
      <datalist id={this.listId}>
        {this.props.dataList.map((value) => (
          <option key={value} value={value} />
        ))}
      </datalist>
    );
  }

  render() {
    const {className = ''} = this.props;
    return (
      <>
        <MagicInput
          ref={this.props.inputRef}
          className={this.styles.classNames.inputEdit + ' ' + className}
          value={this.props.value}
          onBlur={this.disableEdit}
          onEnterKey={this.props.onEnterKey}
          onKeyDown={this.props.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          placeholder={this.props.placeholder}
          changeMode={this.props.changeMode || 'blur'}
          parse={this.props.parse}
          format={this.props.format}
          onChange={this.props.onChange}
          onValidate={this.props.onValidate}
          type={this.props.type}
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          autoFocus={this.props.autoFocus}
          selectAllOnFocus={this.props.selectAllOnFocus}
          rows={this.props.rows}
          autoRows={this.props.autoRows}
          disabled={this.props.disabled}
          emojiPicker={this.props.emojiPicker}
          list={this.props.dataList ? this.listId : undefined}
        />
        {this.renderDataList()}
      </>
    );
  }
}
const MagicTextField = withC(MagicTextFieldNC, {value: 'onChange'});
MagicTextField.displayName = 'MagicTextField';
export default MagicTextField;

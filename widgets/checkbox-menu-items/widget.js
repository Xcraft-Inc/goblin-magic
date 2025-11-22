import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {
  mdiCheckboxBlankOutline,
  mdiCheckboxIntermediateVariant,
  mdiCheckboxMarked,
} from '@mdi/js';
import MagicCheckbox from '../magic-checkbox/widget.js';
import Menu from '../menu/widget.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';

class CheckboxMenuItemsNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  toggle = (value) => {
    const {checkedValues} = this.props;
    if (!checkedValues) {
      this.props.onChange(this.values.filter((v) => v !== value));
    } else if (checkedValues.includes(value)) {
      this.props.onChange([...checkedValues].filter((v) => v !== value));
    } else {
      this.props.onChange([...checkedValues, value]);
    }
  };

  set = (value, event) => {
    const {checkedValues} = this.props;
    if (event.ctrlKey) {
      this.toggle(value);
    } else if (checkedValues?.length === 1 && checkedValues.includes(value)) {
      this.all();
    } else {
      this.props.onChange([value]);
    }
    event.preventDefault();
  };

  all = () => {
    this.props.onChange(null);
  };

  empty = () => {
    this.props.onChange([]);
  };

  invert = () => {
    const {checkedValues} = this.props;
    if (checkedValues) {
      if (checkedValues.length === 0) {
        this.all();
      } else {
        this.props.onChange(
          this.values.filter((value) => !checkedValues.includes(value))
        );
      }
    } else {
      this.empty();
    }
  };

  renderItem(value, text) {
    const {checkedValues} = this.props;
    return (
      <div key={value} className={this.styles.classNames.item}>
        <MagicCheckbox
          value={!checkedValues || checkedValues.includes(value)}
          onChange={() => this.toggle(value)}
          // disabled
        />
        <Menu.Item onPointerUp={(event) => this.set(value, event)}>
          {typeof text === 'string' ? <span>{text}</span> : text}
        </Menu.Item>
      </div>
    );
  }

  render() {
    const {values, checkedValues, renderValue, children} = this.props;
    this.values = values ? [...values] : [];
    const renderedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const {value, children} = child.props;
        this.values.push(value);
        return this.renderItem(value, children);
      }
      return child;
    });
    return (
      <>
        <div className={this.styles.classNames.items}>
          {values?.map((value) => this.renderItem(value, renderValue(value)))}
          {renderedChildren}
        </div>
        <Menu.Hr className={this.styles.classNames.hr} />
        <div className={this.styles.classNames.buttons}>
          <MagicButton simple onPointerUp={this.all}>
            <Icon path={mdiCheckboxMarked} size="1.2em" />
            Tout
          </MagicButton>
          <MagicButton simple onPointerUp={this.empty}>
            <Icon path={mdiCheckboxBlankOutline} size="1.2em" />
            Aucun
          </MagicButton>
          <MagicButton simple onPointerUp={this.invert}>
            <Icon path={mdiCheckboxIntermediateVariant} size="1.2em" />
            Inverser
          </MagicButton>
        </div>
      </>
    );
  }
}

const CheckboxMenuItems = withC(CheckboxMenuItemsNC);

export default CheckboxMenuItems;

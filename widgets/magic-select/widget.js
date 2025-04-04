import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Menu from '../menu/widget.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';
import C from 'goblin-laboratory/widgets/connect-helpers/c.js';

const SelectContext = React.createContext();

function examples() {
  <MagicSelect value={C('.type')}>
    <option value="external">External</option>
    <option value="internal">Internal</option>
    <option value="personal">Personal</option>
  </MagicSelect>;

  <MagicSelect
    value={C('.type')}
    options={{
      external: <>External</>,
      internal: <>Internal</>,
      personal: <>Personal</>,
    }}
  />;

  <MagicSelect
    value={C('.type')}
    options={[
      {value: 'external', text: <>External</>},
      {value: 'internal', text: <>Internal</>},
      {value: 'personal', text: <>Personal</>},
    ]}
  />;
}

class MagicSelectOption extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {value, children} = this.props;
    return (
      <SelectContext.Consumer>
        {(select) => (
          <Menu.Item value={value} onPointerUp={select.setValue}>
            {children}
          </Menu.Item>
        )}
      </SelectContext.Consumer>
    );
  }
}

class MagicSelectNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  setValue = (event) => {
    const value = event.currentTarget.value;
    this.props.onChange?.(value, event);
  };

  render() {
    let {
      className = '',
      value,
      options,
      position,
      onChange,
      children,
      ...props
    } = this.props;

    let displayedValue = value;
    let list;
    if (options) {
      list = Array.isArray(options)
        ? options
        : Object.entries(options).map(([value, text]) => ({value, text}));

      displayedValue = list.find((item) => item.value === value)?.text || value;
    } else {
      children = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          return <MagicSelectOption {...child.props} />;
        }
        return child;
      });
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
          return;
        }
        if (child.type === MagicSelectOption && child.props.value === value) {
          displayedValue = child.props.children;
        }
      });
    }

    return (
      <SelectContext.Provider value={this}>
        <Menu>
          <Menu.Button {...props} className={'input no-grow ' + className}>
            {displayedValue}
            <FontAwesomeIcon
              className={this.styles.classNames.chevronDown}
              icon={faChevronDown}
            />
          </Menu.Button>
          <Menu.Content position={position}>
            {list &&
              list.map(({value, text}) => (
                <MagicSelectOption key={value} value={value}>
                  {text || value}
                </MagicSelectOption>
              ))}
            {children}
          </Menu.Content>
        </Menu>
      </SelectContext.Provider>
    );
  }
}

const MagicSelect = withC(MagicSelectNC, {value: 'onChange'});

MagicSelect.Option = MagicSelectOption;

export default MagicSelect;

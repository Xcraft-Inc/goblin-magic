import * as styles from './styles.js';
import React from 'react';
import throttle from 'lodash/throttle.js';
import Widget from 'goblin-laboratory/widgets/widget';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import {faSquare, faCheckSquare} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Shredder from 'xcraft-core-shredder';
import getModifiers from '../get-modifiers/get-modifiers.js';
import ErrorHandler from 'goblin-laboratory/widgets/error-handler/widget.js';
import Icon from '@mdi/react';
import {
  mdiChevronUp,
  mdiChevronDown,
  mdiMenuDown,
  mdiSetNone,
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
} from '@mdi/js';

function parseDate(value) {
  if (!value) {
    return '';
  }
  const [d, m, y] = value.split('.');
  const day = parseInt(d);
  const month = parseInt(m) - 1;
  if (y.length > 4) {
    const [year, time] = y.split(' ');
    const [h, m] = time.split(':');
    return new Date(parseInt(year), month, day, parseInt(h), parseInt(m));
  } else {
    const year = parseInt(y);
    return new Date(year, month, day);
  }
}

function parseString(value) {
  if (!value) {
    return '';
  }
  return value;
}

function defaultGetRowId(row) {
  if (Shredder.isShredder(row) || Shredder.isImmutable(row)) {
    if (row.has('id')) {
      return row.get('id');
    }
    throw new Error(
      "Unable to get the row id. Please define the 'getRowId' prop of <MagicTable>."
    );
  }
  if (typeof row === 'object' && row !== null) {
    if ('id' in row) {
      return row.id;
    }
    throw new Error(
      "Unable to get the row id. Please define the 'getRowId' prop of <MagicTable>."
    );
  }
  return row;
}

function defaultRenderRow(row, columns) {
  return columns.map((col, index) => (
    <React.Fragment key={index}>
      {col.renderItem ? col.renderItem(row) : <span>{row[col.id]}</span>}
    </React.Fragment>
  ));
}

const hr = Symbol('magic-table-hr');

class MagicTableRow extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.row = React.createRef();
    this.observer = null;
  }

  componentDidMount() {
    this.observer = new MutationObserver(() => {
      this.props.onUpdate();
    });
    this.observer.observe(this.row.current, {
      subtree: true,
      childList: true,
      characterData: true,
      attributeFilter: ['data-rowId'],
    });
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  handleClick = (event) => {
    this.props.onRowClick?.(this.props.row, event);
  };

  render() {
    const {
      index,
      renderRow = defaultRenderRow,
      row,
      onRowClick,
      columns,
      children,
      className = '',
      onUpdate,
      ...props
    } = this.props;
    return (
      <div
        {...props}
        onClick={this.handleClick}
        className={this.styles.classNames.magicTableRow + ' ' + className}
        data-clickable={Boolean(onRowClick)}
        data-rowid={index}
        ref={this.row}
      >
        {children || renderRow(row, columns, index)}
      </div>
    );
  }
}

class MagicTableRows extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  renderRow = (row, index) => {
    const {
      rows,
      columns,
      renderRow,
      getRowId,
      onRowClick,
      ...props
    } = this.props;
    if (row === hr) {
      return (
        <React.Fragment key={index}>
          {/* Empty row to keep the same style for :nth-child(2n) */}
          <div className={this.styles.classNames.emptyRow} />
          <div className={this.styles.classNames.rowSeparator} />
        </React.Fragment>
      );
    }
    const rowId = getRowId(row, index);
    const rowKey = rowId !== undefined ? rowId : index;
    return (
      <MagicTableRow
        {...props}
        key={rowKey}
        index={index}
        renderRow={renderRow}
        row={row}
        onRowClick={onRowClick}
        columns={columns}
      />
    );
  };

  render() {
    const {rows} = this.props;
    return (
      <ErrorHandler>
        {rows.map((row, index) => this.renderRow(row, index))}
      </ErrorHandler>
    );
  }
}

class MagicTableContainer extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.table = React.createRef();
  }

  getColumnSet = (colIndex) => {
    const table = this.table.current;
    if (!table) {
      return [];
    }
    const rows = Array.from(table.children);

    return Array.from(
      new Set(
        rows
          .filter((el) => el.getAttribute('data-rowId') !== null)
          .map((el) => el.childNodes[colIndex]?.textContent || 'vide')
      ).values()
    );
  };

  sort = (colIndex, type, sortOrder, sortCustom) => {
    const table = this.table.current;
    if (!table) {
      console.warn('sort not ready');
      setTimeout(this.sort, 50);
      return;
    }
    const rows = Array.from(table.children);
    if (sortOrder === '-') {
      rows
        .filter((el) => el.getAttribute('data-rowId') !== null)
        .sort((a, b) => {
          let valueA = a.getAttribute('data-rowId');
          let valueB = b.getAttribute('data-rowId');
          return valueA - valueB;
        })
        .forEach((el) => {
          table.append(el);
        });
      return;
    }
    rows
      .filter((el) => el.getAttribute('data-rowId') !== null)
      .sort((a, b) => {
        let valueA = a.childNodes[colIndex]?.textContent;
        let valueB = b.childNodes[colIndex]?.textContent;
        switch (type) {
          case 'date':
            valueA = parseDate(valueA);
            valueB = parseDate(valueB);
            break;
          case 'number':
          case 'money':
            valueA = parseInt(valueA);
            valueB = parseInt(valueB);
            break;
          case 'custom': {
            const res = sortCustom(
              a.childNodes[colIndex],
              b.childNodes[colIndex]
            );
            return sortOrder === 'asc' ? res : res * -1;
          }
          default: {
            valueA = parseString(valueA);
            valueB = parseString(valueB);
            const res = new Intl.Collator().compare(valueA, valueB);
            return sortOrder === 'asc' ? res : res * -1;
          }
        }
        if (valueA < valueB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      })
      .forEach((el) => {
        table.append(el);
      });
  };

  updateSort = (reason) => {
    const {sortable, sortIndex, sortType, sortOrder, sortCustom} = this.props;
    if (sortable) {
      this.sort(sortIndex, sortType, sortOrder, sortCustom);
      console.log('sort updated :', reason);
    }
  };

  componentDidMount() {
    super.componentDidMount();
    this.updateSort('table container mounted');
  }

  componentDidUpdate() {
    this.updateSort('table container updated');
  }

  render() {
    const {
      className = '',
      children,
      sortable,
      sortIndex,
      sortType,
      sortOrder,
      sortCustom,
      showMenu,
      dispatch,
      ...props
    } = this.props;

    return (
      <div
        {...props}
        className={this.styles.classNames.magicTable + ' ' + className}
        ref={this.table}
      >
        {children}
      </div>
    );
  }
}

class TableCheck extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {checked, onClick} = this.props;
    return (
      <div
        onClick={onClick}
        className={this.styles.classNames.tableCheck}
        data-checked={checked}
      >
        {checked ? (
          <FontAwesomeIcon icon={faCheckSquare} />
        ) : (
          <FontAwesomeIcon icon={faSquare} />
        )}
      </div>
    );
  }
}

let MagicTable = class extends Widget {
  selectedRows = new Map();

  constructor() {
    super(...arguments);
    this.styles = styles;
    this.container = React.createRef();
    this.state = {
      selection: [],
    };
    if (this.props.id) {
      this.dispatch({
        type: 'INITIALISE',
        id: this.props.id,
        columns: this.props.columns,
      });
    }
    this.onUpdate = throttle(this.onUpdate, 500);
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  handleRowClick = (row, event) => {
    const modifiers = getModifiers(event);
    if (
      this.props.selectable &&
      modifiers.ctrlKey &&
      !modifiers.altKey &&
      !modifiers.metaKey
    ) {
      this.toggleSelection(row, event);
    } else {
      this.props.onRowClick?.(row, event);
    }
  };

  setSelection(selection) {
    this.setState({
      selection,
    });
    this.props.onSelectionChange?.(selection);
  }

  toggleAll = (event) => {
    const currentSelection = this.props.selection ?? this.state.selection;
    if (currentSelection.length > 0) {
      this.setSelection([]);
    } else {
      this.setSelection([...this.props.data]);
    }
    event.stopPropagation();
  };

  toggleSelection = (row, event) => {
    const {getRowId = defaultGetRowId} = this.props;
    const currentSelection = this.props.selection ?? this.state.selection;
    const rowId = getRowId(row);
    const index = currentSelection.findIndex(
      (selectedRow) => getRowId(selectedRow) === rowId
    );
    if (index >= 0) {
      this.setSelection(currentSelection.toSpliced(index, 1));
    } else {
      this.setSelection([...currentSelection, row]);
    }
    event.stopPropagation();
  };

  onUpdate = (reason = 'onUpdate') => {
    if (this.container.current) {
      this.container.current.updateSort(reason);
    }
  };

  render() {
    let {
      data,
      columns,
      renderRow = defaultRenderRow,
      onRowClick = undefined,
      selectable = false,
      selection = this.state.selection,
      onSelectionChange,
      getRowId = defaultGetRowId,
      className = '',
      rowClassName = '',
      style = {},
      children,
      ...props
    } = this.props;

    let additionalRows;
    if (selectable) {
      const selectedRowIds = selection.map(getRowId);
      const rowIds = data.map(getRowId);
      additionalRows = selection.filter(
        (row) => !rowIds.includes(getRowId(row))
      );
      columns = [
        {
          title: (
            <div
              className={this.styles.classNames.selectionTitle}
              onClick={this.toggleAll}
            >
              <FontAwesomeIcon icon={faSquare} />
            </div>
          ),
        },
        ...columns,
      ];
      renderRow = ((_renderRow) => (row, ...args) => (
        <>
          <TableCheck
            checked={selectedRowIds.includes(getRowId(row))}
            onClick={(event) => this.toggleSelection(row, event)}
          />
          {_renderRow(row, ...args)}
        </>
      ))(renderRow);
    }

    let last = '1fr';
    const gridTemplateColumns = columns
      .map((col, idx) => {
        if (col.width) last = 'fit-content(100%)';
        return (
          col.width || (idx === columns.length - 1 ? last : 'fit-content(100%)')
        );
      })
      .join(' ');

    const hasClick = selectable || onRowClick;
    const sortable = columns.some((col) => col.sortable);

    const rows =
      additionalRows && additionalRows.length > 0
        ? [...additionalRows, hr, ...data]
        : data;

    return (
      <MagicTableContainer
        {...props}
        className={className}
        style={{gridTemplateColumns, ...style}}
        ref={this.container}
        sortable={sortable}
        sortIndex={this.props.sortIndex}
        sortType={this.props.sortType}
        sortOrder={this.props.sortOrder}
        sortCustom={this.props.sortCustom}
      >
        <div className={this.styles.classNames.tableHeader}>
          {columns.map((col, index) => {
            let sort = null;
            const useMenu = col.autoFilter;
            const isSorted =
              this.props.sortIndex === index && this.props.sortOrder !== '-';
            let sortIcon = null;
            if (isSorted) {
              if (this.props.sortOrder === 'asc') {
                sortIcon = mdiChevronDown;
              } else {
                sortIcon = mdiChevronUp;
              }
            }
            if (col.sortable) {
              sort = () => {
                if (useMenu) {
                  this.dispatch({
                    type: 'TOGGLE_MENU',
                    sortIndex: index,
                    sortType: col.type,
                    sortCustom: col.sortCustom,
                  });
                  return;
                }
                this.dispatch({
                  type: 'SORT_COLUMN',
                  sortIndex: index,
                  sortType: col.type,
                  sortCustom: col.sortCustom,
                });
              };
            }

            return (
              <div
                key={index}
                onClick={sort}
                className={col.sortable ? 'sortable' : ''}
                title={col.sortable ? 'Cliquer pour changer le tri' : null}
              >
                {useMenu ? (
                  <div>
                    {isSorted && !this.props.showMenu ? (
                      <Icon path={sortIcon} size="1em" />
                    ) : null}
                    <Icon path={mdiMenuDown} size="1.5em" />
                  </div>
                ) : isSorted ? (
                  <Icon className="icon" path={sortIcon} size="1em" />
                ) : null}
                <span className="text">{col.title}</span>
              </div>
            );
          })}
        </div>
        {this.props.showMenu ? (
          <div className={this.styles.classNames.tableOptions}>
            {columns.map((col, index) => {
              if (this.props.sortIndex !== index) {
                return <div key={index} className="none"></div>;
              }
              const sort = () => {
                this.dispatch({
                  type: 'SORT_COLUMN',
                  sortIndex: index,
                  sortType: col.type,
                  sortCustom: col.sortCustom,
                });
              };
              let sortIcon = null;

              if (this.props.sortOrder === 'asc') {
                sortIcon = mdiSortAlphabeticalAscending;
              } else if (this.props.sortOrder === 'desc') {
                sortIcon = mdiSortAlphabeticalDescending;
              } else {
                sortIcon = mdiSetNone;
              }

              return (
                <div key={index} className="menu">
                  <div>
                    <Icon path={sortIcon} size="1em" onClick={sort} />
                  </div>
                  <div>
                    <input
                      list="column-values"
                      id="column-values"
                      name="column-values"
                    />
                    <datalist id="column-values">
                      {this.container.current
                        ?.getColumnSet(index)
                        .map((v, i) => {
                          return <option key={i} value={v}></option>;
                        })}
                    </datalist>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <MagicTableRows
          rows={rows}
          columns={columns}
          renderRow={renderRow}
          getRowId={getRowId}
          className={rowClassName}
          onRowClick={hasClick ? this.handleRowClick : null}
          onUpdate={this.onUpdate}
        />
        {children}
      </MagicTableContainer>
    );
  }
};

MagicTable = Widget.connect((state, props) => {
  const tableState = state.get('widgets').get(props.id);
  if (!tableState) {
    return {};
  } else {
    return tableState.pick(
      'id',
      'sortIndex',
      'sortType',
      'sortOrder',
      'sortCustom',
      'showMenu'
    );
  }
})(MagicTable);

MagicTable = withC(MagicTable);
MagicTable.displayName = 'MagicTable';
MagicTable.Row = MagicTableRow;

export default MagicTable;

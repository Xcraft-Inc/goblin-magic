import Shredder from 'xcraft-core-shredder';
/******************************************************************************/

const initialState = new Shredder({
  id: null,
  sortIndex: null,
  sortType: null,
  sortOrder: '-',
  sortCustom: null,
  showMenu: false,
});

/******************************************************************************/

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'INITIALISE': {
      const {id, columns} = action;
      state = initialState;
      state = state.set('id', id);
      for (const [index, column] of columns.entries()) {
        if (column.sortable && column.sortOrder) {
          state = state.set('sortIndex', index);
          state = state.set('sortType', column.type);
          state = state.set('sortOrder', column.sortOrder);
          state = state.set('sortCustom', column.sortCustom);
        }
      }
      return state;
    }
    case 'TOGGLE_MENU': {
      const {sortIndex, sortType, sortCustom} = action;
      state = state.set('sortIndex', sortIndex);
      state = state.set('sortType', sortType);
      state = state.set('sortCustom', sortCustom);
      state = state.set('showMenu', !state.get('showMenu'));
      return state;
    }
    case 'SORT_COLUMN': {
      const {sortIndex, sortType, sortCustom} = action;
      const current = state.get('sortIndex');
      state = state.set('sortIndex', sortIndex);
      state = state.set('sortType', sortType);
      state = state.set('sortCustom', sortCustom);

      //set new asc sort for column
      if (current !== sortIndex) {
        state = state.set('sortOrder', 'asc');
        return state;
      }
      //cycle sort
      if (state.get('sortOrder') === '-') {
        state = state.set('sortOrder', 'asc');
      } else if (state.get('sortOrder') === 'asc') {
        state = state.set('sortOrder', 'desc');
      } else {
        state = state.set('sortOrder', '-');
      }
      return state;
    }
  }
  return state;
};

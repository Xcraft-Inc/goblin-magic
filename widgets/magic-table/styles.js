/******************************************************************************/

export default function styles() {
  const magicTable = {
    display: 'grid',
    overflow: 'auto',
    // 'grid-template-columns': '', // Defined in the widget
    zIndex: 0, // Ensure that 'z-index -1' in the content is not below the table
    position: 'relative', // To make z-index work
    paddingBottom: '1px', // Fix scrollbar visible even when there is enough space
    marginBottom: '-1px', // To compensate for the above padding
  };

  const row = {
    'display': 'grid',
    'grid-template-columns': 'subgrid',
    'grid-column': '1 / -1',
  };

  const tableHeader = {
    ...row,

    'position': 'sticky',
    'top': 0,

    'fontWeight': 'bold',

    '& > *': {
      'display': 'flex',
      'alignItems': 'flex-end',
      'justifyContent': 'space-between',
      'padding': '7px 5px 7px 10px',
      'backgroundColor': 'rgb(30,40,62)',
      '@media (prefers-color-scheme: light)': {
        backgroundColor: 'rgb(194,222,235)',
      },
      // background: 'linear-gradient(to right, rgb(36,49,77), rgb(31,39,57))',
      // backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },

    '& > .sortable': {
      'display': 'flex',
      'justifyContent': 'space-around',
      'cursor': 'pointer',
      'position': 'relative',
      ':hover': {
        'backgroundColor':
          'color-mix(in srgb, var(--accent-color) 20%, rgb(30,40,62))',
        '@media (prefers-color-scheme: light)': {
          backgroundColor:
            'color-mix(in srgb, var(--accent-color) 20%, rgb(194,222,235))',
        },
      },
      '& > .icon': {
        position: 'absolute',
        top: '-5px',
      },
      '& > .text': {
        width: '100%',
      },
    },

    '& > :first-child': {
      borderTopLeftRadius: '6px',
    },

    '& > :last-child': {
      borderTopRightRadius: '6px',
    },
  };

  const magicTableRow = {
    ...row,
    'zIndex': -1, // Because some elements (like svg, buttons and img) goes above sticky...

    '& > *': {
      padding: '7px 10px',
      borderTop:
        '1px solid color-mix(in srgb, var(--text-color), transparent 85%)',
      backgroundColor: 'rgba(255,255,255, 0.025)',
    },
    '&:last-child > *': {
      borderBottom:
        '1px solid color-mix(in srgb, var(--text-color), transparent 85%)',
    },

    '&:nth-child(2n+1) > *:not(dialog)': {
      backgroundColor: 'rgba(0, 0, 0, 0.025)',
    },

    '&[data-clickable=true]': {
      '& > *': {
        cursor: 'pointer',
      },
      ':hover > *:not(dialog)': {
        backgroundColor:
          'color-mix(in srgb, var(--accent-color), transparent 90%)',
      },
      ':active > *:not(dialog)': {
        backgroundColor:
          'color-mix(in srgb, var(--accent-color), transparent 85%)',
      },
    },

    '& > :first-child:last-child': {
      // Only one element in the row
      gridColumn: '1 / -1', // Span the whole line
    },
  };

  const emptyRow = {
    gridColumn: '1 / -1',
  };

  const rowSeparator = {
    'gridColumn': '1 / -1',
    '&:not(:last-child)': {
      marginBottom: '-1px',
      borderBottom: '2px dashed rgba(177,123,41,0.9)',
    },
  };

  const selectionTitle = {
    'cursor': 'pointer',
    '& > *': {
      opacity: 0.2,
    },
    ':hover > *': {
      opacity: 0.6,
    },
  };

  const tableCheck = {
    '& > *': {
      opacity: 0.2,
    },
    ':hover > *': {
      opacity: 0.6,
    },
    '&[data-checked=true] > *': {
      opacity: 0.7,
      color: 'rgb(255,177,60)',
      boxShadow: '0px 0px 3px rgb(255,153,0)',
    },
    '& + :nth-child(2):last-child': {
      // Only one element in the row after the checkbox
      gridColumn: '2 / -1', // Span the whole line
    },
  };

  const tableOptions = {
    ...row,

    '& > .menu': {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      backgroundColor: 'rgb(30,40,62)',
    },
  };

  return {
    magicTable,
    tableHeader,
    magicTableRow,
    emptyRow,
    rowSeparator,
    selectionTitle,
    tableCheck,
    tableOptions,
  };
}

/******************************************************************************/

/******************************************************************************/

export default function styles() {
  const smallCalendarGrid = {
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  };

  const row = {
    'display': 'grid',
    'grid-template-columns': '24px repeat(7, minmax(0, 1fr))',
  };

  const headerRow = {
    ...row,
    color: 'color-mix(in srgb, var(--text-color), transparent 50%)',
  };

  const dayHeader = {
    'padding': '0px 5px 6px 5px',
    // 'backgroundColor': 'color-mix(in srgb, var(--text-color), transparent 80%)',
    'textAlign': 'center',

    '&:first-child': {
      borderTopLeftRadius: '6px',
      padding: 0,
    },
    '&:last-child': {
      borderTopRightRadius: '6px',
    },
  };

  const weekRow = {
    ...row,
  };

  const weekNumber = {
    padding: '11px 2px',
    backgroundColor: 'color-mix(in srgb, var(--text-color), transparent 83%)',
    textAlign: 'center',
    color: 'color-mix(in srgb, var(--text-color), transparent 40%)',
  };

  const day = {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'border': '1px solid transparent',
    // 'backgroundColor': 'rgba(255,255,255,0.08)',

    '&[data-selected=true]': {
      borderRadius: '5px',
      backgroundColor:
        'color-mix(in srgb, var(--accent-color), transparent 70%)',
      borderColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 40%)',
    },

    '&[data-out-of-range=true]': {
      'backgroundColor': 'rgba(0,0,0,0.08)',
      '& > *': {
        opacity: 0.8,
      },
    },

    '&[data-enable-selection=true]': {
      'cursor': 'pointer',
      '&:hover': {
        borderRadius: '5px',
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 65%)',
        borderColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 10%)',
      },
    },
  };

  const dayNumber = {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'width': '33px',
    'height': '33px',
    'margin': '3px',
    'borderRadius': '50%',

    '[data-today=true] > &': {
      backgroundColor: 'color-mix(in srgb, var(--text-color), transparent 90%)',
    },
  };

  return {
    smallCalendarGrid,
    headerRow,
    dayHeader,
    weekRow,
    weekNumber,
    day,
    dayNumber,
  };
}

/******************************************************************************/

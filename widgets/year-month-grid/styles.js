export default function styles() {
  const yearMonthGrid = {
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    padding: '5px',
  };

  const yearHeader = {
    color: 'color-mix(in srgb, var(--text-color), transparent 50%)',
    paddingLeft: '3px',
  };

  const monthsGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  };

  const month = {
    'display': 'flex',
    'alignItems': 'center',
    'border': '1px solid transparent',
    'minHeight': '33px',
    'padding': '0 3px',

    '&[data-today=true]': {
      borderColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 80%)',
    },

    '&[data-selected=true]': {
      borderRadius: '5px',
      backgroundColor:
        'color-mix(in srgb, var(--accent-color), transparent 70%)',
      borderColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 40%)',
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

  return {
    yearMonthGrid,
    yearHeader,
    monthsGrid,
    month,
  };
}

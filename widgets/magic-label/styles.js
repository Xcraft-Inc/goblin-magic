export default function styles() {
  const label = {
    'display': 'flex',
    'flexDirection': 'row',
    'alignItems': 'baseline',
    'marginTop': '8px',

    '& > .input': {
      '&:not(.no-grow)': {
        flexGrow: 1,
        width: 'unset',
      },
      'margin': '0 0 0 6px',
    },
  };

  return {
    label,
  };
}

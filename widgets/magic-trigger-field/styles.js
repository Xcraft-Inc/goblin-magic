export default function styles() {
  const triggerField = {
    'display': 'inline-flex',
    'flexDirection': 'row',
    'gap': '3px',
    'flexWrap': 'wrap',

    '& > .triggerInterval': {
      display: 'inline-flex',
      flexDirection: 'row',
      gap: '3px',
    },
  };

  return {
    triggerField,
  };
}

export default function styles() {
  const tabLayout = {
    'display': 'flex',
    'flexDirection': 'column',
    'minWidth': 0, // allow to shrink

    '& > *+*': {
      flexGrow: 1,
      minHeight: 0, // allow to shrink
    },
  };

  const tabs = {
    '& > *': {
      'color': 'inherit',
      'fontSize': 'inherit',
      'cursor': 'pointer',

      '&[data-active=true]': {},

      ':hover': {},

      ':active': {},
    },

    '& > .drop-hover': {
      position: 'relative',
      borderLeft:
        '4px solid color-mix(in srgb, var(--text-color), transparent 40%)',
      paddingLeft: '8px',
      marginLeft: '12px',
      transition: 'all 0.2s ease',
      boxShadow: 'inset 4px 0 8px rgba(0, 0, 0, 0.3)',
    },
  };

  return {
    tabLayout,
    tabs,
  };
}

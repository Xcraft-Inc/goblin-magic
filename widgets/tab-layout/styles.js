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

    '& > .drop-left': {
      willChange: 'box-shadow',
      position: 'relative',
      transition: 'box-shadow 0.2s ease',
      boxShadow:
        'inset 4px 0 0 color-mix(in srgb, var(--text-color), transparent 40%)',
    },

    '& > .drop-right': {
      willChange: 'box-shadow',
      position: 'relative',
      transition: 'box-shadow 0.2s ease',
      boxShadow:
        'inset -4px 0 0 color-mix(in srgb, var(--text-color), transparent 40%)',
    },
  };

  return {
    tabLayout,
    tabs,
  };
}

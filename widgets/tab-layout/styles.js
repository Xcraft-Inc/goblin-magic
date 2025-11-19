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

      '&[data-dragged=true]': {
        display: 'none',
      },
    },
  };

  return {
    tabLayout,
    tabs,
  };
}

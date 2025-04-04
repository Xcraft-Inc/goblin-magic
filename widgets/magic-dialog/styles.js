export default function styles() {
  const dialog = {
    'border': 'none',
    'backgroundColor': 'transparent',
    'padding': '0',
    'maxHeight': '100%',
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'margin': 'auto',
    'overflow': 'visible',

    '&::backdrop': {
      backgroundColor: 'rgba(0,0,0,0.3)',
    },

    '&[data-modal=false]': {
      boxShadow:
        'rgba(0, 0, 0, 0.2) 0px 4px 120px, rgba(0, 0, 0, 0.1) 0px 4px 80px',
      borderRadius: '8px',
      // '&:not(:focus-within)': {
      //   'boxShadow': 'rgba(0, 0, 0, 0.2) 0px 4px 120px',
      //   '& :not(div)': {
      //     opacity: 0.7,
      //   },
      // },
    },

    '& > *': {
      maxHeight: '95vh',
    },
  };

  return {
    dialog,
  };
}

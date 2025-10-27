export default function styles() {
  const dialogButtons = {
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'flex-end',
    'gap': '10px',

    'outline': 'none',

    '& > button': {
      minWidth: '100px',
    },

    '& .main': {
      // 'backgroundColor': 'rgba(138,180,255,0.3)',
      // 'borderColor': 'rgba(164,194,255,0.8)',
      'backgroundColor':
        'color-mix(in srgb, color-mix(in srgb, var(--button-accent-color), white 20%), transparent 70%)',
      'borderColor':
        'color-mix(in srgb, color-mix(in srgb, var(--button-accent-color), var(--text-color) 35%), transparent 25%)',
      'boxShadow':
        '0px 0px 4px color-mix(in srgb, var(--button-accent-color), transparent 30%)',

      '&:hover': {
        // backgroundColor: 'rgba(138,180,255,0.4)',
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 50%)',
        borderColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 0%)',
      },

      '&:focus-visible': {
        boxShadow: '0px 0px 6px var(--button-accent-color)',
      },
    },

    '& > button.main:nth-last-child(2)': {
      // Ensure the main button is at the end when reverse is false
      order: 1,
    },

    '&[data-reverse=true]': {
      '& > button:nth-last-child(-n+3)': {
        // Set a default order value for the last two buttons
        order: 1,
      },

      '& > button.main:last-child': {
        // Move the main button before
        order: 0,
      },
    },
  };

  const dialogButtonsSpacing = {
    flexGrow: 1,
  };

  return {
    dialogButtons,
    dialogButtonsSpacing,
  };
}

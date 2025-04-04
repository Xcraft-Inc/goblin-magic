/******************************************************************************/

export default function styles() {
  const input = {
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'width': '24px',
    'height': '24px',
    'margin': '1px 0',
    'flexShrink': 0,
    'position': 'relative',
    // 'bottom': '1px',
    'top': '1px',
    'cursor': 'pointer',

    'appearance': 'none',
    'backgroundColor': 'color-mix(in srgb, var(--text-color), transparent 80%)',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 60%)',
    'borderRadius': '50%',

    '&::after': {
      content: "''",
      display: 'block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: 'rgba(15, 26, 54, 0.8)',
      opacity: 0,
    },

    '&:checked::after': {
      opacity: 1,
    },

    '&:focus-visible': {
      borderColor: 'var(--text-color)',
      boxShadow: '0px 0px 3px var(--text-color)',
      outline: 'none',
    },

    '&:focus': {
      outline: 'none',
    },

    '&:active': {
      transform: 'scale(0.9)',
    },

    '&:disabled': {
      'borderColor': 'transparent',
      'backgroundColor':
        'color-mix(in srgb, var(--text-color), transparent 90%)',
      '&:hover': {
        cursor: 'unset',
      },
    },
  };

  const radioLabel = {
    'display': 'flex',
    'alignItems': 'center',
    // 'alignItems': 'baseline',

    '&:hover input[type=radio]': {
      'backgroundColor':
        'color-mix(in srgb, var(--text-color), transparent 60%)',

      '&:disabled': {
        backgroundColor:
          'color-mix(in srgb, var(--text-color), transparent 90%)',
      },
    },
  };

  const text = {
    // 'display': 'flex',
    // 'alignItems': 'baseline',
    'marginLeft': '8px',
    '&:empty': {
      marginLeft: 0,
    },
  };

  return {
    radioLabel,
    input,
    text,
  };
}

/******************************************************************************/

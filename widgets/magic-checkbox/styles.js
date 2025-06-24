/******************************************************************************/

export default function styles() {
  const input = {
    'display': 'block',
    'width': '24px',
    'height': '24px',
    'verticalAlign': 'middle',
    'position': 'relative',
    'bottom': '1px',
    'cursor': 'pointer',

    'appearance': 'none',
    'backgroundColor':
      'color-mix(in srgb, var(--button-background-color), transparent 80%)',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 50%)',
    'borderRadius': '4px',

    '&[data-small=true]': {
      'borderColor': 'color-mix(in srgb, var(--text-color), transparent 70%)',
      'backgroundColor': 'rgba(0,0,0,0.2)',
      'width': '21px',
      'height': '21px',
      '&::after': {
        width: '4px',
        height: '8px',
        left: '7px',
        top: '4px',
      },
    },

    '&::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      width: '5px',
      height: '9px',
      border:
        '2px solid color-mix(in srgb, var(--text-color), transparent 10%)',
      borderTop: 'none',
      borderLeft: 'none',
      left: '8px',
      top: '4px',
      transform: 'rotate(43deg)',
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

    '&:active:not([data-locked=true])': {
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

  const checkboxLabel = {
    'display': 'flex',
    'alignItems': 'center',
    // 'width': '100%',
    // 'textTransform': 'uppercase',

    '&:hover input[type=checkbox]': {
      'backgroundColor':
        'color-mix(in srgb, var(--button-accent-color), transparent 60%)',
      'borderColor': 'var(--button-accent-color)',

      '&[data-small=true]': {
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 80%)',
      },

      '&:disabled': {
        backgroundColor:
          'color-mix(in srgb, var(--text-color), transparent 90%)',
        borderColor: 'transparent',
      },
    },
  };

  const text = {
    'display': 'flex',
    'marginLeft': '8px',

    '&:empty': {
      marginLeft: 0,
    },

    '&[data-locked=true]': {
      opacity: 0.4,
    },
  };

  return {
    checkboxLabel,
    input,
    text,
  };
}

/******************************************************************************/

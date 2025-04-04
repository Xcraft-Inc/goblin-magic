export default function styles() {
  const inputGroup = {
    'display': 'inline-flex',
    'flexDirection': 'row',
    'borderRadius': '5px',
    'backgroundColor':
      'color-mix(in srgb, var(--field-background-color), transparent 20%)',
    'outline':
      '1px solid color-mix(in srgb, var(--text-color), transparent 60%)',
    'outlineOffset': '-1px',

    '& > input': {
      backgroundColor: 'transparent',
      paddingRight: '2px',
      border: 'none',
    },

    '& > :nth-last-child(n + 2 of :not(dialog))': {
      'borderTopRightRadius': 0,
      'borderBottomRightRadius': 0,
      '&.button:not(:not(:disabled):hover)': {
        borderRightColor:
          'color-mix(in srgb, var(--text-color), transparent 70%)',
      },
    },

    '& > :nth-child(n + 2 of :not(dialog))': {
      'borderTopLeftRadius': 0,
      'borderBottomLeftRadius': 0,
      '&.button:not(:not(:disabled):hover)': {
        borderLeftColor:
          'color-mix(in srgb, var(--text-color), transparent 70%)',
      },
    },

    '& > :hover': {
      zIndex: 0, // Above other buttons in the group
    },

    '& > .button': {
      '&:not(:hover)': {
        borderColor: 'transparent',
      },

      '&:disabled': {
        'opacity': 1,
        '&:hover': {
          backgroundColor:
            'color-mix(in srgb, var(--button-background-color), transparent 80%)',
          borderColor: 'transparent',
        },
      },

      '&[data-simple=true]': {
        'borderLeft': 'none',
        'borderRight': 'none',
        'color': 'color-mix(in srgb, var(--text-color), transparent 60%)',
        '&:hover': {
          color: 'inherit',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
      },
    },

    '&:focus-within': {
      outlineColor: 'color-mix(in srgb, var(--text-color), transparent 40%)',
    },
  };

  return {
    inputGroup,
  };
}

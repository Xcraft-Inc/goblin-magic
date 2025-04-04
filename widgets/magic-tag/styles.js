/******************************************************************************/
export default function styles() {
  const tag = {
    'borderRadius': '10em',
    'padding': ' 0.4em 0.8em',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 70%)',
    'backgroundColor':
      'color-mix(in srgb, var(--field-background-color), transparent 20%)',

    '&[data-has-click=true]': {
      'cursor': 'pointer',
      ':hover': {
        opacity: '0.7',
      },
    },

    '&[disabled]': {
      'cursor': 'default',
      'opacity': 0.7,
      ':hover': {
        opacity: 0.7,
      },
    },
  };

  return {
    tag,
  };
}

/******************************************************************************/

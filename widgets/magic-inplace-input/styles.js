/******************************************************************************/

export default function styles() {
  const disabledStyle = {
    ':hover': {
      outline: 'none',
      backgroundColor: 'transparent',
    },
  };

  const inplaceInput = {
    'display': 'flex',
    'width': '100%',
    'minHeight': '1em', // For contenteditable
    'backgroundColor': 'transparent',
    'borderRadius': '5px',
    'border': 'none',
    'padding': '0',
    'marginTop': '0',
    'fontSize': 'inherit',
    'color': 'inherit',
    'resize': 'vertical',
    '::placeholder': {
      color: 'color-mix(in srgb, var(--text-color), transparent 75%)',
      fontWeight: 'bold',
    },
    ':hover': {
      outline:
        '1px solid color-mix(in srgb, var(--text-color), transparent 70%)',
      backgroundColor:
        'color-mix(in srgb, var(--field-background-color), transparent 20%)',
      marginLeft: '-0.3em',
      paddingLeft: '0.3em',
    },
    ':focus': {
      outline:
        '1px solid color-mix(in srgb, var(--text-color), transparent 70%)',
      backgroundColor:
        'color-mix(in srgb, var(--field-background-color), transparent 20%)',
      marginLeft: '-0.3em',
      paddingLeft: '0.3em',
    },
    '&::selection': {
      backgroundColor: 'rgba(0,170,255,0.55)',
    },
    '&[data-disabled=true]': disabledStyle,
    '&:disabled': disabledStyle,
  };

  return {
    inplaceInput,
  };
}

/******************************************************************************/

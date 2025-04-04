/******************************************************************************/

export default function styles() {
  const disabledStyle = {
    'backgroundColor': 'color-mix(in srgb, var(--text-color), transparent 95%)',
    'color': 'color-mix(in srgb, var(--text-color), transparent 30%)',
    '::placeholder': {
      color: 'color-mix(in srgb, var(--text-color), transparent 80%)',
    },
  };

  const colorPickerStyle = {
    width: '32px',
    height: '20px',
    padding: '0px 2px',
  };

  const inputEdit = {
    'display': 'block',
    // 'height': '40px',
    'width': '100%',
    // 'minHeight': '1em', // For contenteditable
    'backgroundColor':
      'color-mix(in srgb, var(--field-background-color), transparent 20%)',
    'borderRadius': '5px',
    'border': '1px solid transparent',
    'padding': '7px 10px',
    // 'fontSize': '14px',
    'fontSize': 'inherit',
    'fontWeight': 300,
    'color': 'var(--text-color)',
    'resize': 'vertical',
    '::placeholder': {
      color: 'color-mix(in srgb, var(--text-color), transparent 80%)',
      // textTransform: 'uppercase',
      fontWeight: 600,
    },
    ':focus': {
      outline: 'none',
      borderColor: 'color-mix(in srgb, var(--text-color), transparent 60%)',
      // backgroundColor: 'rgba(255,255,255,0.2)',
      fontWeight: 300,
    },
    '&[data-disabled=true]': disabledStyle,
    '&:disabled': disabledStyle,
    '&[type="color"]': colorPickerStyle,
    '&[contenteditable]': {
      minHeight: '54px', // 2 lines
      cursor: 'text',
    },
  };

  return {
    inputEdit,
  };
}

/******************************************************************************/

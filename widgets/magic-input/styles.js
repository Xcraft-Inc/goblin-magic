/******************************************************************************/

export default function styles() {
  const withEmoji = {
    '&[class]' /* increase specificity */: {
      'display': 'flex',
      'flexDirection': 'row',
      'alignItems': 'baseline',
      'paddingRight': 0,
      ':focus-within': {
        borderColor: 'color-mix(in srgb, var(--text-color), transparent 60%)',
      },
      ':hover': {
        '& .pickerButton': {
          'opacity': '20%',
          ':hover': {
            color: 'orange',
            opacity: '100%',
            cursor: 'pointer',
            filter: 'drop-shadow(0 0 2px rgb(0 0 0))',
          },
        },
      },
      '& .pickerButton': {
        'opacity': 0,
        'alignSelf': 'stretch',
        'padding': '0 5px',
        'display': 'flex',
        'flexDirection': 'row',
        'alignItems': 'center',
        '& > svg': {
          margin: '-5px 0',
        },
      },
      '& > .input': {
        'width': 'inherit',
        'backgroundColor': 'transparent',
        'border': 'none',
        'color': 'inherit',
        'fontSize': 'inherit',
        '&:focus, &:focus-visible': {
          outline: 'none',
          borderColor: 'transparent',
        },
      },
    },
  };

  return {
    withEmoji,
  };
}

/******************************************************************************/

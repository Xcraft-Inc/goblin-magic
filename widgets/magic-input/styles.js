/******************************************************************************/

export default function styles() {
  const withEmoji = {
    '&[class]' /* increase specificity */: {
      'display': 'flex',
      'flexDirection': 'row',
      'alignItems': 'baseline',
      ':focus-within': {
        borderColor: 'color-mix(in srgb, var(--text-color), transparent 60%)',
      },
      ':hover': {
        '& .pickerButton': {
          'display': 'block',
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
        'display': 'none',
        'marginLeft': '-24px',
        '& > svg': {
          margin: '-5px',
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

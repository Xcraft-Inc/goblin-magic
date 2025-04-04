/******************************************************************************/

export default function styles() {
  const timer = {
    'display': 'inline-flex',
    'flexDirection': 'row',
    'alignItems': 'center',

    '& .button': {
      'lineHeight': '10px',
      'minHeight': '25px',
      'minWidth': '24px',
      'fontSize': '24px',
      'overflow': 'hidden',
      '& > svg': {
        margin: '-6px',
      },
    },

    '& .text': {
      marginLeft: '7px',
    },
  };

  return {
    timer,
  };
}

/******************************************************************************/

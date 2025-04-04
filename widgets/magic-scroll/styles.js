export default function styles() {
  const scroll = {
    'padding': '20px',
    'overflow': 'auto',

    '& > h1:first-child': {
      marginTop: 0,
    },
    '& > h2:first-child': {
      marginTop: 0,
    },
    '& > h3:first-child': {
      marginTop: 0,
    },
  };

  return {
    scroll,
  };
}

/******************************************************************************/

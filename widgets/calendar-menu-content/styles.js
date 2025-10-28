/******************************************************************************/

export default function styles() {
  const calendarMenuContent = {
    padding: '5px',
    outline: 'none',
  };

  const clearButton = {
    '&[class]' /* increase specificity */: {
      minWidth: 'unset',
    },
  };

  const buttons = {
    marginTop: '5px',
  };

  return {
    calendarMenuContent,
    clearButton,
    buttons,
  };
}

/******************************************************************************/

export default function styles() {
  const yearMonthMenuContent = {
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
    yearMonthMenuContent,
    clearButton,
    buttons,
  };
}

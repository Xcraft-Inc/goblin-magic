export default function styles(theme) {
  const button = {
    '& > span': {
      fontSize: '140%',
      margin: '-4px',
    },
  };

  const content = {
    border: 'none',
  };

  return {button, content};
}

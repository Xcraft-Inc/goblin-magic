export default function styles() {
  const colorField = {
    // width: '120px',
  };

  const colorPreview = {
    'width': '21px',
    'height': '21px',
    'margin': '-4px',

    '& > input': {
      width: 0,
      height: 0,
      opacity: 0,
    },
  };

  return {
    colorField,
    colorPreview,
  };
}

export default function styles() {
  const numberField = {
    'flexGrow': 1,
    '&[class]' /* increase specificity */: {
      width: '90px',
    },
  };
  return {
    numberField,
  };
}

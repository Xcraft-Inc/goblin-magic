export default function styles() {
  const mainDetail = {
    '& > .layout-pane': {
      '& > *': {
        height: '100%',
      },
    },
  };

  const detail = {
    '&[class]' /* increase specificity */: {
      border: 'none',
      borderRadius: 0,
      background: 'transparent',
      backdropFilter: 'none',
      boxShadow: 'none',
    },
  };

  return {
    mainDetail,
    detail,
  };
}

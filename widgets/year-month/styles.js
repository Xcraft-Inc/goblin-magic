export default function styles() {
  const yearMonth = {};

  const top = {
    'display': 'flex',
    'flexDirection': 'row',
    'gap': '5px',
    'marginBottom': '5px',

    '& > *': {
      flexBasis: 0,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  };

  const today = {
    color: 'var(--text-color)',
  };

  const group = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0,
  };

  const arrow = {
    'zIndex': -1,
    'padding': '6px 0px 4px 0px',
    'margin': '0 -3px',
    ':not(:hover)': {
      opacity: 0.5,
    },
  };

  const datePart = {
    'fontSize': '18px',
    'padding': '4px 4px',
    '&[class][class]' /* increase specificity */: {
      opacity: 1,
    },
  };

  const years = {
    columnCount: 2,
    columnRule:
      '1px solid color-mix(in srgb, var(--text-color), transparent 75%)',
    columnGap: '10px',
  };

  return {
    yearMonth,
    top,
    today,
    group,
    arrow,
    datePart,
    years,
  };
}

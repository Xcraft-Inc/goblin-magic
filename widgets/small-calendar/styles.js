/******************************************************************************/

export default function styles() {
  const smallCalendar = {};

  const top = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '5px',
    marginBottom: '5px',
  };

  const today = {
    padding: 0,
    minWidth: '24px',
    minHeight: '24px',
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
    fontSize: '18px',
    padding: '4px 4px',
  };

  const monthMenu = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  };

  const bottom = {
    '&[class]' /* increase specificity */: {
      gap: '5px',
    },
  };

  const weekButton = {
    padding: '5px 4px 4px 4px',
  };

  return {
    smallCalendar,
    top,
    today,
    group,
    arrow,
    datePart,
    monthMenu,
    bottom,
    weekButton,
  };
}

/******************************************************************************/

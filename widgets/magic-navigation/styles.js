export default function styles() {
  const panels = {
    'width': '100%',
    'height': '100%',
    'minHeight': 0, // allow to shrink
    'minWidth': 0, // allow to shrink
    'display': 'flex',
    'flexDirection': 'row',

    '& > *': {
      flexGrow: 1,
    },

    '& .layout-pane': {
      'display': 'flex',
      'flexDirection': 'row',
      '& > *': {
        flexGrow: 1,
      },
    },
  };

  const panel = {
    outline: 'none',
  };

  const panelTop = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const tabName = {
    'display': 'flex',
    'whiteSpace': 'nowrap',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
    'position': 'relative',
    'minHeight': '1.4em',
    '& > svg': {
      minWidth: '1.3em',
    },
    '& > span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  };

  const closeButton = {
    'display': 'flex',
    'justifyContent': 'center',
    'width': '19px',
    'height': '20px',
    'flexShrink': 0,
    'marginLeft': '8px',
    'borderRadius': '3px',
    'opacity': 0.6,

    ':hover': {
      opacity: 0.9,
      backgroundColor: 'color-mix(in srgb, var(--text-color), transparent 80%)',
    },

    ':active': {
      opacity: 0.6,
    },
  };

  const tabMenuButton = {
    'fontSize': '14px',
    // 'marginLeft': '10px',
    'padding': '5px',
    'margin': '-5px -5px -5px 5px',
    'opacity': 0.3,
    ':hover': {
      opacity: 0.8,
    },
  };

  const view = {
    'display': 'flex',
    'flexDirection': 'column',
    '& > *': {
      flexGrow: 1,
      minHeight: 0, // allow to shrink
    },

    '&[data-visible=false]': {
      display: 'none',
      // contentVisibility: 'hidden', // TODO try to use 'content-visibility' instead of 'display'
    },
  };

  return {
    panels,
    panel,
    panelTop,
    tabName,
    closeButton,
    tabMenuButton,
    view,
  };
}

export default function styles() {
  const splitter = {
    'position': 'relative',
    'display': 'flex',
    'flexDirection': 'row',
    'width': '100%',
    'height': '100%',
    'overflow': 'hidden',

    '&.splitter-layout > .layout-splitter': {
      'backgroundColor': 'unset',
      'transition': 'all 400ms ease-out',
      ':hover': {
        backgroundColor:
          'color-mix(in srgb, var(--text-color), transparent 78%)',
      },
    },

    '&.splitter-layout:not(.splitter-layout-vertical) > .layout-splitter': {
      // 'width': '6px',
      // borderLeft: '1px dashed rgba(209, 213, 219, 0.3)',
      // borderRight: '1px dashed rgba(209, 213, 219, 0.3)',
      'width': '5px',
      'position': 'relative',
      '&::after': {
        content: "''",
        position: 'absolute',
        borderRight:
          '1px dashed color-mix(in srgb, var(--text-color), transparent 78%)',
        width: '2px',
        height: '100%',
      },
    },

    '&.splitter-layout-vertical > .layout-splitter': {
      // 'height': '6px',
      // borderBottom: '1px dashed rgba(209, 213, 219, 0.3)',
      // borderTop: '1px dashed rgba(209, 213, 219, 0.3)',
      'height': '5px',
      'position': 'relative',
      '&::after': {
        content: "''",
        position: 'absolute',
        borderBottom:
          '1px dashed color-mix(in srgb, var(--text-color), transparent 78%)',
        width: '100%',
        height: '2px',
      },
    },
  };

  return {
    splitter,
  };
}

/******************************************************************************/

export default function styles() {
  const menuItem = {
    'width': '100%',
    'backgroundColor': 'transparent',
    'border': 'none',
    'borderRadius': '2px',
    'display': 'flex',
    'flexDirection': 'row',
    'alignItems': 'center',
    'textAlign': 'left',
    'padding': '6px 8px',
    'color': 'var(--text-color)',
    'fontSize': '14px',
    'outline': '1px solid transparent',
    '&:not(:disabled):hover': {
      // outlineColor: 'color-mix(in srgb, var(--text-color), transparent 30%)',
      // backgroundColor: 'color-mix(in srgb, var(--text-color), transparent 90%)',
      backgroundColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 80%)',
      outlineColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 20%)',
    },
    '&:disabled': {
      color: 'rgb(170,170,170)',
    },

    '&:focus-visible': {
      boxShadow: '0px 0px 3px var(--text-color)',
      outlineColor: 'color-mix(in srgb, var(--text-color), transparent 20%)',
    },

    '& > :first-child:not(:last-child)': {
      marginRight: '6px',
      minWidth: '18px',
    },
  };

  const menuItemRight = {
    'flexGrow': 1,
    'display': 'flex',
    'justifyContent': 'flex-end',
    'width': '20px',

    '& svg': {
      minWidth: '12px',
    },
  };

  const menuTitle = {
    'color': 'color-mix(in srgb, var(--text-color), transparent 40%)',
    'fontWeight': 'bold',
    'fontSize': '14px',
    'padding': '4px 6px',

    'display': 'flex',
    'flexDirection': 'row',
    'alignItems': 'center',
    'gap': '6px',

    '& > hr': {
      opacity: '0.3',
      flexGrow: 1,
      position: 'relative',
      top: '1px',
    },
  };

  const menuDiv = {
    padding: '6px 8px',
  };

  const menuDialog = {
    '::backdrop': {
      backgroundColor: 'transparent',
    },

    '&[open]': {
      border: 'none',
      backgroundColor: 'transparent',
      maxWidth: 'none',
      maxHeight: 'none',
      margin: '0',
      padding: '0',
      width: '100%',
      height: '100%',
    },
  };

  const menuPosition = {
    position: 'absolute',
  };

  const menuContent = {
    'position': 'relative',
    'width': 'fit-content',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 50%)',
    'borderRadius': '5px',
    // backgroundColor: 'rgba(255,255,255,0.3)',
    'backgroundColor': 'rgba(25,45,70,0.5)',
    '@media (prefers-color-scheme: light)': {
      backgroundColor: 'rgba(232,241,252,0.5)',
    },
    'display': 'flex',
    'flexDirection': 'column',
    'boxShadow': '0 0 20px rgba(0, 0, 0, 0.2)',
    'color': 'var(--text-color)',

    '.prefers-reduced-transparency &': {
      'backgroundColor': 'rgba(33,48,73,1)',
      '@media (prefers-color-scheme: light)': {
        backgroundColor: 'rgba(236,239,246,1)',
      },
    },

    '&::before': {
      'content': "''",
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'borderRadius': '5px',
      'backdropFilter': 'blur(10px)',
      'zIndex': -1,

      '.prefers-reduced-transparency &': {
        backdropFilter: 'none',
      },
    },
  };

  const submenu = {
    'position': 'relative',

    '& .content': {
      ...menuContent,
      'display': 'none',
      'position': 'absolute',
      'left': '100%',
      'top': 0,
      'width': 'max-content',

      '&[data-position~="top"]': {
        top: 'unset',
        bottom: 0,
      },
    },
    ':hover .content': {
      display: 'flex',
    },
  };

  const menuHr = {
    width: 'calc(100% - 20px)',
    opacity: '0.5',
    margin: '3px 0',
    alignSelf: 'center',
  };

  return {
    submenu,
    menuItem,
    menuItemRight,
    menuTitle,
    menuDiv,
    menuDialog,
    menuPosition,
    menuContent,
    menuHr,
  };
}

/******************************************************************************/

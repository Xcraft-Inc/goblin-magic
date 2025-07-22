/******************************************************************************/

export default function styles() {
  const button = {
    'position': 'relative',
    'minHeight': '32px',
    'minWidth': '31px',
    'cursor': 'pointer',
    'backgroundColor':
      'color-mix(in srgb, var(--button-background-color), transparent 80%)',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 50%)',
    'borderRadius': '5px',
    'padding': '6px 8px',
    'color': 'inherit',
    'display': 'inline-flex',
    'flexDirection': 'row',
    'alignItems': 'center',
    'justifyContent': 'center',
    'gap': '4px',

    '&:hover': {
      // backgroundColor: 'color-mix(in srgb, var(--text-color), transparent 70%)',
      backgroundColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 70%)',
      borderColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 10%)',
    },

    '&:enabled:active': {
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: 'scale(1.1)',
        border: '2px solid transparent',
        borderRadius: '5px',
        // outline: '1px solid red',
      },
      'transform': 'scale(0.9)',
      // paddingTop: '8px',
      'opacity': '0.85',
    },

    '&:focus-visible': {
      borderColor: 'var(--text-color)',
      boxShadow: '0px 0px 3px var(--text-color)',
      outline: 'none',
    },

    '&[data-enabled=true]': {
      // 'backgroundColor': 'rgba(255,255,255,0.4)',
      'backgroundColor': 'rgba(255,177,60,0.5)',
      'border': '1px solid rgb(255,153,0)',
      'boxShadow': '0px 0px 3px rgb(255,153,0)',
      '&:hover': {
        // backgroundColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(255,177,60,0.6)',
      },
    },

    '&[data-underlined=true]': {
      '&::after': {
        content: "''",
        height: '2px',
        backgroundColor: 'rgb(255,153,0)',
        position: 'absolute',
        bottom: '-1px',
        left: '0',
        right: '0',
        zIndex: '-1',
      },
    },

    '&[data-len1=true]': {
      fontSize: '20px',
      padding: 0,
    },

    '&[data-big=true]': {
      fontSize: '24px',
    },

    '&[data-simple=true]': {
      'backgroundColor': 'transparent',
      'borderColor': 'transparent',
      '&:not(:disabled):hover': {
        opacity: 1,
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 70%)',
        borderColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 50%)',
      },
      '&:disabled:hover': {
        backgroundColor: 'transparent',
      },
    },

    '& > i': {
      fontSize: '24px',
      fontStyle: 'normal',
    },

    '& > svg': {
      // These styles work because spans are added around text nodes in the render function

      '&:only-child': {
        // Reduce padding when there is only one icon
        margin: '-1px',
      },

      // mdi icon case
      '&[role=presentation]': {
        margin: '-3px',
      },

      ':not(:last-child)': {
        marginRight: '1px',
      },

      ':not(:first-child)': {
        marginLeft: '1px',
      },
    },

    '&:disabled': {
      'opacity': '0.4',
      '&:hover': {
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 80%)',
        cursor: 'unset',
      },
    },
  };

  const spinner = {
    'display': 'block',
    'width': '29px',
    'height': '29px',
    '&::after': {
      content: "''",
      display: 'inline-block',
      borderWidth: '2px',
      borderColor:
        'var(--text-color) var(--text-color) var(--text-color) transparent',
      borderStyle: 'solid',
      borderRadius: '100%',
      width: '17px',
      height: '17px',
      margin: '4px',
      animationDuration: '1.5s',
      animationDelay: '0s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      animationName: {
        '0%': {transform: 'rotate(0deg)'},
        '100%': {transform: 'rotate(360deg)'},
      },
    },
  };

  return {
    button,
    spinner,
  };
}

/******************************************************************************/

export default function styles() {
  const mainTabs = {
    // 'color': 'white',
    'flexGrow': 1,
    'padding': '4px 7px',
    'display': 'flex',
    'flexDirection': 'row',
    'flexWrap': 'wrap',
    'gap': '4px',

    '&:focus-visible': {
      'outline': 'none',

      '& > [data-active=true]': {
        borderColor: 'var(--text-color)',
        boxShadow: '0px 0px 3px var(--text-color)',
      },
    },

    '& > *': {
      'padding': '10px 8px 8px 12px',
      'border':
        '1px solid color-mix(in srgb, var(--text-color), transparent 75%)',
      'borderRadius': '3px',
      'backgroundColor':
        'color-mix(in srgb, var(--text-color), transparent 87.5%)',
      'backdropFilter': 'blur(10px)',

      'display': 'inline-flex',
      'flexDirection': 'row',
      'alignItems': 'center',
      'maxWidth': '300px',

      '&[data-active=true]': {
        'backgroundColor': 'rgba(255,255,255,0.25)',
        'borderColor': 'color-mix(in srgb, var(--text-color), transparent 50%)',
        ':hover': {
          backgroundColor:
            'color-mix(in srgb, rgba(255,255,255,0.25), var(--accent-color) 15%)',
        },
        '@media (prefers-color-scheme: light)': {
          'backgroundColor': 'rgba(248, 241, 248, 0.85)',
          'borderColor':
            'color-mix(in srgb, var(--text-color), transparent 70%)',
          ':hover': {
            backgroundColor:
              'color-mix(in srgb, rgba(248, 241, 248, 0.85), var(--accent-color) 15%)',
          },
        },
      },

      '&[data-highlighted=true]': {
        'backgroundColor': 'rgba(255,177,60,0.45)',
        'borderColor': 'rgba(255,153,0,0.7)',
        'boxShadow': '0px 0px 5px rgba(255,153,0,0.7)',
        ':hover': {
          backgroundColor: 'rgb(255,185,82,0.6)',
          borderColor: 'rgba(255,153,0,0.85)',
        },
      },

      '&[data-highlighted=true][data-active=true]': {
        'backgroundColor':
          'color-mix(in srgb, rgba(255,255,255,0.25), rgba(255,177,60,0.45) 25%)',
        'borderColor':
          'color-mix(in srgb, color-mix(in srgb, var(--text-color), transparent 50%), rgba(255,153,0,0.7) 25%)',
        ':hover': {
          backgroundColor:
            'color-mix(in srgb, color-mix(in srgb, rgba(255,255,255,0.25), rgba(255,177,60,0.45) 25%), var(--accent-color) 15%)',
          borderColor:
            'color-mix(in srgb, var(--button-accent-color), transparent 10%)',
        },
        '@media (prefers-color-scheme: light)': {
          'backgroundColor':
            'color-mix(in srgb, rgba(248, 241, 248, 0.85), rgba(255,177,60,0.45) 25%)',
          'borderColor':
            'color-mix(in srgb, color-mix(in srgb, var(--text-color), transparent 70%), rgba(255,153,0,0.7) 25%)',
          ':hover': {
            backgroundColor:
              'color-mix(in srgb, color-mix(in srgb, rgba(248, 241, 248, 0.85), rgba(255,177,60,0.45) 25%), var(--accent-color) 15%)',
          },
        },
      },

      ':hover': {
        backgroundColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 70%)',
        borderColor:
          'color-mix(in srgb, var(--button-accent-color), transparent 10%)',
      },

      ':active': {
        opacity: 0.8,
      },

      '&:focus-visible': {
        borderColor: 'var(--text-color)',
        boxShadow: '0px 0px 3px var(--text-color)',
        outline: 'none',
      },
    },
  };

  return {
    mainTabs,
  };
}

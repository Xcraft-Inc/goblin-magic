/******************************************************************************/

export default function styles() {
  const waveAnim = {
    '0%': {
      transform: 'scaleY(0.3)',
    },
    '15%': {
      transform: 'scaleY(1.7)',
    },
    '30%': {
      transform: 'scaleY(0.6)',
    },
    '55%': {
      transform: 'scaleY(2)',
    },
    '75%': {
      transform: 'scaleY(0.8)',
    },
    '100%': {
      transform: 'scaleY(0.3)',
    },
  };

  const wave = {
    'display': 'inline-flex',
    'flexDirection': 'row',
    'alignItems': 'center',
    'justifyContent': 'center',
    'gap': '2px',

    '& span': {
      width: '2px',
      height: 'calc(6px + 16px * var(--level))',
      borderRadius: '50px',
      backgroundColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 70%)',
      borderColor:
        'color-mix(in srgb, var(--button-accent-color), transparent 10%)',
      display: 'inline-block',

      animationName: waveAnim,
      animationDuration: 'var(--speed, 0.6s)',
      animationTimingFunction: 'cubic-bezier(0.37, 0, 0.63, 1)',
      animationIterationCount: 'infinite',
      animationDirection: 'alternate',
      animationDelay: 'calc(var(--i) * -0.08s)',
      transformOrigin: 'bottom',
    },
  };

  return {
    wave,
  };
}

/******************************************************************************/

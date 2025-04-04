export default function styles() {
  const zenDialog = {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    padding: 0,
    border: 'none',
  };

  const zen = {
    width: '100%',
    height: '100%',
    padding: '15px',
    // '--border-radius': '8px',
    // 'background': 'transparent',
    // 'borderRadius': '8px',
    // 'boxShadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
    // 'backdropFilter': 'blur(50px) saturate(100%)',
    // 'border':
    // '1px solid color-mix(in srgb, var(--text-color), transparent 78%)',
  };

  const key = {
    border: '1px solid var(--text-color)',
    padding: '2px',
  };

  const notice = {
    'pointerEvents': 'none',
    'opacity': 0,
    'zIndex': 2,
    'borderRadius': '10px',
    'position': 'fixed',
    'top': '20px',
    'left': '50%',
    'transform': 'translate(-50%, -10%)',
    'fontSize': '24px',
    'padding': '15px',
    'textAlign': 'center',
    'backgroundColor': 'rgba(0,0,0,0.5)',
    '--text-color': 'white',
    'color': 'var(--text-color)',
    'animationDirection': 'forwards',
    'animationDuration': '3s',
    'animationName': {
      '0%': {opacity: 1},
      '50%': {opacity: 1},
      '100%': {opacity: 0},
    },
  };

  return {
    zen,
    zenDialog,
    notice,
    key,
  };
}

/******************************************************************************/

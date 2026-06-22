export default function styles() {
  const magicOverlay = {
    'backgroundColor': 'transparent',
    'border': 'none',
    'color': 'var(--text-color)',
    'padding': '2px',
    'overflow': 'visible', // Display shadows
    // Reset defaults
    // margin: 0,
    // inset: 'auto',
    '&::backdrop': {
      backgroundColor: 'transparent',
    },
  };

  const overlayBackdrop = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000000,
  };

  return {
    magicOverlay,
    overlayBackdrop,
  };
}

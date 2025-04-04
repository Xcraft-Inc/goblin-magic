export default function styles() {
  const div = {
    '--border-radius': '8px',
    // 'color': 'white',
    'background': 'rgba(248, 241, 248, 0.1)',
    'borderRadius': '8px',
    'boxShadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
    'backdropFilter': 'blur(10px) saturate(100%)',
    'border':
      '1px solid color-mix(in srgb, var(--text-color), transparent 78%)',

    '@media (prefers-color-scheme: light)': {
      background: 'rgba(248, 241, 248, 0.85)',
    },
  };

  return {
    div,
  };
}

/******************************************************************************/

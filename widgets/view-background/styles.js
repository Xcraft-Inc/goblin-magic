export default function styles() {
  const viewBackground = {
    '&[data-is-dialog=true]': {
      'backgroundColor': 'rgba(77,82,98,0.8)',

      '@media (prefers-color-scheme: light)': {
        backgroundColor: 'rgba(255,255,255,0.85)',
      },
    },
  };

  return {
    viewBackground,
  };
}

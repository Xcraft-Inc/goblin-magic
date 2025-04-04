export default function styles(theme) {
  const picker = {
    '& div > em-emoji-picker': {
      '--font-family': theme.typo.font,
      '--border-radius': '4px',

      '--rgb-background': '25, 45, 70, 1',
      '--rgb-accent': '255, 255, 255',
      '--shadow': '0 0 1px 1px rgba(255, 255, 255, 0.4)',
      '@media (prefers-color-scheme: light)': {
        '--rgb-background': '237, 234, 242, 1',
        '--rgb-accent': '0, 0, 0',
        '--shadow': '0 0 1px 1px rgba(0, 0, 0, 0.4)',
      },
    },
  };

  return {
    picker,
  };
}

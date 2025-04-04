/******************************************************************************/
export const propNames = ['selected', 'disabled', 'size'];
export default function styles(theme, props) {
  let size = 16;
  if (props.size) {
    size = props.size;
  }
  let hoverSize = size + 2;
  const action = {
    display: 'inline-block',
    fontSize: `${size}px`,
    margin: `${size / 4}px`,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    // color: '#fff',
    textDecoration: 'none',
    transition: 'font-size 0.1s ease-in-out',
    cursor: 'default',
  };

  const text = {
    ':hover': {
      fontSize: `${hoverSize}px`,
      lineHeight: '1em',
    },
  };

  if (props.selected) {
    action.textShadow = '0 0 20px var(--text-color)';
    text[':hover'] = null;
  }

  if (props.disabled) {
    action.color = 'color-mix(in srgb, var(--text-color), transparent 40%)';
    action.userSelect = 'none';
    text[':hover'] = null;
  }

  return {
    action,
    text,
  };
}

/******************************************************************************/

/******************************************************************************/

export const propNames = ['position', 'maxWidth', 'maxHeight'];

export default function styles(theme, props) {
  const {position = 'topLeft', maxWidth, maxHeight} = props;

  const resizer = {maxWidth, maxHeight};

  const button = {
    position: 'absolute',
    color: 'var(--text-color)',
    padding: '2px',
  };

  switch (position) {
    case 'topLeft':
      button.top = 0;
      button.left = 0;
      button.cursor = 'nwse-resize';
      button.transform = 'rotate(180deg)';
      break;
    case 'topRight':
      button.top = 0;
      button.right = 0;
      button.cursor = 'nesw-resize';
      button.transform = 'rotate(-90deg)';
      break;
    case 'bottomLeft':
      button.bottom = 0;
      button.left = 0;
      button.cursor = 'nesw-resize';
      button.transform = 'rotate(90deg)';
      break;
    default:
    case 'bottomRight':
      button.bottom = 0;
      button.right = 0;
      button.cursor = 'nwse-resize';
      break;
  }

  return {resizer, button};
}

/******************************************************************************/

/******************************************************************************/

export const propNames = ['position', 'maxWidth', 'maxHeight'];

export default function styles(theme, props) {
  const {position = 'topLeft', maxWidth, maxHeight} = props;

  const resizer = {maxWidth, maxHeight};

  const button = {
    position: 'absolute',
    padding: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
  };

  switch (position) {
    case 'topLeft':
      button.top = 0;
      button.left = 0;
      button.cursor = 'nwse-resize';
      break;
    case 'topRight':
      button.top = 0;
      button.right = 0;
      button.cursor = 'nesw-resize';
      break;
    case 'bottomLeft':
      button.bottom = 0;
      button.left = 0;
      button.cursor = 'nesw-resize';
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

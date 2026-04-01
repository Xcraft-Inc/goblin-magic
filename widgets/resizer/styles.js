/******************************************************************************/

export default function styles() {
  const resizer = {};

  const button = {
    position: 'absolute',
    padding: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    top: 0,
    left: 0,
    cursor: 'nwse-resize',
  };

  return {resizer, button};
}

/******************************************************************************/

/******************************************************************************/

export default function styles() {
  const action = {
    padding: '4px',
  };

  const show = {
    position: 'fixed',
    top: '47px',
    left: 0,
    width: '50%',
    height: 'auto',
    transition: 'width 0.2s ease, opacity 0.2s ease',
    // zIndex: 10000,
  };

  const hidden = {
    ...show,
    left: '-2px',
    width: '0%',
  };

  const content = {
    display: 'flex',
    flexDirection: 'column',
  };

  const hiddenContent = {
    visibility: 'hidden',
  };

  const shortcut = {
    fontSize: '80%',
  };

  const closeButton = {
    'position': 'absolute',
    'top': 0,
    'right': 0,
    'fontSize': '20px',
    'padding': '7px 10px',
    'opacity': 0.6,
    'cursor': 'pointer',
    ':hover': {
      opacity: 1,
    },
  };

  return {
    hiddenContent,
    content,
    action,
    hidden,
    show,
    shortcut,
    closeButton,
  };
}

/******************************************************************************/

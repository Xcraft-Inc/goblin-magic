/******************************************************************************/

function getBackgroundMood(mood, customOpacity) {
  let o = 0.5;
  if (customOpacity !== undefined) {
    o = customOpacity;
  }
  switch (mood) {
    case 'unicorn':
      return `linear-gradient(109.6deg, rgba(9, 9, 121, ${o}) 11.2%, rgba(144, 6, 161, ${o}) 53.7%, rgba(0, 212, 255, ${o}) 100.2%)`;
    case 'sunset':
      return `linear-gradient(111.1deg, rgba(0, 40, 70, ${o}) -4.8%, rgba(255, 115, 115, ${o}) 82.7%, rgba(255, 175, 123, ${o}) 97.2%)`;
    case 'velvet':
      return `radial-gradient(circle at 52.1% -29.6%, rgba(144, 17, 105, ${o}) 0%, rgba(51, 0, 131, ${o}) 100.2%)`;
    default:
      return `rgba(248, 241, 248, 0.1)`;
  }
}

function assignProp(className, propName, properties, defaultValue) {
  if (properties[propName]) {
    className[propName] = properties[propName];
  } else if (defaultValue) {
    className[propName] = defaultValue;
  }
}

export const propNames = [
  'z',
  'mood',
  'top',
  'left',
  'right',
  'bottom',
  'height',
  'width',
  'opacity',
];

export default function styles(theme, props) {
  let background = getBackgroundMood(props.mood, props.opacity);
  const main = {
    'overflowX': 'auto',
    'overflowY': 'auto',
    '::-webkit-scrollbar-track': {
      width: '4px',
      borderRadius: '2px',
      backgroundColor: background,
    },
    '::-webkit-scrollbar': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      borderRadius: '2px',
      backgroundColor: background,
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: ' 10px',
      boxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    'color': 'white',
    background,
    'borderRadius': '8px',
    'boxShadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
    'backdropFilter': 'blur(10px) saturate(100%)',
    'border': '1px solid rgba(209, 213, 219, 0.3)',
  };

  if (props.top || props.bottom) {
    main.position = 'absolute';
    main.height = props.height || '500px';
    // assignProp(main, 'zIndex', props, 1);
    assignProp(main, 'width', props, '450px');

    if (props.top) {
      assignProp(main, 'top', props, '10vh');
    } else if (props.bottom) {
      assignProp(main, 'bottom', props, '10vh');
    } else {
      assignProp(main, 'top', props, '10vh');
    }

    if (props.left) {
      assignProp(main, 'left', props, '10vw');
    } else if (props.right) {
      assignProp(main, 'right', props, '10vw');
    } else {
      assignProp(main, 'left', props, '10vw');
    }
  }

  // background = getBackgroundMood(props.mood);

  const content = {
    minHeight: '100%',
    padding: '20px',
  };

  const close = {
    position: 'absolute',
    right: '10px',
    top: '0px',
  };

  return {
    main,
    content,
    close,
  };
}

/******************************************************************************/

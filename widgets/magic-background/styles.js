import BG_MILK from './bg-milkyway.png';
import BG_WHITE from './bg-white.png';

/******************************************************************************/

const images = {
  milk: BG_MILK,
  white: BG_WHITE,
};

window.CSS.registerProperty({
  name: '--aurora-color',
  syntax: '<color>',
  inherits: false,
  initialValue: `transparent`,
});

window.CSS.registerProperty({
  name: '--space-dark',
  inherits: false,
  initialValue: `url(${BG_MILK})`,
});

window.CSS.registerProperty({
  name: '--space-light',
  inherits: false,
  initialValue: `url(${BG_WHITE})`,
});

export const propNames = [
  'useBackgroundColor',
  'backgroundColor',
  'plainColor',
];
export default function styles(theme, props) {
  const {plainColor} = props;

  const main = {
    '--space-dark': plainColor ? '#0D1D3C' : `url(${images['milk']})`,
    '--space-light': plainColor ? '#CDDFEC' : `url(${images['white']})`,
    '--accent-color': `${props.backgroundColor || 'white'}`,
    '--button-accent-color':
      'color-mix(in srgb, var(--accent-color), #ccc 40%)',
    '--aurora-color': `transparent`,
    'height': '100vh',
    'width': '100vw',
    'display': 'flex',
    'flexDirection': 'column',
    'background': `linear-gradient(to bottom, transparent 40%, var(--aurora-color)), var(--space-dark)`,
    'backgroundSize': 'cover',
    'overflow': 'auto',
    'transition': '--space-dark 3s, --aurora-color 3s',

    '@media (prefers-color-scheme: light)': {
      // backgroundImage: `linear-gradient(170deg, rgba(207,255,245,1) 0%, rgba(201,216,247,1) 100%)`,
      // backgroundImage: `linear-gradient(to bottom, transparent 40%, var(--aurora-color)), linear-gradient(170deg, rgba(234,255,251,1) 0%, rgba(243,247,255,1) 100%)`,
      background: `linear-gradient(to bottom, transparent 40%, var(--aurora-color)), var(--space-light)`,
      transition: '--space-light 3s, --aurora-color 3s',
    },
  };

  if (props.useBackgroundColor) {
    main[':hover'] = {
      '--aurora-color': `${props.backgroundColor}42`,
    };
  }

  const proto = {
    textShadow: 'rgb(179 150 177 / 70%) -2px 0px 40px',
    color: 'rgb(0 0 0)',
    fontSize: '6em',
    textAlign: 'center',
  };

  return {
    main,
    proto,
  };
}

/******************************************************************************/

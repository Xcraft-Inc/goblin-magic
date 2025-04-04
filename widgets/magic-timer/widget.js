import * as styles from './styles.js';
import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import {datetime as DateTimeConverters} from 'xcraft-core-converters';
import MagicButton from '../magic-button/widget.js';
import Icon from '@mdi/react';
import {mdiPlay, mdiPause} from '@mdi/js';

export class TimerUpdater extends Widget {
  constructor() {
    super(...arguments);
    this.state = {
      timerValue: '',
    };
    this.updateTimer = this.updateTimer.bind(this);
  }

  static getDerivedStateFromProps(props) {
    return {
      timerValue: props.start ? TimerUpdater.getCurrentValue(props.start) : '',
    };
  }

  componentDidMount() {
    this.startStopTimer();
  }

  componentDidUpdate() {
    this.startStopTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  static getCurrentValue(start) {
    const now = new Date().toISOString();
    const value = DateTimeConverters.getDisplayedBetweenToDatetimes(start, now);
    return value;
  }

  updateTimer() {
    this.setState({
      timerValue: TimerUpdater.getCurrentValue(this.props.start),
    });
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(this.updateTimer, 1000);
    }
  }

  startStopTimer() {
    if (this.props.start) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  render() {
    return this.props.children(this.state.timerValue);
  }
}

class MagicTimerNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.start) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    const now = new Date().toISOString();
    this.props.onStart?.(now);
  }

  stop() {
    const now = new Date().toISOString();
    this.props.onStop?.(now);
  }

  render() {
    const {start, onStart, onStop, className = '', ...props} = this.props;
    return (
      <div
        {...props}
        className={this.styles.classNames.timer + ' ' + className}
      >
        <MagicButton
          className="button"
          onClick={this.handleClick}
          enabled={Boolean(start)}
          big
        >
          {start ? (
            <Icon path={mdiPause} size={0.8} />
          ) : (
            <Icon path={mdiPlay} size={0.8} />
          )}
        </MagicButton>
        <TimerUpdater start={this.props.start}>
          {(timerValue) =>
            timerValue && <span className="text">+&nbsp;{timerValue}</span>
          }
        </TimerUpdater>
      </div>
    );
  }
}

// export class MagicTimerTest extends Widget {
//   constructor() {
//     super(...arguments);
//     this.state = {
//       start: null,
//       duration: 0,
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(state) {
//     this.setState(state);
//   }

//   componentDidUpdate() {
//     console.log(this.state);
//   }

//   render() {
//     return (
//       <MagicTimerNC
//         onChange={this.handleChange}
//         {...this.state}
//         {...this.props}
//       />
//     );
//   }
// }

const MagicTimer = withC(MagicTimerNC);
MagicTimer.displayName = 'MagicTimer';

export default MagicTimer;

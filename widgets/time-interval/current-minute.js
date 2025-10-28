import Widget from 'goblin-laboratory/widgets/widget/index.js';
import timeInterval from './time-interval.js';
import getDate from './get-date.js';

function getCurrentMinute() {
  const {year, month, day, hours, minutes} = getDate();
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default class CurrentMinute extends Widget {
  constructor() {
    super(...arguments);
    this.state = {
      dateTime: getCurrentMinute(),
    };
    this.stopTimer = null;
  }

  componentDidMount() {
    this.stopTimer = timeInterval(this.updateValue, 'minute', {
      // log: (...args) =>
      //   console.log(
      //     `[${new Date().toLocaleString('fr-ch')}]`,
      //     this.name,
      //     ...args
      //   ),
    });
  }

  componentWillUnmount() {
    this.stopTimer?.();
  }

  updateValue = () => {
    this.setState({
      dateTime: getCurrentMinute(),
    });
  };

  render() {
    return this.props.children(this.state.dateTime);
  }
}

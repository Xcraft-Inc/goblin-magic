import Widget from 'goblin-laboratory/widgets/widget/index.js';
import timeInterval from './time-interval.js';
import getDate from './get-date.js';

function getCurrentDay() {
  const {year, month, day} = getDate();
  return `${year}-${month}-${day}`;
}

export default class CurrentDay extends Widget {
  constructor() {
    super(...arguments);
    this.state = {
      day: getCurrentDay(),
    };
    this.timer = null;
  }

  componentDidMount() {
    this.stopTimer = timeInterval(this.updateValue, 'day', {
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
      day: getCurrentDay(),
    });
  };

  render() {
    return this.props.children(this.state.day);
  }
}

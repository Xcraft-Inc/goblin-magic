/**
 * Repeat a function at specific times
 * @param {Function} fct
 * @param {'day' | 'hour' | 'minute' | 'second'} type
 * @param {object} [options]
 * @param {number} [options.maxTick] a shorter tick ensures the function is called soon when the operating system wake up from sleep
 * @param {Function} [options.log] a logger function
 * @returns {Function} a function to stop the execution
 */
export default function timeInterval(
  fct,
  type,
  {maxTick = 15 * 1000, log = () => {}} = {}
) {
  let timer = null;
  /** @type {number} */
  let nextUpdateTime = 0;

  const nextUpdate = {
    day: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    },
    hour: () => {
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1
      );
    },
    minute: () => {
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 1
      );
    },
    second: () => {
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds() + 1
      );
    },
  }[type];
  if (!nextUpdate) {
    throw new Error(`Unknown iterval type ${type}`);
  }

  function tick() {
    log('tick');
    const nowTime = new Date().getTime();
    if (nowTime >= nextUpdateTime) {
      log('call');
      fct();
    }
    scheduleTick();
  }

  function scheduleTick() {
    log('scheduleTick');
    if (timer) {
      clearTimeout(timer);
    }
    const nowTime = new Date().getTime();
    nextUpdateTime = nextUpdate().getTime();
    let diff = nextUpdateTime - nowTime;
    if (maxTick && diff > maxTick) {
      diff = maxTick;
    }
    log('diff', diff);
    timer = setTimeout(tick, diff);
  }

  scheduleTick();

  return function stop() {
    log('stop');
    if (timer) {
      clearTimeout(timer);
    }
  };
}

import RX from 'rxjs';

const mappedKeys = ['a', 'w', 's', 'd'];

const keyMapping = {
  up: 'w',
  down: 's',
  forward: 'd',
  backward: 'a',
};

export default (width, height, velocity) => (
  RX.Observable.fromEvent(document, 'keypress')
    .filter(e => mappedKeys.includes(e.key))
    .scan(({ x, y }, e) => {
      switch (e.key) {
        case keyMapping.up:
          return { x, y: y <= 0 ? 0 : y - velocity };

        case keyMapping.down:
          return { x, y: y >= height ? height : y + velocity };

        case keyMapping.forward:
          return { x: x >= width ? width : x + velocity, y };

        case keyMapping.backward:
          return { x: x <= 0 ? 0 : x - velocity, y };

        default:
          return { x, y };
      }
    }, { x: 20, y: height / 2 })
);


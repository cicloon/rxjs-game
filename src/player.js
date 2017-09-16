import Rx from 'rxjs';
import pressedKeys$ from './keyHandling';

const mappedKeys = ['a', 'w', 's', 'd'];

const keyMapping = {
  up: 'w',
  down: 's',
  forward: 'd',
  backward: 'a',
};

const inverseKeymapping = Object.keys(keyMapping).reduce((acc, key) => {
  acc[keyMapping[key]] = key; // eslint-disable-line
  return acc;
}, {});

const movement$ = Rx.Observable.interval(30);

const combineFunc = (_, pressedKeys) => (pressedKeys);

const initialVelocity = {
  forward: 0.0, backward: 0.0, up: 0.0, down: 0.0,
};

const handleVelocity = (velocity, increasing) => {
  let newVelocity = velocity;
  if (newVelocity < 2 && increasing) newVelocity += 0.1;
  else if (newVelocity > 0 && !increasing) newVelocity -= 0.1;

  if (newVelocity > 2) newVelocity = 2;
  if (newVelocity < 0) newVelocity = 0;

  return newVelocity;
};

const velocity$ = Rx.Observable
  .combineLatest(movement$, pressedKeys$, combineFunc)
  .sampleTime(30)
  .scan((velocity, pressedKeys) => (
    mappedKeys.reduce((acc, key) => {
      const direction = inverseKeymapping[key];
      // eslint-disable-next-line
      acc[direction] = handleVelocity(velocity[direction], pressedKeys.has(key));
      return acc;
    }, {})
  ), initialVelocity)
  .startWith(initialVelocity);


export default (width, height) => (
    velocity$
    .scan(({ x, y }, velocityMapping) => (
      Object.keys(velocityMapping).reduce(({ x: newX, y: newY }, direction) => {
        switch (direction) {
          case 'up':
            return { x: newX, y: newY <= 0 ? 0 : newY - velocityMapping[direction] };

          case 'down':
            return { x: newX, y: newY >= height ? height : newY + velocityMapping[direction] };

          case 'forward':
            return { x: newX >= width ? width : newX + velocityMapping[direction], y: newY };

          case 'backward':
            return { x: newX <= 0 ? 0 : newX - velocityMapping[direction], y: newY };

          default:
            return { x: newX, y: newY };
        }
      }, { x, y })
    ), { x: 20, y: height / 2 })
);


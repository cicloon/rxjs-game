import Rx from 'rxjs';

const mappedKeys = ['a', 'w', 's', 'd'];

const keyMapping = {
  up: 'w',
  down: 's',
  forward: 'd',
  backward: 'a',
};


const keyDown$ = Rx.Observable.fromEvent(document, 'keypress')
    .map(e => (e.key))
    .filter(key => mappedKeys.includes(key));

const keyUp$ = Rx.Observable.fromEvent(document, 'keyup')
    .map(e => (e.key))
    .filter(key => mappedKeys.includes(key));

const movement$ = Rx.Observable.interval(250);

const combineFunc = (_, keyUp, keyDown) => (keyUp !== keyDown);


const velocity$ = Rx.Observable
  .combineLatest(movement$, keyUp$, keyDown$, combineFunc)
  .sampleTime(250)
  .scan((velocity, increasing) => {
    let newVelocity = velocity;
    if (newVelocity < 2 && increasing) newVelocity += 0.1;
    else if (newVelocity > 0 && !increasing) newVelocity -= 0.1;

    if (newVelocity > 2) newVelocity = 2;
    if (newVelocity < 0) newVelocity = 0;

    return newVelocity;
  }, 0);


velocity$.subscribe((v) => console.log(v));


export default (width, height) => (
  Rx.Observable.fromEvent(document, 'keypress')
    .filter(e => mappedKeys.includes(e.key))
    .mergeMap((e) => {
      console.log(e);
      return velocity$.map((velocity) => {
        console.log(velocity);
        return { key: e.key, velocity };
      });
    })
    .scan(({ x, y }, e) => {
      switch (e.key) {
        case keyMapping.up:
          return { x, y: y <= 0 ? 0 : y - e.velocity };

        case keyMapping.down:
          return { x, y: y >= height ? height : y + e.velocity };

        case keyMapping.forward:
          return { x: x >= width ? width : x + e.velocity, y };

        case keyMapping.backward:
          return { x: x <= 0 ? 0 : x - e.velocity, y };

        default:
          return { x, y };
      }
    }, { x: 20, y: height / 2 })
);


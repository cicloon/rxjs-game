import Rx from 'rxjs';
import pressedKeys$ from './keyHandling';

const spacePressed$ = pressedKeys$
  .filter((pressedKeys) => pressedKeys.has(' '));

const movement$ = Rx.Observable
  .interval(10);

export default (player$, width) => {
  const shoting$ = player$
    .sample(spacePressed$)
    .sampleTime(300)
    .map((playerPosition) => (
      { x: playerPosition.x + 20, y: playerPosition.y, timestamp: Date.now() }
    ));

  return Rx.Observable.combineLatest(movement$, shoting$, (_, shot) => (shot))
    .scan((shotsData, newShot) => {
      const newShots = shotsData.shots
        .map((shot) => ({ x: shot.x + 1, y: shot.y }))
        .filter((shot) => (shot.x <= width));
      if (newShot.timestamp !== shotsData.lastAdded) {
        newShots.push(newShot);
      }
      return { lastAdded: newShot.timestamp, shots: newShots };
    }, { lastAdded: undefined, shots: [] })
    .map((shotData) => (shotData.shots))
    .startWith([]);
};

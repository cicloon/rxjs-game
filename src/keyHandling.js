import Rx from 'rxjs';

const compareKeyEvents = ((e1, e2) => {
  const keyEventTos = (e) => (`${e.which}${e.type}`);
  return keyEventTos(e1) === keyEventTos(e2);
});

const keyUp$ = Rx.Observable.fromEvent(document, 'keyup');

const keyDown$ = Rx.Observable.fromEvent(document, 'keydown');

const pressedKeys$ = Rx.Observable.merge(keyDown$, keyUp$)
  .distinctUntilChanged(compareKeyEvents)
  .scan((pressedKeys, keyEvent) => {
    const { type, key } = keyEvent;
    let newPressedKeys;
    switch (type) {
      case 'keydown':
        newPressedKeys = new Set([...pressedKeys, key]);
        break;

      case 'keyup':
        newPressedKeys = new Set([...pressedKeys]);
        newPressedKeys.delete(key);
        break;

      default:
        newPressedKeys = pressedKeys;
    }
    return newPressedKeys;
  }, new Set());

export default pressedKeys$;

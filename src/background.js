import RX from 'rxjs';

const getStars$ = (width, height, speed) => (
  RX.Observable.range(1, 200)
    .map(() => (
      {
        x: parseInt(Math.random() * width, 10),
        y: parseInt(Math.random() * height, 10),
        size: Math.random() * 3 + 1
      }
    ))
    .toArray()
    .flatMap((starArray) => (
      RX.Observable.interval(speed).scan(((stars) => (
        stars.map((star) => {
          const newStarX = star.x <= 0 ? width : star.x - 3;
          return { ...star, x: newStarX };
        })
      )), starArray)
    ))
);

export default (width, height, speed) => (
  getStars$(width, height, speed)
);


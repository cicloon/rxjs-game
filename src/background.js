import RX from 'rxjs';

const getStars$ = (width, height, speed, minSize, maxSize) => (
  RX.Observable.range(1, 200)
    .map(() => (
      {
        x: parseInt(Math.random() * width, 10),
        y: parseInt(Math.random() * height, 10),
        size: Math.random() * maxSize + minSize,
      }
    ))
    .toArray()
    .flatMap((starArray) => (
      RX.Observable.interval(speed).scan(((stars) => (
        stars.map((star) => {
          const newStarX = star.x <= 0 ? width : star.x - 1;
          return { ...star, x: newStarX };
        })
      )), starArray)
    ))
);

export default (width, height) => (

  getStars$(width, height, 20, 2, 5)
    .combineLatest(getStars$(width, height, 100, 1, 3),
      (stars1, stars2) => ([stars1, stars2]))
);


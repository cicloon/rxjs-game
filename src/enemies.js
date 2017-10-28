import RX from 'rxjs';

const ENEMY_INTERVAL = 6500;
const ENEMY_SPEED = 200;

const enemiesSpeed$ = RX.Observable
  .interval(ENEMY_SPEED);

const getEnemiesGenerator$ = (width, height) => (
  RX.Observable
    .interval(ENEMY_INTERVAL)
    .map((enemyId) => ({
      x: width,
      y: parseInt(Math.random() * height, 10),
      id: enemyId,
    }))
    .scan((acc, enemy) => {
      // eslint-disable-next-line no-param-reassign
      acc[enemy.id] = enemy;
      return acc;
    }, {})
    .combineLatest(enemiesSpeed$, (enemiesArray) => (enemiesArray))
    .mergeScan((acc, enemies) => {
      const newAcc = { ...enemies, ...acc };

      const mapped = Object.keys(newAcc).reduce((mappedAcc, enemyId) => {
        const enemy = newAcc[enemyId];
        const newEnemyX = enemy.x <= 0 ? width : enemy.x - 1;
        const newEnemy = { ...enemy, x: newEnemyX };
        // eslint-disable-next-line no-param-reassign
        mappedAcc[newEnemy.id] = newEnemy;
        return mappedAcc;
      }, {});

      return RX.Observable.of(mapped);
    }, {})
    .map((enemies) => (Object.values(enemies)))
);


export default (width, height) => (
  getEnemiesGenerator$(width, height)
);

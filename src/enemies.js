import RX from 'rxjs';

const ENEMY_INTERVAL = 6500;
const ENEMY_SPEED = 200;

const enemiesSpeed$ = RX.Observable
  .interval(ENEMY_SPEED);

export default (width, height, playerShots$) => {
  const enemiesGenerator$ = RX.Observable
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
    .combineLatest(enemiesSpeed$, (enemiesArray) => (enemiesArray));

  const playerShotsSample$ = playerShots$
    .sample(enemiesGenerator$);

  return enemiesGenerator$
    .combineLatest(playerShotsSample$)
    .mergeScan((acc, [enemies, playerShots]) => {
      const newAcc = { ...enemies, ...acc };

      // enemies movement
      const mapped = Object.keys(newAcc).reduce((mappedAcc, enemyId) => {
        const enemy = newAcc[enemyId];
        const newEnemyX = enemy.x <= 0 ? width : enemy.x - 1;
        const newEnemy = { ...enemy, x: newEnemyX };
        // eslint-disable-next-line no-param-reassign
        mappedAcc[newEnemy.id] = newEnemy;


        // enemies and player shots collisions
        playerShots.forEach((shot) => {
          if (
            shot.x > newEnemy.x - 12.5 &&
            shot.x <= newEnemy.x + 12.5 &&
            shot.y < newEnemy.y + 15 &&
            shot.y >= newEnemy.y - 15
          ) {
            // eslint-disable-next-line
            delete mappedAcc[newEnemy.id];
          }
        });


        return mappedAcc;
      }, {});


      return RX.Observable.of(mapped);
    }, {})
    .map((enemies) => (Object.values(enemies)));
};


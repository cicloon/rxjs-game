import Rx from 'rxjs';
import getBackground from './background';
import getPlayer from './player';
import getshoting from './shooting';
import getEnemies from './enemies';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paintStars = (stars) => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach((starLayer) => {
    starLayer.forEach((star) => {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  });
};

const paintTriangle = (x, y, width, height, color, direction = 'right') => {
  const halfHeight = height / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - halfHeight);
  if (direction === 'right') ctx.lineTo(x + width, y);
  else ctx.lineTo(x - width, y);
  ctx.lineTo(x, y + halfHeight);
  ctx.lineTo(x, y - halfHeight);
  ctx.fill();
};

const paintSpaceship = ({ x, y }) => {
  paintTriangle(x, y, 30, 20, '#00ff00', 'right');
};

const paintShots = (shots) => {
  ctx.fillStyle = '#ff0000';
  shots.forEach((shot) => {
    ctx.fillRect(shot.x, shot.y, 10, 3);
  });
};

const paintEnemies = (enemies) => {
  enemies.forEach((enemy) => {
    paintTriangle(enemy.x, enemy.y, 25, 30, '#ff0000', 'left');
  });
};

const background$ = getBackground(canvas.width, canvas.height, 50);
const player$ = getPlayer(canvas.width, canvas.height, 2);
const enemies$ = getEnemies(canvas.width, canvas.height);
const shoting$ = getshoting(player$, canvas.width);

const game$ = Rx.Observable.combineLatest(
  player$, background$, shoting$, enemies$,
  (player, background, shots, enemies) => ({ background, player, shots, enemies })
);

const renderScene = (actors) => {
  paintStars(actors.background);
  paintSpaceship(actors.player);
  paintShots(actors.shots);
  paintEnemies(actors.enemies);
};

game$.subscribe(renderScene);

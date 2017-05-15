import Rx from 'rxjs';
import getBackground from './background';
import getPlayer from './player';

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

const paintTriangle = (x, y, width, height, color, direction) => {
  const halfHeight = height / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - halfHeight);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x, y + halfHeight);
  ctx.lineTo(x, y - halfHeight);
  ctx.fill();
};

const paintSpaceship = ({ x, y }) => {
  paintTriangle(x, y, 30, 20, '#00ff00', 'right');
};

const background$ = getBackground(canvas.width, canvas.height, 50);
const player$ = getPlayer(canvas.width, canvas.height, 2);

const game$ = Rx.Observable.combineLatest(
  player$, background$,
  (player, background) => ({ background, player })
);

const renderScene = (actors) => {
  paintStars(actors.background);
  paintSpaceship(actors.player);
};

game$.subscribe(renderScene);

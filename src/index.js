import 'rxjs';
import getBackground from './background';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paintStars = (stars) => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach((star) => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
};

getBackground(canvas.width, canvas.height, 50).subscribe((stars) => {
  paintStars(stars);
});

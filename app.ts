
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Boid {
  point: Point;
  angle: number;
  speed = 1;
  velocity = 10;

  constructor(x: number, y: number, angle: number) {
    this.point = new Point(x, y);
    this.angle = angle;
  }
}

function drawBoid(boid: Boid, context: CanvasRenderingContext2D) {
  const sideLength = 20;

  // get points from triangular boid
  const p1 = { x: boid.point.x, y: boid.point.y };
  const p2 = { x: boid.point.x + sideLength, y: boid.point.y };
  const p3 = { x: boid.point.x + sideLength, y: boid.point.y + sideLength };
   
  // apply rotation to correct angle
  context.translate(boid.point.x, boid.point.y);
  context.rotate(boid.angle);
  context.translate(-boid.point.x, -boid.point.y);
  
  // draw boid
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineTo(p3.x, p3.y);
  context.lineTo(p1.x, p1.y);  
  
  context.lineWidth = 1;
  context.fillStyle = '#8ED6FF';
  context.fill();
  context.strokeStyle = '#666666';
  context.stroke();
  
  // reset transform matrix
  context.setTransform(1, 0, 0, 1, 0, 0)
}

function start() {
  console.log('started');
  let boids: Array<Boid> = [];

  const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  
  if (canvas) {
    const context = canvas.getContext('2d', { alpha: false });
    const canvasWidth = canvas.getBoundingClientRect().width;
    const canvasHeight = canvas.getBoundingClientRect().height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // create some boids
      boids.push(new Boid(100, 100, Math.PI / 4)); // Math.PI / 4
    
      // render them
      boids.forEach(b => drawBoid(b, context));
    
      // update them

    }
  }
}

start();
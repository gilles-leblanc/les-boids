
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(tx: number, ty: number): Point {
    return new Point(this.x - tx, this.y - ty);
  }

  rotate(angle: number): Point {
    return new Point(this.x * Math.cos(angle) - this.y * Math.sin(angle),
                     this.y * Math.cos(angle) + this.x * Math.sin(angle));
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
  
  // rotate points for angle of boid
  const p1p = new Point(p1.x, p1.y).translate(boid.point.x, boid.point.y).rotate(boid.angle).translate(-boid.point.x, -boid.point.y);
  const p2p = new Point(p2.x, p2.y).translate(boid.point.x, boid.point.y).rotate(boid.angle).translate(-boid.point.x, -boid.point.y);
  const p3p = new Point(p3.x, p3.y).translate(boid.point.x, boid.point.y).rotate(boid.angle).translate(-boid.point.x, -boid.point.y);

  // draw boid
  context.moveTo(p1p.x, p1p.y);
  context.lineTo(p2p.x, p2p.y);
  context.lineTo(p3p.x, p3p.y);
  context.lineTo(p1p.x, p1p.y);

  context.lineWidth = 1;
  context.fillStyle = '#8ED6FF';
  context.fill();
  context.strokeStyle = '#666666';
  context.stroke();
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
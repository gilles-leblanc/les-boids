
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

  move() {
    this.point = this.point.translate(this.speed, this.speed);
  }
}

class BoidWorld {
  canvasHeight = 0;
  canvasWidth = 0;
  context: CanvasRenderingContext2D | null = null;
  startStamp: number | undefined;
  boids: Array<Boid> = [];  

  constructor() {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    
    if (canvas) {
      this.context = canvas.getContext('2d', { alpha: false });
      this.canvasWidth = canvas.getBoundingClientRect().width;
      this.canvasHeight = canvas.getBoundingClientRect().height;
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
    }
  }

  clear() {
    if (this.context) {
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
  }

  drawBoid(boid: Boid) {
    if (!this.context) {
      return;
    }

    const sideLength = 20;
  
    // get points from triangular boid
    const p1 = { x: boid.point.x, y: boid.point.y };
    const p2 = { x: boid.point.x + sideLength, y: boid.point.y };
    const p3 = { x: boid.point.x + sideLength, y: boid.point.y + sideLength };
     
    // apply rotation to correct angle
    this.context.translate(boid.point.x, boid.point.y);
    this.context.rotate(boid.angle);
    this.context.translate(-boid.point.x, -boid.point.y);
    
    // draw boid
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.lineTo(p1.x, p1.y);  
    
    this.context.lineWidth = 1;
    this.context.fillStyle = '#8ED6FF';
    this.context.fill();
    this.context.strokeStyle = '#666666';
    this.context.stroke();
    this.context.closePath();
    
    // reset transform matrix
    this.context.setTransform(1, 0, 0, 1, 0, 0)
  }

  updateBoids(timestamp: number) {
    if (!this.startStamp) {
      this.startStamp = timestamp;
    }
  
    if (this.context) {
      this.clear();
      this.boids.forEach(b => b.move());
      this.boids.forEach(b => this.drawBoid(b));
    }
  
    if (timestamp - this.startStamp < 2000) {
      requestAnimationFrame(this.updateBoids.bind(this));
    }
  }

  create() {
    this.clear();

    // create some boids
    this.boids.push(new Boid(100, 100, Math.PI / 4));
    this.boids.push(new Boid(20, 500, 0));
    this.boids.push(new Boid(304, 450, Math.PI / 2));
  
    // render them
    this.boids.forEach(b => this.drawBoid(b));
  
    // update them
    requestAnimationFrame(this.updateBoids.bind(this));
  }
}

let boidWorld = new BoidWorld();
boidWorld.create();
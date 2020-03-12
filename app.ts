
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
  speed = 1.5;
  neighborhood = 100;
  sideLength = 20;

  constructor(x: number, y: number, angle: number) {
    this.point = new Point(x, y);
    this.angle = angle;
  }

  steer(boids: Boid[]) {
    this.cohesion(boids);
    this.align(boids);
    this.avoid(boids);
  }

  /**
   * Steer to move toward the average position of local flockmates.
   * @param boids All the boids in the scene.
   */
  private cohesion(boids: Boid[]) {
    const neighbors = this.getNeighbors(boids);
    
    if (neighbors.length === 0) {
      return;
    }
    
    const avgX = neighbors.reduce((acc, cur) => acc + cur.point.x, 0) / neighbors.length;
    const avgY = neighbors.reduce((acc, cur) => acc + cur.point.y, 0) / neighbors.length;
    
    // if actual position is farther than Z from avg, steer towards avg
    const z = this.neighborhood / 2;
    
    const distance = Math.sqrt(Math.pow(this.point.x - avgX, 2) + Math.pow(this.point.y - avgY, 2));
    if (distance > z) {
      
    }
  }
  
  /**
   * Steer to move toward the average position of local flockmates.
   * @param boids All the boids in the scene.
   */
  private avoid(boids: Boid[]) {
    const neighbors = this.getNeighbors(boids);
    
    if (neighbors.length === 0) {
      return;
    }
    
    const avgX = neighbors.reduce((acc, cur) => acc + cur.point.x, 0) / neighbors.length;
    const avgY = neighbors.reduce((acc, cur) => acc + cur.point.y, 0) / neighbors.length;
    
    // if actual position is close than Z from avg, steer towards avg
    const z = this.neighborhood / 3;
    
    const distance = Math.sqrt(Math.pow(this.point.x - avgX, 2) + Math.pow(this.point.y - avgY, 2));
    if (distance <= z) {
      this.angle += Math.PI / 6;
    }
  }

  /**
   * Steer towards the average heading of local flockmates.
   * @param boids All the boids in the scene.
   */
  private align(boids: Boid[]) {
    const neighbors = this.getNeighbors(boids);

    if (neighbors.length === 0) {
      return;
    }

    const avg = neighbors.reduce((acc, cur) => acc + cur.angle, 0) / neighbors.length;

    this.angle += (avg - this.angle) * 0.1;
  }

  private getNeighbors(boids: Boid[]): Boid[] {
    return boids.filter(b => this.point.x !== b.point.x && 
                             this.point.y !== b.point.y && 
                             b.inNeighborhood(this));
  }

  private inNeighborhood(otherBoid: Boid): boolean {
    // is this.xy in of
    const distance = Math.sqrt(Math.pow((otherBoid.point.x - this.point.x + this.sideLength), 2) +
                               Math.pow((otherBoid.point.y - this.point.y), 2));
    
    return distance <= this.neighborhood;
  }

  move() {
    this.point.x += this.speed * Math.cos(this.angle - (Math.PI / 4));
    this.point.y += this.speed * Math.sin(this.angle - (Math.PI / 4));
  }
}

class BoidWorld {
  canvasHeight = 0;
  canvasWidth = 0;
  context: CanvasRenderingContext2D | null = null;
  startStamp: number | undefined;
  boids: Boid[] = [];  

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

    // get points from triangular boid
    const p1 = { x: boid.point.x, y: boid.point.y };
    const p2 = { x: boid.point.x + boid.sideLength, y: boid.point.y };
    const p3 = { x: boid.point.x + boid.sideLength, y: boid.point.y + boid.sideLength };
     
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
    
    // draw neighborhood
    this.context.beginPath();
    this.context.arc(boid.point.x + boid.sideLength, boid.point.y, boid.neighborhood, 0, 2 * Math.PI);
    this.context.stroke(); 

    // reset transform matrix
    this.context.setTransform(1, 0, 0, 1, 0, 0)
  }

  updateBoids(timestamp: number) {
    if (!this.startStamp) {
      this.startStamp = timestamp;
    }
  
    if (this.context) {
      this.clear();
      this.boids.forEach(b => b.steer(this.boids));
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
    this.boids.push(new Boid(80, 100, Math.PI / 4));
    this.boids.push(new Boid(20, 200, 0));
    this.boids.push(new Boid(304, 450, Math.PI / 2));
  
    // render them
    this.boids.forEach(b => this.drawBoid(b));
  
    // update them
    requestAnimationFrame(this.updateBoids.bind(this));
  }
}

let boidWorld = new BoidWorld();
boidWorld.create();
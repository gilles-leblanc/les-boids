
class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector) {
    this.x += other.x;
    this.y += other.y;
  }

  getAngle(): number {
    const zdVector = { x: 0, y: 1 };
    return Math.atan2(this.x, -this.y) - Math.atan2(zdVector.x, zdVector.y);
  }
}

class Boid {
  location: Vector;
  velocity: Vector;

  neighborhood = 100;
  sideLength = 20;

  constructor(location: Vector, velocity: Vector) {
    this.location = location;
    this.velocity = velocity;
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
    
    const avgX = neighbors.reduce((acc, cur) => acc + cur.location.x, 0) / neighbors.length;
    const avgY = neighbors.reduce((acc, cur) => acc + cur.location.y, 0) / neighbors.length;
    
    // if actual position is farther than Z from avg, steer towards avg
    const z = this.neighborhood / 2;
    
    const distance = Math.sqrt(Math.pow(this.location.x - avgX, 2) + Math.pow(this.location.y - avgY, 2));
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
    
    const avgX = neighbors.reduce((acc, cur) => acc + cur.location.x, 0) / neighbors.length;
    const avgY = neighbors.reduce((acc, cur) => acc + cur.location.y, 0) / neighbors.length;
    
    // if actual position is close than Z from avg, steer towards avg
    const z = this.neighborhood / 3;
    
    const distance = Math.sqrt(Math.pow(this.location.x - avgX, 2) + Math.pow(this.location.y - avgY, 2));
    if (distance <= z) {
      // this.angle += Math.PI / 6;
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

    // const avg = neighbors.reduce((acc, cur) => acc + cur.angle, 0) / neighbors.length;

    // this.angle += (avg - this.angle) * 0.1;
  }

  private getNeighbors(boids: Boid[]): Boid[] {
    return boids.filter(b => this.location.x !== b.location.x && 
                             this.location.y !== b.location.y && 
                             b.inNeighborhood(this));
  }

  private inNeighborhood(otherBoid: Boid): boolean {
    // is this.xy in of
    const distance = Math.sqrt(Math.pow((otherBoid.location.x - this.location.x + this.sideLength), 2) +
                               Math.pow((otherBoid.location.y - this.location.y), 2));
    
    return distance <= this.neighborhood;
  }

  move() {
    this.location.add(this.velocity);
    // this.location.x += this.speed * Math.cos(this.angle - (Math.PI / 4));
    // this.location.y += this.speed * Math.sin(this.angle - (Math.PI / 4));
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
    const p1 = { x: boid.location.x + boid.sideLength / 2, y: boid.location.y };
    const p2 = { x: boid.location.x + boid.sideLength, y: boid.location.y + boid.sideLength };
    const p3 = { x: boid.location.x, y: boid.location.y + boid.sideLength };
     
    // apply rotation to correct angle
    this.context.translate(boid.location.x, boid.location.y);
    this.context.rotate(boid.velocity.getAngle());
    this.context.translate(-boid.location.x, -boid.location.y);
    
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
    this.context.arc(boid.location.x + boid.sideLength / 2, boid.location.y, boid.neighborhood, 0, 2 * Math.PI);
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
      // this.boids.forEach(b => b.steer(this.boids));
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
    this.boids.push(new Boid(new Vector(80, 100), new Vector(1, 0)));
    this.boids.push(new Boid(new Vector(20, 200), new Vector(1, 0)));
    this.boids.push(new Boid(new Vector(304, 450), new Vector(1, 0)));
  
    // render them
    this.boids.forEach(b => this.drawBoid(b));
  
    // update them
    requestAnimationFrame(this.updateBoids.bind(this));
  }
}

let boidWorld = new BoidWorld();
boidWorld.create();
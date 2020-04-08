"use strict";
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };
    Vector.prototype.getAngle = function () {
        var zdVector = { x: 0, y: 1 };
        return Math.atan2(this.x, -this.y) - Math.atan2(zdVector.x, zdVector.y);
    };
    return Vector;
}());
var Boid = (function () {
    function Boid(location, velocity) {
        this.neighborhood = 100;
        this.sideLength = 20;
        this.location = location;
        this.velocity = velocity;
    }
    Boid.prototype.steer = function (boids) {
        this.cohesion(boids);
        this.align(boids);
        this.avoid(boids);
    };
    Boid.prototype.cohesion = function (boids) {
        var neighbors = this.getNeighbors(boids);
        if (neighbors.length === 0) {
            return;
        }
        var avgX = neighbors.reduce(function (acc, cur) { return acc + cur.location.x; }, 0) / neighbors.length;
        var avgY = neighbors.reduce(function (acc, cur) { return acc + cur.location.y; }, 0) / neighbors.length;
        var z = this.neighborhood / 2;
        var distance = Math.sqrt(Math.pow(this.location.x - avgX, 2) + Math.pow(this.location.y - avgY, 2));
        if (distance > z) {
        }
    };
    Boid.prototype.avoid = function (boids) {
        var neighbors = this.getNeighbors(boids);
        if (neighbors.length === 0) {
            return;
        }
        var avgX = neighbors.reduce(function (acc, cur) { return acc + cur.location.x; }, 0) / neighbors.length;
        var avgY = neighbors.reduce(function (acc, cur) { return acc + cur.location.y; }, 0) / neighbors.length;
        var z = this.neighborhood / 3;
        var distance = Math.sqrt(Math.pow(this.location.x - avgX, 2) + Math.pow(this.location.y - avgY, 2));
        if (distance <= z) {
        }
    };
    Boid.prototype.align = function (boids) {
        var neighbors = this.getNeighbors(boids);
        if (neighbors.length === 0) {
            return;
        }
    };
    Boid.prototype.getNeighbors = function (boids) {
        var _this = this;
        return boids.filter(function (b) { return _this.location.x !== b.location.x &&
            _this.location.y !== b.location.y &&
            b.inNeighborhood(_this); });
    };
    Boid.prototype.inNeighborhood = function (otherBoid) {
        var distance = Math.sqrt(Math.pow((otherBoid.location.x - this.location.x + this.sideLength), 2) +
            Math.pow((otherBoid.location.y - this.location.y), 2));
        return distance <= this.neighborhood;
    };
    Boid.prototype.move = function () {
        this.location.add(this.velocity);
    };
    return Boid;
}());
var BoidWorld = (function () {
    function BoidWorld() {
        this.canvasHeight = 0;
        this.canvasWidth = 0;
        this.context = null;
        this.boids = [];
        var canvas = document.getElementById('main-canvas');
        if (canvas) {
            this.context = canvas.getContext('2d', { alpha: false });
            this.canvasWidth = canvas.getBoundingClientRect().width;
            this.canvasHeight = canvas.getBoundingClientRect().height;
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
        }
    }
    BoidWorld.prototype.clear = function () {
        if (this.context) {
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    };
    BoidWorld.prototype.drawBoid = function (boid) {
        if (!this.context) {
            return;
        }
        var p1 = { x: boid.location.x + boid.sideLength / 2, y: boid.location.y };
        var p2 = { x: boid.location.x + boid.sideLength, y: boid.location.y + boid.sideLength };
        var p3 = { x: boid.location.x, y: boid.location.y + boid.sideLength };
        this.context.translate(boid.location.x, boid.location.y);
        this.context.rotate(boid.velocity.getAngle());
        this.context.translate(-boid.location.x, -boid.location.y);
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
        this.context.beginPath();
        this.context.arc(boid.location.x + boid.sideLength / 2, boid.location.y, boid.neighborhood, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    BoidWorld.prototype.updateBoids = function (timestamp) {
        var _this = this;
        if (!this.startStamp) {
            this.startStamp = timestamp;
        }
        if (this.context) {
            this.clear();
            this.boids.forEach(function (b) { return b.move(); });
            this.boids.forEach(function (b) { return _this.drawBoid(b); });
        }
        if (timestamp - this.startStamp < 2000) {
            requestAnimationFrame(this.updateBoids.bind(this));
        }
    };
    BoidWorld.prototype.create = function () {
        var _this = this;
        this.clear();
        this.boids.push(new Boid(new Vector(80, 100), new Vector(1, 0)));
        this.boids.push(new Boid(new Vector(20, 200), new Vector(1, 0)));
        this.boids.push(new Boid(new Vector(304, 450), new Vector(1, 0)));
        this.boids.forEach(function (b) { return _this.drawBoid(b); });
        requestAnimationFrame(this.updateBoids.bind(this));
    };
    return BoidWorld;
}());
var boidWorld = new BoidWorld();
boidWorld.create();

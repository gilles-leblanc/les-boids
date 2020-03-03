"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.translate = function (tx, ty) {
        return new Point(this.x - tx, this.y - ty);
    };
    return Point;
}());
var Boid = (function () {
    function Boid(x, y, angle) {
        this.speed = 1.5;
        this.neighborhood = 100;
        this.sideLength = 20;
        this.point = new Point(x, y);
        this.angle = angle;
    }
    Boid.prototype.align = function (boids) {
        var _this = this;
        var neighbors = boids.filter(function (b) { return _this.point.x !== b.point.x &&
            _this.point.y !== b.point.y &&
            b.inNeighborhood(_this); });
        if (neighbors.length === 0) {
            return 0;
        }
        var avg = neighbors.reduce(function (acc, cur) { return acc + cur.angle; }, 0) / neighbors.length;
        this.angle += (avg - this.angle) * 0.1;
    };
    Boid.prototype.inNeighborhood = function (otherBoid) {
        var distance = Math.sqrt(Math.pow((otherBoid.point.x - this.point.x + this.sideLength), 2) +
            Math.pow((otherBoid.point.y - this.point.y), 2));
        return distance <= this.neighborhood;
    };
    Boid.prototype.move = function () {
        this.point.x += this.speed * Math.cos(this.angle - (Math.PI / 4));
        this.point.y += this.speed * Math.sin(this.angle - (Math.PI / 4));
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
        var p1 = { x: boid.point.x, y: boid.point.y };
        var p2 = { x: boid.point.x + boid.sideLength, y: boid.point.y };
        var p3 = { x: boid.point.x + boid.sideLength, y: boid.point.y + boid.sideLength };
        this.context.translate(boid.point.x, boid.point.y);
        this.context.rotate(boid.angle);
        this.context.translate(-boid.point.x, -boid.point.y);
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
        this.context.arc(boid.point.x + boid.sideLength, boid.point.y, boid.neighborhood, 0, 2 * Math.PI);
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
            this.boids.forEach(function (b) { return b.align(_this.boids); });
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
        this.boids.push(new Boid(80, 100, Math.PI / 4));
        this.boids.push(new Boid(20, 200, 0));
        this.boids.push(new Boid(304, 450, Math.PI / 2));
        this.boids.forEach(function (b) { return _this.drawBoid(b); });
        requestAnimationFrame(this.updateBoids.bind(this));
    };
    return BoidWorld;
}());
var boidWorld = new BoidWorld();
boidWorld.create();

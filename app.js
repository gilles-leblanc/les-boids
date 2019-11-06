"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.translate = function (tx, ty) {
        return new Point(this.x - tx, this.y - ty);
    };
    Point.prototype.rotate = function (angle) {
        return new Point(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.y * Math.cos(angle) + this.x * Math.sin(angle));
    };
    return Point;
}());
var Boid = (function () {
    function Boid(x, y, angle) {
        this.speed = 1;
        this.velocity = 10;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
    return Boid;
}());
function drawBoid(boid, context) {
    var sideLength = 20;
    var p1 = { x: boid.x, y: boid.y };
    var p2 = { x: boid.x + sideLength, y: boid.y };
    var p3 = { x: boid.x + sideLength, y: boid.y + sideLength };
    var p4 = { x: boid.x, y: boid.y + sideLength };
    var p1p = new Point(p1.x, p1.y).translate(boid.x, boid.y).rotate(boid.angle).translate(-boid.x, -boid.y);
    var p2p = new Point(p2.x, p2.y).translate(boid.x, boid.y).rotate(boid.angle).translate(-boid.x, -boid.y);
    var p3p = new Point(p3.x, p3.y).translate(boid.x, boid.y).rotate(boid.angle).translate(-boid.x, -boid.y);
    var p4p = new Point(p4.x, p4.y).translate(boid.x, boid.y).rotate(boid.angle).translate(-boid.x, -boid.y);
    context.moveTo(p1p.x, p1p.y);
    context.lineTo(p1p.x, p1p.y);
    context.lineTo(p2p.x, p2p.y);
    context.lineTo(p3p.x, p3p.y);
    context.lineTo(p4p.x, p4p.y);
    context.lineTo(p1p.x, p1p.y);
    context.lineWidth = 1;
    context.strokeStyle = '#666666';
    context.stroke();
}
function start() {
    console.log('started');
    var boids = [];
    var canvas = document.getElementById('main-canvas');
    if (canvas) {
        var context_1 = canvas.getContext('2d', { alpha: false });
        var canvasWidth = canvas.getBoundingClientRect().width;
        var canvasHeight = canvas.getBoundingClientRect().height;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        if (context_1) {
            context_1.fillStyle = "white";
            context_1.fillRect(0, 0, canvasWidth, canvasHeight);
            boids.push(new Boid(100, 100, Math.PI / 4));
            boids.forEach(function (b) { return drawBoid(b, context_1); });
        }
    }
}
start();

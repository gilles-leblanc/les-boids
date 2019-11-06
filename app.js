"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Boid = (function () {
    function Boid(x, y, angle) {
        this.speed = 1;
        this.velocity = 10;
        this.point = new Point(x, y);
        this.angle = angle;
    }
    return Boid;
}());
function drawBoid(boid, context) {
    var sideLength = 20;
    var p1 = { x: boid.point.x, y: boid.point.y };
    var p2 = { x: boid.point.x + sideLength, y: boid.point.y };
    var p3 = { x: boid.point.x + sideLength, y: boid.point.y + sideLength };
    context.translate(boid.point.x, boid.point.y);
    context.rotate(boid.angle);
    context.translate(-boid.point.x, -boid.point.y);
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p1.x, p1.y);
    context.lineWidth = 1;
    context.fillStyle = '#8ED6FF';
    context.fill();
    context.strokeStyle = '#666666';
    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);
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

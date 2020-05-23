var canvas = document.querySelector('canvas');

var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var context = canvas.getContext('2d'); // we pass a super object that provides a lot of methods for drawing

// context.fillStyle = 'rgba(255, 0, 0, 0.5)';
// context.fillRect(100, 100, 100, 100);
// context.fillStyle = 'rgba(0, 0, 255, 0.5)';
// context.fillRect(400, 100, 100, 100);
// context.fillStyle = 'rgba(0, 255, 0, 0.5)';
// context.fillRect(300, 300, 100, 100);
// console.log(canvas);

// Line
// context.beginPath();
// context.moveTo(50, 300);
// context.lineTo(300, 100);
// context.lineTo(400, 300);
// context.strokeStyle = "#fa34a3";
// // lines are invisible until we call stroke()
// context.stroke();

// Arc (Circle)
// context.beginPath();
// context.arc(300, 300, 30, Math.PI * 2, false);
// context.strokeStyle = 'blue';
// context.stroke();

// for (var i = 0; i < 3; i++) {
//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     context.beginPath();
//     context.arc(x, y, 30, Math.PI * 2, false);
//     context.strokeStyle = 'blue';
//     context.stroke();
// }

var mouse = {
    x: undefined,
    y: undefined
};

var circleAmount = 800;
var maxRadiusMultipler = 15;
var colorArray = [
    '#000303',
    '#A60303',
    '#DE080D',
    '#193B4B',
    '#FFC517',
];

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function () {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    init();
});

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.strokeStyle = 'blue';
        context.fillStyle = this.color;
        context.fill();
    }

    this.update = function () {
        if (this.x + this.radius >= width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius >= height || this.y - this.radius <= 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        if (Math.abs(mouse.x - this.x) < 50
            && Math.abs(mouse.y - this.y) < 50) {
            if (this.radius < this.minRadius * maxRadiusMultipler) {
                this.radius += 1;
            }
        } else if (this.radius > this.minRadius + 1) {
            this.radius -= 1;
        } else {
            this.radius = this.minRadius;
        }

        this.draw();
    }
}

var circleArray = [];

function init() {
    circleArray = [];

    for (var i = 0; i < circleAmount; i++) {
        var radius = Math.random() * 3 + 1;
        var x = Math.random() * (width - radius * 2) + radius;
        var y = Math.random() * (height - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 2;
        var dy = (Math.random() - 0.5) * 2;
        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

function animate() {
    context.clearRect(0, 0, width, height);

    circleArray.forEach(circle => {
        circle.update();
    });

    requestAnimationFrame(animate);
}

init();

animate();
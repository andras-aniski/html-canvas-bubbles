var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.isClose = function (other, maxDistance) {
        return Math.abs(this.x - other.x) < maxDistance
            && Math.abs(this.y - other.y) < maxDistance;
    };
    return Vector;
}());
var Circle = /** @class */ (function () {
    function Circle(x, y, dx, dy, radius, color) {
        this.maxRadiusMultipler = 15;
        this.coordinate = new Vector(x, y);
        this.direction = new Vector(dx, dy);
        this.radius = radius;
        this.baseRadius = radius;
        this.color = color;
    }
    Circle.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.coordinate.x, this.coordinate.y, this.radius, 0, Math.PI * 2, false);
        context.strokeStyle = 'blue';
        context.fillStyle = this.color;
        context.fill();
    };
    Circle.prototype.update = function (context, mouse) {
        if (this.coordinate.x + this.radius >= window.innerWidth || this.coordinate.x - this.radius <= 0) {
            this.direction.x = -this.direction.x;
        }
        if (this.coordinate.y + this.radius >= window.innerHeight || this.coordinate.y - this.radius <= 0) {
            this.direction.y = -this.direction.y;
        }
        this.coordinate.x += this.direction.x;
        this.coordinate.y += this.direction.y;
        if (mouse != null && this.coordinate.isClose(mouse, 50)) {
            if (this.radius < this.baseRadius * this.maxRadiusMultipler) {
                this.radius += 1;
            }
        }
        else if (this.radius > this.baseRadius + 1) {
            this.radius -= 1;
        }
        else {
            this.radius = this.baseRadius;
        }
        this.draw(context);
    };
    return Circle;
}());
var Main = /** @class */ (function () {
    function Main(canvas) {
        var _this = this;
        this.circleAmount = 800;
        this.colorArray = [
            '#000303',
            '#A60303',
            '#DE080D',
            '#193B4B',
            '#FFC517',
        ];
        this.circleArray = [];
        this.onWindowResize = function (event) {
            _this.canvas.width = window.innerWidth;
            _this.canvas.height = window.innerHeight;
            _this.init();
        };
        this.onMouseLeave = function (event) {
            _this.mouse = null;
        };
        this.onMouseEnter = function (event) {
            _this.mouse = new Vector(event.x, event.y);
        };
        this.onMouseMove = function (event) {
            _this.mouse.x = event.x;
            _this.mouse.y = event.y;
        };
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.init();
    }
    Main.prototype.animate = function () {
        var _this = this;
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.circleArray.forEach(function (circle) {
            circle.update(_this.context, _this.mouse);
        });
        window.requestAnimationFrame(function () { return _this.animate(); });
    };
    Main.prototype.init = function () {
        this.setCanvas();
        this.setCircles();
        this.setEventListeners();
    };
    Main.prototype.setCanvas = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Main.prototype.setCircles = function () {
        this.circleArray = [];
        var maxColors = this.colorArray.length;
        for (var i = 0; i < this.circleAmount; i++) {
            var radius = Math.random() * 3 + 1;
            var x = Math.random() * (window.innerWidth - radius * 2) + radius;
            var y = Math.random() * (window.innerHeight - radius * 2) + radius;
            var dx = (Math.random() - 0.5) * 2;
            var dy = (Math.random() - 0.5) * 2;
            var color = this.colorArray[Math.floor(Math.random() * maxColors)];
            this.circleArray.push(new Circle(x, y, dx, dy, radius, color));
        }
    };
    Main.prototype.setEventListeners = function () {
        window.addEventListener('resize', this.onWindowResize);
        this.setMouseHandlers();
    };
    Main.prototype.setMouseHandlers = function () {
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);
        this.canvas.addEventListener('mouseenter', this.onMouseEnter);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
    };
    return Main;
}());
var main = new Main(document.querySelector('canvas'));
main.animate();
//# sourceMappingURL=main.js.map
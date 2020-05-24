class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isClose(other: Vector, maxDistance: number): boolean {
        return Math.abs(this.x - other.x) < maxDistance
            && Math.abs(this.y - other.y) < maxDistance;
    }
}

class Circle {
    private readonly maxRadiusMultipler = 15;

    private coordinate: Vector;
    private direction: Vector;
    private radius: number;
    private baseRadius: number;
    private color: string;

    constructor(x: number, y: number, dx: number, dy: number, radius: number, color: string) {
        this.coordinate = new Vector(x, y);
        this.direction = new Vector(dx, dy);
        this.radius = radius;
        this.baseRadius = radius;
        this.color = color;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.coordinate.x, this.coordinate.y, this.radius, 0, Math.PI * 2, false);
        context.strokeStyle = 'blue';
        context.fillStyle = this.color;
        context.fill();
    }

    update(context: CanvasRenderingContext2D, mouse: Vector) {
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
        } else if (this.radius > this.baseRadius + 1) {
            this.radius -= 1;
        } else {
            this.radius = this.baseRadius;
        }

        this.draw(context);
    }
}

class Main {
    private readonly circleAmount: number = 800;
    private readonly colorArray: Array<string> = [
        '#000303',
        '#A60303',
        '#DE080D',
        '#193B4B',
        '#FFC517',
    ];

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private circleArray: Array<Circle> = [];
    private mouse: Vector;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        this.init();
    }

    public animate() {
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.circleArray.forEach(circle => {
            circle.update(this.context, this.mouse);
        });

        window.requestAnimationFrame(() => this.animate());
    }

    private init() {
        this.setCanvas();
        this.setCircles();
        this.setEventListeners();
    }

    private setCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private setCircles() {
        this.circleArray = [];
        let maxColors: number = this.colorArray.length;

        for (var i = 0; i < this.circleAmount; i++) {
            let radius: number = Math.random() * 3 + 1;
            let x: number = Math.random() * (window.innerWidth - radius * 2) + radius;
            let y: number = Math.random() * (window.innerHeight - radius * 2) + radius;
            let dx: number = (Math.random() - 0.5) * 2;
            let dy: number = (Math.random() - 0.5) * 2;
            let color: string = this.colorArray[Math.floor(Math.random() * maxColors)];
            this.circleArray.push(new Circle(x, y, dx, dy, radius, color));
        }
    }

    private setEventListeners() {
        window.addEventListener('resize', this.onWindowResize);

        this.setMouseHandlers();
    }

    private setMouseHandlers() {
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);
        this.canvas.addEventListener('mouseenter', this.onMouseEnter);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
    }

    private onWindowResize: { (event: Event): void } = (event: Event) => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.init();
    }

    private onMouseLeave: { (event: MouseEvent): void } = (event: MouseEvent) => {
        this.mouse = null;
    }

    private onMouseEnter: { (event: MouseEvent): void } = (event: MouseEvent) => {
        this.mouse = new Vector(event.x, event.y);
    }

    private onMouseMove: { (event: MouseEvent): void } = (event: MouseEvent) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
    }
}

var main = new Main(document.querySelector('canvas'));
main.animate();
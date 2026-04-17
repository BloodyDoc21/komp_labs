const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const PARTICLE_COUNT = 10000;

let gravityOn = true;
let windOn = false;

// =======================
// ЧАСТИЦА
// =======================

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
    }

    update() {

        // гравитация
        if (gravityOn) {
            this.vy += 0.1;
        }

        // ветер (векторное поле)
        if (windOn) {
            const windForce = Math.sin(this.y * 0.01) * 0.2;
            this.vx += windForce;
        }

        // обновление позиции
        this.x += this.vx;
        this.y += this.vy;

        // демпфирование
        this.vx *= 0.99;
        this.vy *= 0.99;

        // границы экрана
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;

        if (this.y > height) {
            this.y = 0;
            this.vy = 0;
        }
    }

    draw() {
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}

// =======================
// СОЗДАНИЕ ЧАСТИЦ
// =======================

const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

// =======================
// АНИМАЦИЯ
// =======================

function animate() {

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";

    for (let p of particles) {
        p.update();
        p.draw();
    }

    requestAnimationFrame(animate);
}

animate();

// =======================
// УПРАВЛЕНИЕ
// =======================

function toggleGravity() {
    gravityOn = !gravityOn;
}

function toggleWind() {
    windOn = !windOn;
}

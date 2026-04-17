const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const imageData = ctx.createImageData(width, height);
const data = imageData.data;

// =====================
// PERLIN NOISE
// =====================

// псевдослучайный градиент
function randomGradient(ix, iy) {
    const random = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
    const angle = random - Math.floor(random);
    return {
        x: Math.cos(angle * 2 * Math.PI),
        y: Math.sin(angle * 2 * Math.PI)
    };
}

// скалярное произведение
function dotGridGradient(ix, iy, x, y) {
    const gradient = randomGradient(ix, iy);
    const dx = x - ix;
    const dy = y - iy;
    return dx * gradient.x + dy * gradient.y;
}

// сглаживающая функция
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// линейная интерполяция
function lerp(a, b, t) {
    return a + t * (b - a);
}

// 2D Perlin
function perlin(x, y) {

    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    const sx = fade(x - x0);
    const sy = fade(y - y0);

    const n0 = dotGridGradient(x0, y0, x, y);
    const n1 = dotGridGradient(x1, y0, x, y);
    const ix0 = lerp(n0, n1, sx);

    const n2 = dotGridGradient(x0, y1, x, y);
    const n3 = dotGridGradient(x1, y1, x, y);
    const ix1 = lerp(n2, n3, sx);

    return lerp(ix0, ix1, sy);
}

// =====================
// МУЛЬТИОКТАВНЫЙ ШУМ
// =====================

function fractalNoise(x, y, octaves = 4) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        total += perlin(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return total / maxValue;
}

// =====================
// ГЕНЕРАЦИЯ
// =====================

function generate(type) {

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let nx = x / 100;
            let ny = y / 100;

            let value = fractalNoise(nx, ny);
            value = (value + 1) / 2; // нормализация 0..1

            let r, g, b;

            if (type === "height") {
                const shade = value * 255;
                r = g = b = shade;

                // освещение по высоте
                const light = 0.7 + value * 0.3;
                r *= light;
                g *= light;
                b *= light;
            }

            else if (type === "wood") {
                const rings = value * 10;
                const wood = Math.abs(Math.sin(rings));
                r = 139 * wood;
                g = 69 * wood;
                b = 19 * wood;
            }

            else if (type === "marble") {
                const marble = Math.sin(x * 0.05 + value * 5);
                const m = (marble + 1) / 2;
                r = g = b = m * 255;
            }

            const index = (y * width + x) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

generate("height");

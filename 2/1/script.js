const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

// создаём буфер изображения
const imageData = ctx.createImageData(width, height);
const data = imageData.data;

// создаём Z-буфер (глубина)
const zBuffer = new Float32Array(width * height);

// заполняем глубину "очень далеко"
for (let i = 0; i < zBuffer.length; i++) {
    zBuffer[i] = Infinity;
}

// установка пикселя
function setPixel(x, y, r, g, b) {
    const index = (y * width + x) * 4;
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255;
}

// edge-функция (из ЛР2)
function edge(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// растеризация одного треугольника
function drawTriangle(v1, v2, v3) {

    const minX = Math.max(0, Math.floor(Math.min(v1.x, v2.x, v3.x)));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(v1.x, v2.x, v3.x)));
    const minY = Math.max(0, Math.floor(Math.min(v1.y, v2.y, v3.y)));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(v1.y, v2.y, v3.y)));

    const area = edge(v1, v2, v3);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {

            const p = {x, y};

            const w0 = edge(v2, v3, p) / area;
            const w1 = edge(v3, v1, p) / area;
            const w2 = edge(v1, v2, p) / area;

            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {

                // интерполяция глубины
                const z = w0 * v1.z + w1 * v2.z + w2 * v3.z;

                const index = y * width + x;

                // Z-тест
                if (z < zBuffer[index]) {

                    zBuffer[index] = z;

                    // визуализация глубины
                    // ближе (z меньше) → ярче
                    const brightness = 255 - z * 200;

                    setPixel(x, y, brightness, brightness, brightness);
                }
            }
        }
    }
}

// сцена из 3 пересекающихся треугольников
const triangles = [

    // дальний
    [
        {x:150, y:100, z:0.9},
        {x:450, y:120, z:0.9},
        {x:300, y:350, z:0.9}
    ],

    // средний
    [
        {x:100, y:200, z:0.5},
        {x:500, y:250, z:0.5},
        {x:250, y:50,  z:0.5}
    ],

    // ближний
    [
        {x:200, y:300, z:0.2},
        {x:550, y:180, z:0.2},
        {x:350, y:50,  z:0.2}
    ]
];

// сортировка по глубине (дальние сначала)
triangles.sort((a, b) => {
    return (a[0].z + a[1].z + a[2].z)/3 -
           (b[0].z + b[1].z + b[2].z)/3;
});

// рендер
for (let t of triangles) {
    drawTriangle(t[0], t[1], t[2]);
}

ctx.putImageData(imageData, 0, 0);

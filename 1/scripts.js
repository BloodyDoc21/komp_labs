// ===============================
// ЗАДАНИЕ 10: КАЛЕЙДОСКОП
// ===============================

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let animFrame = null;


let kaleidoSectors = 8;
let kaleidoBrush = 'circle';
let kaleidoMirror = false;
let kaleidoAngle = 0;
let kaleidoDrawing = false;

function task10() {
    if (animFrame) cancelAnimationFrame(animFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.getElementById('controls').innerHTML = `
        <div>
            <button onclick="setKaleidoBrush('circle')">Круг</button>
            <button onclick="setKaleidoBrush('square')">Квадрат</button>
            <button onclick="setKaleidoBrush('star')">Звезда</button>
        </div>
        <div>
            <label>Сектора:
                <select onchange="setKaleidoSectors(this.value)">
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8" selected>8</option>
                </select>
            </label>
            <button onclick="toggleMirror()">Зеркало: 
                <span id="mirrorStatus">Выкл</span>
            </button>
            <button onclick="saveCanvas()">Сохранить</button>
        </div>
    `;

    canvas.onmousedown = () => kaleidoDrawing = true;
    canvas.onmouseup = () => kaleidoDrawing = false;
    canvas.onmouseleave = () => kaleidoDrawing = false;
    canvas.onmousemove = drawKaleido;

    startKaleidoRotation();
}

// АНИМАЦИЯ ВРАЩЕНИЯ ВСЕГО УЗОРА
function startKaleidoRotation() {
    function rotate() {
        kaleidoAngle += 0.002;
        animFrame = requestAnimationFrame(rotate);
    }
    rotate();
}

function drawKaleido(e) {

    if (!kaleidoDrawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const time = Date.now() * 0.05;

    for (let i = 0; i < kaleidoSectors; i++) {

        const angle = (i * (Math.PI * 2) / kaleidoSectors) + kaleidoAngle;

        ctx.save();

        ctx.translate(cx, cy);
        ctx.rotate(angle);

        let dx = x - cx;
        let dy = y - cy;

        if (kaleidoMirror && i % 2 === 1) {
            dx = -dx;
        }

        ctx.translate(dx, dy);

        ctx.fillStyle = `hsl(${time % 360}, 80%, 60%)`;

        drawBrush();

        ctx.restore();
    }
}

function drawBrush() {

    if (kaleidoBrush === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    else if (kaleidoBrush === 'square') {
        ctx.fillRect(-8, -8, 16, 16);
    }

    else if (kaleidoBrush === 'star') {

        ctx.beginPath();

        for (let i = 0; i < 5; i++) {

            const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const innerAngle = outerAngle + Math.PI / 5;

            const x1 = Math.cos(outerAngle) * 12;
            const y1 = Math.sin(outerAngle) * 12;

            const x2 = Math.cos(innerAngle) * 6;
            const y2 = Math.sin(innerAngle) * 6;

            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);

            ctx.lineTo(x2, y2);
        }

        ctx.closePath();
        ctx.fill();
    }
}

function setKaleidoBrush(brush) {
    kaleidoBrush = brush;
}

function setKaleidoSectors(s) {
    kaleidoSectors = parseInt(s);
}

function toggleMirror() {
    kaleidoMirror = !kaleidoMirror;
    document.getElementById('mirrorStatus').innerText =
        kaleidoMirror ? 'Вкл' : 'Выкл';
}

function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'kaleidoscope.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

window.onload = () => {
    task10();
};  
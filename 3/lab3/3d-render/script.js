const canvas = document.getElementById("canvas");

const renderer = new ShadedRenderer(canvas);
const cube = new Cube();

let angle = 0;
let rotating = false;

// Анимация
function animate() {
    if (rotating) {
        angle += 0.02;
        renderer.setRotation(angle, angle * 0.7, angle * 0.4);
    }

    renderer.render(cube);
    requestAnimationFrame(animate);
}

// Кнопка вращения
document.getElementById("rotateBtn").addEventListener("click", () => {
    rotating = !rotating;
});

// Кнопка сброса
document.getElementById("resetBtn").addEventListener("click", () => {
    rotating = false;
    angle = 0;
    renderer.setRotation(0, 0, 0);
});

// Переключение проекции
document.getElementById("projectionSelect").addEventListener("change", (e) => {
    const aspect = canvas.width / canvas.height;

    if (e.target.value === "perspective") {
        renderer.projectionMatrix = Matrix4.perspective(Math.PI / 3, aspect, 0.1, 100);
    } else {
        renderer.projectionMatrix = Matrix4.orthographic(-2, 2, -2, 2, 0.1, 100);
    }
});

animate();
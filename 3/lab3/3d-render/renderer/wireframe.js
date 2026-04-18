class WireframeRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;

        this.modelMatrix = new Matrix4();

        this.camera = {
            position: new Vector3(0, 0, 5),
            target: new Vector3(0, 0, 0),
            up: new Vector3(0, 1, 0)
        };

        this.viewMatrix = Matrix4.lookAt(
            this.camera.position,
            this.camera.target,
            this.camera.up
        );

        this.projectionMatrix = Matrix4.perspective(
            Math.PI / 3,
            this.width / this.height,
            0.1,
            100
        );
    }

    // Проекция 3D → 2D
    project(v) {
        const mvp = this.projectionMatrix.multiply(
            this.viewMatrix.multiply(this.modelMatrix)
        );

        const clip = mvp.multiplyVector(v);

        if (clip.w === 0) return null;

        const ndc = {
            x: clip.x / clip.w,
            y: clip.y / clip.w,
            z: clip.z / clip.w
        };

        return {
            x: (ndc.x + 1) * 0.5 * this.width,
            y: (1 - (ndc.y + 1) * 0.5) * this.height,
            z: ndc.z
        };
    }

    drawLine(p1, p2) {
        if (!p1 || !p2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = "#0f0";
        this.ctx.stroke();
    }

    render(cube) {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.width, this.height);

        const projected = cube.vertices.map(v => this.project(v));

        cube.edges.forEach(edge => {
            this.drawLine(
                projected[edge[0]],
                projected[edge[1]]
            );
        });
    }

    setRotation(x, y, z) {
        const rx = Matrix4.rotationX(x);
        const ry = Matrix4.rotationY(y);
        const rz = Matrix4.rotationZ(z);

        this.modelMatrix = rz.multiply(ry.multiply(rx));
    }
}
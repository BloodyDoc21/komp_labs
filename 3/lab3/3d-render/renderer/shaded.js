class ShadedRenderer extends SolidRenderer {
    constructor(canvas) {
        super(canvas);
        this.lighting = new Lighting();
    }

    render(cube) {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.zbuffer.clear();

        const mvp = this.projectionMatrix.multiply(
            this.viewMatrix.multiply(this.modelMatrix)
        );

        const transformed = cube.vertices.map(v => mvp.multiplyVector(v));

        const triangles = cube.triangulate();

        triangles.forEach((tri, i) => {
            const faceIndex = Math.floor(i / 2);
            const face = cube.faces[faceIndex];

            // трансформация нормали (упрощённо)
            const normal = face.normal;

            const intensity = this.lighting.calculateIntensity(normal);
            const color = this.lighting.applyLighting(face.color, intensity);

            const p1 = this.projectVec(transformed[tri.v[0]]);
            const p2 = this.projectVec(transformed[tri.v[1]]);
            const p3 = this.projectVec(transformed[tri.v[2]]);

            this.drawTriangle(p1, p2, p3, color);
        });
    }
}
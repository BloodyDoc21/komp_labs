class SolidRenderer extends WireframeRenderer {
    constructor(canvas) {
        super(canvas);
        this.zbuffer = new ZBuffer(canvas.width, canvas.height);
    }

    drawTriangle(p1, p2, p3, color) {
        if (!p1 || !p2 || !p3) return;

        const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x)));
        const maxX = Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x, p3.x)));
        const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y)));
        const maxY = Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y, p3.y)));

        const edge = (a,b,c) => (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x);

        const area = edge(p1, p2, p3);
        if (Math.abs(area) < 0.0001) return;

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {

                const p = {x,y};

                const w0 = edge(p2, p3, p);
                const w1 = edge(p3, p1, p);
                const w2 = edge(p1, p2, p);

                const a = w0 / area;
                const b = w1 / area;
                const c = w2 / area;

                if (a >= 0 && b >= 0 && c >= 0) {
                    const z = a*p1.z + b*p2.z + c*p3.z;

                    if (this.zbuffer.testAndSet(x, y, z)) {
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
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

        triangles.forEach(tri => {
            const p1 = this.projectVec(transformed[tri.v[0]]);
            const p2 = this.projectVec(transformed[tri.v[1]]);
            const p3 = this.projectVec(transformed[tri.v[2]]);

            this.drawTriangle(p1, p2, p3, tri.color);
        });
    }

    projectVec(v) {
        if (v.w === 0) return null;

        const ndc = {
            x: v.x / v.w,
            y: v.y / v.w,
            z: v.z / v.w
        };

        return {
            x: (ndc.x + 1) * 0.5 * this.width,
            y: (1 - (ndc.y + 1) * 0.5) * this.height,
            z: ndc.z
        };
    }
}
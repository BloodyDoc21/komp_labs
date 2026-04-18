class Lighting {
    constructor() {
        this.ambient = 0.2;
        this.diffuse = 0.8;

        // направление света
        this.lightDir = new Vector3(1, 1, 1).normalize();
    }

    calculateIntensity(normal) {
        const dot = Math.max(0, normal.dot(this.lightDir));
        return this.ambient + this.diffuse * dot;
    }

    applyLighting(color, intensity) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const nr = Math.floor(r * intensity);
        const ng = Math.floor(g * intensity);
        const nb = Math.floor(b * intensity);

        return `rgb(${nr}, ${ng}, ${nb})`;
    }
}
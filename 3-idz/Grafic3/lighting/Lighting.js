import { Vector3 } from '../math/Vector3.js';  // ✅ правильно

export class Lighting {
    constructor() {
        this.ambient = 0.3;
        this.diffuse = 0.7;
        this.lightDir = new Vector3(1, 1, 1).normalize();
    }

    calculateIntensity(normal) {
        const dot = Math.max(0, normal.dot(this.lightDir));
        return Math.min(1, this.ambient + this.diffuse * dot);
    }

    applyLighting(color, intensity) {
        let r, g, b;
        if (color.startsWith('#')) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } else {
            r = g = b = 200;
        }
        r = Math.floor(r * intensity);
        g = Math.floor(g * intensity);
        b = Math.floor(b * intensity);
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        return `rgb(${r}, ${g}, ${b})`;
    }

    setLightDirection(x, y, z) {
        this.lightDir = new Vector3(x, y, z).normalize();
    }
}
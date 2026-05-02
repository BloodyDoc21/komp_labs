import { Vector3 } from '../math/Vector3.js';  // ✅ правильно

export class Cube {
    constructor() {
        this.vertices = [
            new Vector3(-1, -1, -1),
            new Vector3(1, -1, -1),
            new Vector3(1, 1, -1),
            new Vector3(-1, 1, -1),
            new Vector3(-1, -1, 1),
            new Vector3(1, -1, 1),
            new Vector3(1, 1, 1),
            new Vector3(-1, 1, 1)
        ];

        this.faces = [
            { vertices: [0, 1, 2, 3], color: '#ff4444', name: 'задняя' },
            { vertices: [4, 5, 6, 7], color: '#44ff44', name: 'передняя' },
            { vertices: [0, 4, 7, 3], color: '#4444ff', name: 'левая' },
            { vertices: [1, 5, 6, 2], color: '#ffff44', name: 'правая' },
            { vertices: [0, 1, 5, 4], color: '#ff44ff', name: 'нижняя' },
            { vertices: [3, 2, 6, 7], color: '#44ffff', name: 'верхняя' }
        ];

        this.faces = this.faces.map(face => {
            const v0 = this.vertices[face.vertices[0]];
            const v1 = this.vertices[face.vertices[1]];
            const v2 = this.vertices[face.vertices[2]];
            const edge1 = v1.subtract(v0);
            const edge2 = v2.subtract(v0);
            const normal = edge1.cross(edge2).normalize();
            return { ...face, normal };
        });
    }

    triangulate() {
        const triangles = [];
        this.faces.forEach(face => {
            const v0 = this.vertices[face.vertices[0]];
            const v1 = this.vertices[face.vertices[1]];
            const v2 = this.vertices[face.vertices[2]];
            const v3 = this.vertices[face.vertices[3]];
            triangles.push({ vertices: [v0, v1, v2], color: face.color, normal: face.normal });
            triangles.push({ vertices: [v0, v2, v3], color: face.color, normal: face.normal });
        });
        return triangles;
    }

    getEdges() {
        return [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
    }
}
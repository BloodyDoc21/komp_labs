import { Vector3 } from '../math/Vector3.js';  // ✅ правильно

export class Pyramid {
    constructor() {
        this.vertices = [
            new Vector3(-1, -1, -1),
            new Vector3(1, -1, -1),
            new Vector3(1, -1, 1),
            new Vector3(-1, -1, 1),
            new Vector3(0, 1, 0)
        ];

        this.faces = [
            { vertices: [0, 1, 4], color: '#ff4444', name: 'передняя' },
            { vertices: [1, 2, 4], color: '#44ff44', name: 'правая' },
            { vertices: [2, 3, 4], color: '#4444ff', name: 'задняя' },
            { vertices: [3, 0, 4], color: '#ffff44', name: 'левая' },
            { vertices: [0, 3, 2, 1], color: '#ff44ff', name: 'основание' }
        ];

        this.faces = this.faces.map(face => {
            const v0 = this.vertices[face.vertices[0]];
            const v1 = this.vertices[face.vertices[1]];
            const v2 = this.vertices[face.vertices[2]];
            const edge1 = v1.subtract(v0);
            const edge2 = v2.subtract(v0);
            let normal = edge1.cross(edge2).normalize();
            
            if (face.vertices.length === 4) {
                normal = new Vector3(0, -1, 0);
            }
            return { ...face, normal };
        });
    }

    triangulate() {
        const triangles = [];
        this.faces.forEach(face => {
            if (face.vertices.length === 4) {
                const v0 = this.vertices[face.vertices[0]];
                const v1 = this.vertices[face.vertices[1]];
                const v2 = this.vertices[face.vertices[2]];
                const v3 = this.vertices[face.vertices[3]];
                triangles.push({ vertices: [v0, v1, v2], color: face.color, normal: face.normal });
                triangles.push({ vertices: [v0, v2, v3], color: face.color, normal: face.normal });
            } else {
                const v0 = this.vertices[face.vertices[0]];
                const v1 = this.vertices[face.vertices[1]];
                const v2 = this.vertices[face.vertices[2]];
                triangles.push({ vertices: [v0, v1, v2], color: face.color, normal: face.normal });
            }
        });
        return triangles;
    }

    getEdges() {
        return [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [0, 4], [1, 4], [2, 4], [3, 4]
        ];
    }
}
import { Matrix4 } from '../math/Matrix4.js';
import { Vector3 } from '../math/Vector3.js';
import { ZBuffer } from './ZBuffer.js';

export class SolidRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.modelMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = Matrix4.perspective(Math.PI / 3, this.width / this.height, 0.1, 100);
        this.zbuffer = new ZBuffer(this.width, this.height);
        
        this.camera = {
            position: new Vector3(0, 2, 5),
            target: new Vector3(0, 0, 0),
            up: new Vector3(0, 1, 0)
        };
        
        this.updateViewMatrix();
    }
    
    updateViewMatrix() {
        this.viewMatrix = Matrix4.lookAt(this.camera.position, this.camera.target, this.camera.up);
    }
    
    setRotation(angleX, angleY, angleZ) {
        const rotX = Matrix4.rotationX(angleX);
        const rotY = Matrix4.rotationY(angleY);
        const rotZ = Matrix4.rotationZ(angleZ);
        this.modelMatrix = rotZ.multiply(rotY.multiply(rotX));
    }
    
    setProjection(type, aspect) {
        if (type === 'perspective') {
            this.projectionMatrix = Matrix4.perspective(Math.PI / 3, aspect, 0.1, 100);
        } else {
            this.projectionMatrix = Matrix4.orthographic(-2.5, 2.5, -2.5, 2.5, 0.1, 100);
        }
    }
    
    project(vertex) {
        const mvp = this.projectionMatrix.multiply(this.viewMatrix.multiply(this.modelMatrix));
        const clip = mvp.multiplyVector(vertex);
        
        if (Math.abs(clip.w) < 0.001) return null;
        
        const ndc = {
            x: clip.x / clip.w,
            y: clip.y / clip.w,
            z: clip.z / clip.w
        };
        
        const screenX = (ndc.x + 1) * 0.5 * this.width;
        const screenY = (1 - (ndc.y + 1) * 0.5) * this.height;
        
        return { x: screenX, y: screenY, z: ndc.z };
    }
    
    barycentric(p, p1, p2, p3) {
        const area = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
        if (Math.abs(area) < 0.0001) return null;
        const w1 = ((p2.x - p.x) * (p3.y - p.y) - (p2.y - p.y) * (p3.x - p.x)) / area;
        const w2 = ((p3.x - p.x) * (p1.y - p.y) - (p3.y - p.y) * (p1.x - p.x)) / area;
        const w3 = 1 - w1 - w2;
        if (w1 >= 0 && w2 >= 0 && w3 >= 0) return { w1, w2, w3 };
        return null;
    }
    
    drawTriangle(v1, v2, v3, color) {
        const p1 = this.project(v1);
        const p2 = this.project(v2);
        const p3 = this.project(v3);
        
        if (!p1 || !p2 || !p3) return;
        
        const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x)));
        const maxX = Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x, p3.x)));
        const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y)));
        const maxY = Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y, p3.y)));
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const bary = this.barycentric({ x, y }, p1, p2, p3);
                if (bary) {
                    const z = bary.w1 * p1.z + bary.w2 * p2.z + bary.w3 * p3.z;
                    if (this.zbuffer.testAndSet(x, y, z)) {
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
    }
    
    drawAxes() {
        const mvp = this.projectionMatrix.multiply(this.viewMatrix);
        
        const project = (v) => {
            const clip = mvp.multiplyVector(v);
            if (Math.abs(clip.w) < 0.001) return null;
            const ndc = { x: clip.x / clip.w, y: clip.y / clip.w };
            const screenX = (ndc.x + 1) * 0.5 * this.width;
            const screenY = (1 - (ndc.y + 1) * 0.5) * this.height;
            return { x: screenX, y: screenY };
        };
        
        const origin = project(new Vector3(0, 0, 0));
        const xAxis = project(new Vector3(2, 0, 0));
        const yAxis = project(new Vector3(0, 2, 0));
        const zAxis = project(new Vector3(0, 0, 2));
        
        if (origin && xAxis) {
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(xAxis.x, xAxis.y);
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.stroke();
        }
        if (origin && yAxis) {
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(yAxis.x, yAxis.y);
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.stroke();
        }
        if (origin && zAxis) {
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(zAxis.x, zAxis.y);
            this.ctx.strokeStyle = '#0000ff';
            this.ctx.stroke();
        }
    }
    
    render(model, drawAxesFlag = false) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.zbuffer.clear();
        
        if (drawAxesFlag) {
            this.drawAxes();
        }
        
        const triangles = model.triangulate();
        triangles.forEach(triangle => {
            this.drawTriangle(
                triangle.vertices[0],
                triangle.vertices[1],
                triangle.vertices[2],
                triangle.color
            );
        });
    }
}
import { Matrix4 } from '../math/Matrix4.js';
import { Vector3 } from '../math/Vector3.js';

export class WireframeRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.modelMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = Matrix4.perspective(Math.PI / 3, this.width / this.height, 0.1, 100);
        
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
    
    drawLine(p1, p2, color = '#0f0') {
        if (!p1 || !p2) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawAxes() {
        const origin = this.project(new Vector3(0, 0, 0));
        const xAxis = this.project(new Vector3(2, 0, 0));
        const yAxis = this.project(new Vector3(0, 2, 0));
        const zAxis = this.project(new Vector3(0, 0, 2));
        
        if (origin && xAxis) this.drawLine(origin, xAxis, '#ff0000');
        if (origin && yAxis) this.drawLine(origin, yAxis, '#00ff00');
        if (origin && zAxis) this.drawLine(origin, zAxis, '#0000ff');
    }
    
    render(model, drawAxesFlag = false) {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const projected = model.vertices.map(v => this.project(v));
        
        if (drawAxesFlag) {
            this.drawAxes();
        }
        
        const edges = model.getEdges();
        edges.forEach(edge => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];
            this.drawLine(p1, p2, '#0f0');
        });
    }
}
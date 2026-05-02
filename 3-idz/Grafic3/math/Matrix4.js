import { Vector3 } from './Vector3.js';

export class Matrix4 {
    constructor() {
        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    multiply(b) {
        const result = new Matrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.m[i][j] =
                    this.m[i][0] * b.m[0][j] +
                    this.m[i][1] * b.m[1][j] +
                    this.m[i][2] * b.m[2][j] +
                    this.m[i][3] * b.m[3][j];
            }
        }
        return result;
    }

    multiplyVector(v) {
        const x = this.m[0][0] * v.x + this.m[0][1] * v.y + this.m[0][2] * v.z + this.m[0][3];
        const y = this.m[1][0] * v.x + this.m[1][1] * v.y + this.m[1][2] * v.z + this.m[1][3];
        const z = this.m[2][0] * v.x + this.m[2][1] * v.y + this.m[2][2] * v.z + this.m[2][3];
        const w = this.m[3][0] * v.x + this.m[3][1] * v.y + this.m[3][2] * v.z + this.m[3][3];
        return { x, y, z, w };
    }

    static rotationX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Matrix4();
        m.m[1][1] = c;
        m.m[1][2] = -s;
        m.m[2][1] = s;
        m.m[2][2] = c;
        return m;
    }

    static rotationY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Matrix4();
        m.m[0][0] = c;
        m.m[0][2] = s;
        m.m[2][0] = -s;
        m.m[2][2] = c;
        return m;
    }

    static rotationZ(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Matrix4();
        m.m[0][0] = c;
        m.m[0][1] = -s;
        m.m[1][0] = s;
        m.m[1][1] = c;
        return m;
    }

    static perspective(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const m = new Matrix4();
        m.m[0][0] = f / aspect;
        m.m[1][1] = f;
        m.m[2][2] = (far + near) / (near - far);
        m.m[2][3] = (2 * far * near) / (near - far);
        m.m[3][2] = -1;
        m.m[3][3] = 0;
        return m;
    }

    static orthographic(left, right, bottom, top, near, far) {
        const m = new Matrix4();
        m.m[0][0] = 2 / (right - left);
        m.m[1][1] = 2 / (top - bottom);
        m.m[2][2] = -2 / (far - near);
        m.m[0][3] = -(right + left) / (right - left);
        m.m[1][3] = -(top + bottom) / (top - bottom);
        m.m[2][3] = -(far + near) / (far - near);
        return m;
    }

    static lookAt(eye, target, up) {
        const z = eye.subtract(target).normalize();
        const x = up.cross(z).normalize();
        const y = z.cross(x).normalize();

        const m = new Matrix4();
        m.m[0][0] = x.x;
        m.m[0][1] = x.y;
        m.m[0][2] = x.z;
        m.m[0][3] = -x.dot(eye);
        m.m[1][0] = y.x;
        m.m[1][1] = y.y;
        m.m[1][2] = y.z;
        m.m[1][3] = -y.dot(eye);
        m.m[2][0] = z.x;
        m.m[2][1] = z.y;
        m.m[2][2] = z.z;
        m.m[2][3] = -z.dot(eye);
        return m;
    }
}
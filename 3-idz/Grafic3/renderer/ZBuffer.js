export class ZBuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.clear();
    }

    clear() {
        this.buffer = new Array(this.width * this.height).fill(1.0);
    }

    testAndSet(x, y, z) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        const index = y * this.width + x;
        if (z < this.buffer[index]) {
            this.buffer[index] = z;
            return true;
        }
        return false;
    }
}
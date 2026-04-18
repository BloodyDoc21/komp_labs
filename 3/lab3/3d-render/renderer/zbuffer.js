class ZBuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = new Array(width * height);
        this.clear();
    }

    clear() {
        this.buffer.fill(1.0); // дальняя плоскость
    }

    testAndSet(x, y, z) {
        x = Math.floor(x);
        y = Math.floor(y);

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

        const i = y * this.width + x;

        if (z < this.buffer[i]) {
            this.buffer[i] = z;
            return true;
        }
        return false;
    }
}
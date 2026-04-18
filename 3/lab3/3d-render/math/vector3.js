class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Сложение
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // Вычитание
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // Умножение на скаляр
    multiplyScalar(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    // Деление на скаляр
    divideScalar(s) {
        if (s === 0) return new Vector3(0, 0, 0);
        return new Vector3(this.x / s, this.y / s, this.z / s);
    }

    // Длина
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Нормализация
    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3(0, 0, 0);
        return this.divideScalar(len);
    }

    // Скалярное произведение
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // Векторное произведение
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    // Копия
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}
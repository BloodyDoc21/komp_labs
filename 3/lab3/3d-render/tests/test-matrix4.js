console.log("=== Matrix4 Test ===");

const v = new Vector3(1, 0, 0);

const rot = Matrix4.rotationY(Math.PI / 4);
const trans = Matrix4.translation(10, 0, 0);

const result = rot.multiply(trans).multiplyVector(v);

console.log("Transformed:", result);
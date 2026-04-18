console.log("=== Vector3 Test ===");

const v1 = new Vector3(1, 2, 3);
const v2 = new Vector3(4, 5, 6);

console.log("add:", v1.add(v2));
console.log("subtract:", v1.subtract(v2));
console.log("dot:", v1.dot(v2));
console.log("cross:", v1.cross(v2));
console.log("length:", v1.length());
console.log("normalize:", v1.normalize());
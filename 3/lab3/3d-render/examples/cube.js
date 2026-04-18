class Cube {
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

        this.edges = [
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
        ];

        // Грани
        this.faces = [
    { v: [0,1,2,3], color: "#ff0000" },
    { v: [4,5,6,7], color: "#00ff00" },
    { v: [0,4,7,3], color: "#0000ff" },
    { v: [1,5,6,2], color: "#ffff00" },
    { v: [0,1,5,4], color: "#ff00ff" },
    { v: [3,2,6,7], color: "#00ffff" }
].map(face => {
    const v0 = this.vertices[face.v[0]];
    const v1 = this.vertices[face.v[1]];
    const v2 = this.vertices[face.v[2]];

    const edge1 = v1.subtract(v0);
    const edge2 = v2.subtract(v0);

    const normal = edge1.cross(edge2).normalize();

    return { ...face, normal };
});
    }

    triangulate() {
        const tris = [];

        this.faces.forEach(face => {
            const [a,b,c,d] = face.v;

            tris.push({ v:[a,b,c], color: face.color });
            tris.push({ v:[a,c,d], color: face.color });
        });

        return tris;
    }
}
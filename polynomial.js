const fs = require('fs');

const fileName = process.argv[2];
if (!fileName) {
    console.error("Usage: node polynomial.js <input.json>");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

const n = data.keys.n;
const k = data.keys.k;

let points = [];

for (let key in data) {
    if (key !== "keys") {
        let x = BigInt(key); // x is the root
        let base = parseInt(data[key].base);
        let valueStr = data[key].value;
        let y = BigInt(parseInt(valueStr, base));

        points.push({ x, y });
    }
}

console.log("Decoded Points (x, y):");
points.forEach(p => {
    console.log(`(${p.x}, ${p.y})`);
});

let [p1, p2, p3] = points;

function solveQuadraticCoefficients(p1, p2, p3) {
    let [x1, y1] = [p1.x, p1.y];
    let [x2, y2] = [p2.x, p2.y];
    let [x3, y3] = [p3.x, p3.y];

    let denom = (x1 - x2) * (x1 - x3) * (x2 - x3);

    let a = ((y1 * (x2 - x3)) + (y2 * (x3 - x1)) + (y3 * (x1 - x2))) / denom;
    let b = ((y1 * (x3 ** 2n - x2 ** 2n)) + (y2 * (x1 ** 2n - x3 ** 2n)) + (y3 * (x2 ** 2n - x1 ** 2n))) / denom;
    let c = ((y1 * (x2 * x3 * (x2 - x3))) + (y2 * (x3 * x1 * (x3 - x1))) + (y3 * (x1 * x2 * (x1 - x2)))) / denom;

    return { a, b, c };
}

let { a, b, c } = solveQuadraticCoefficients(p1, p2, p3);

console.log(`\nSecret Constant c = ${c.toString()}`);

const rawObject = {
  a: {
    c: {
      e: {
        g: 400,
      },
      f: 300,
    },
    d: 200,
  },
  b: 100,
};
const number = 0;
const arr = [];
function num(data) {
  for (const value of Object.values(data)) {
    if (typeof value === typeof number) {
      arr.push(value);
    } else {
      num(value);
    }
  }
}
num(rawObject);

const result = arr.reduce((prev, curr) => prev + curr);
console.log(result);

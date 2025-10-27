const { Suspense } = require("react");

let suma = 10 + 5; // 15
let producto = 20 * 2; // 40
if (suma > 20) {
  console.log("La suma es mayor que 20");
}
else {
  console.log("La suma es menor o igual a 20");
}

if (producto > 30) {
    console.log ("el producto es mayor que 30");
}
else {
    console.log ("el producto es menor que 30");
}
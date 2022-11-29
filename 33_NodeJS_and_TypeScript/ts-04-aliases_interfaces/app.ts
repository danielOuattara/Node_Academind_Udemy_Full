const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button") as HTMLButtonElement;

const numResult: number[] = [];
const textResult: string[] = [];

type NumberOrString = number | string;
type Result = { value: number; timestamp: Date };

interface ResultObject {
  value: number;
  timestamp: Date;
}

function add(num1: NumberOrString, num2: NumberOrString) {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return `${num1} + ${num2}`;
  } else {
    return Number(num1) + Number(num2);
  }
}

function printResult(resultObj: Result) {
  console.log(resultObj.value);
}

function printResult_2(resultObj: ResultObject) {
  console.log(resultObj.value);
}

buttonElement.addEventListener("click", () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(num1, num2);
  numResult.push(result as number);
  const stringResult = add(num1, num2);
  textResult.push(stringResult as string);
  printResult({ value: result as number, timestamp: new Date() });
});

console.log(add(1, 6));

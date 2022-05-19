/*  Error thrown but not handle 
--------------------------------------*/
// const sum = (a, b) => {
//   if (a && b) return a + b;
//   throw new Error("Invalid Arguments");
// };

// console.log(sum(2, 3));
// console.log(sum(3));

/*  Error thrown And handled 
--------------------------------------*/
const sum = (a, b) => {
  try {
    if (a && b) {
      return console.log(a + b);
    }
    throw new Error("Invalid Arguments");
  } catch (error) {
    console.log(error.message);
  }
};

sum(2, 3);
sum(3);

console.log("This still executes ! ;)");

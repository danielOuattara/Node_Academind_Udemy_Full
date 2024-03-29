// spread, rest, destructuring
//-------------------------------------------------------------------
const person = {
  name: "Daniel",
  age: 38,
  greet_1: function () {
    console.log("Hello I 'am " + this.name);
  },
  greet_2: () => {
    console.log("Hello I 'am " + this.name); // undefined
  },
  greet_3() {
    console.log("Hello I 'am " + this.name);
  },
};

console.log({ ...person });

person.greet_1();
person.greet_2();
person.greet_3();

//-------------------------------------------------------------------
const hobbies = ["swimming", "dance", "biking"];
console.log(...hobbies);
const newHobbies = [...hobbies]; // copy array to new array
console.log(newHobbies);

//-------------------------------------------------------------------
const toArray = (...args) => {
  console.log(args);
};

toArray(1, 2, 3, 4);
toArray(1, 2, 3, 4, 5, 6, 7);

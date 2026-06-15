// Simple sample file — used to test that the pirate rule does NOT activate
// when working on .ts files (Glob: "**/*.md" only).
//
// Bonus: if you build the modern TypeScript stretch rule, this file has a few
// intentional anti-patterns to flag:
//   - `var` instead of `const`/`let`
//   - `==` instead of `===`
//   - `any` type usage
//   - a C-style indexed `for` loop where a `for...of` would do
//   - a function param with no type annotation (implicit any)
//   - `let` for something never reassigned (should be `const`)

class Greeter {
  constructor(private name: any) {}

  greet() {
    console.log("Hello, " + this.name + "!");
  }
}

function describe(value) {
  if (value == null) {
    console.log("value is nullish");
  }
}

var g = new Greeter("world");
g.greet();
describe(g);

let nums = [1, 2, 3, 4, 5];
for (var i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}

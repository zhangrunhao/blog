console.log(111)
debugger
console.log(2222)
debugger;

setTimeout(() => {
  console.log('timeout')
  debugger
}, 10);
console.log('hello');
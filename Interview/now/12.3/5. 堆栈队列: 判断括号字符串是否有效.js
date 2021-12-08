var s = "(((((()*)(*)*))())())(()())())))((**)))))(()())()"

arr = s.split("");
console.log(arr.length)
console.log(s.length)
arr.forEach((element, index) => {
  if (element !== s[index]) {
    console.log(element)
    console.log(s[index])
  }
});
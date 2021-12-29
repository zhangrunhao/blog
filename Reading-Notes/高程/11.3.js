console.log("script start")

function foo() {
  new Promise((resolve, reject) => {
    setTimeout(reject, 1000, "bar")
  })
}

foo()

console.log("script end")  
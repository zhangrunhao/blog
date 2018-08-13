var obj = {
  say: () => {
    console.dir(this)
    // console.log(this === global)
  }
}

obj.say()
function to(string) {
  var converted = string
    // close path for polygon
    .replace(/(<polygon[\w\W]+?)points=(["'])([\.\d- ]+?)(["'])/g, "$1d=$2M$3z$4")
    // dont close path for polyline
    .replace(/(<polyline[\w\W]+?)points=(["'])([\.\d-, ]+?)(["'])/g, "$1d=$2M$3$4")
    .replace(/poly(gon|line)/g, "path")
  ;
  return converted;
} 


const string = '<svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 269.2 400.1" enable-background="new 0 0 269.2 400.1" xml:space="preserve"><polyline fill="#FFFF00" points="58.8,360.4 70.7,372.2 89,382.3 103.2,387.2 99.7,464.5 94.5,462.6 86.7,461.3 80.2,462.3 72,465.6 58.8,360.4 "/><polyline fill="#FFFF00" points="159.1,387.4 173.8,382.9 190.4,375.8 203.5,367.1 190.3,465.2 184.1,462.7 176.5,461.9 169.9,462.6 162.5,464.1 159.1,387.4 "/></svg>'

console.log(to(string))
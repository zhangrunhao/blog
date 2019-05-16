// 贪婪算法
var statesNeeded = new Set(['mt', 'wa', 'or', 'id', 'nv', 'ut', 'ca', 'az'])
var stations = {
  kone: new Set(['id', 'nv', 'ut']),
  ktwo: new Set(['wa', 'id', 'mt']),
  kthree: new Set(['or', 'nv', 'ca']),
  kfour: new Set(['nv', 'ut']),
  kfive: new Set(['ca', 'az'])
}
var finalStations = new Set()

while (statesNeeded.size) {
  var bestStation = null
  var statesCovered = new Set()
  for (var station in stations) {
    var states = stations[station]
    var corved = new Set([...statesNeeded].filter(x => states.has(x)))
    if (corved.size > statesCovered.size) {
      bestStation = station
      statesCovered = corved
    }
  }
  statesNeeded = new Set([...statesNeeded].filter(x => !statesCovered.has(x)))
  finalStations.add(bestStation)
}

console.log(finalStations)


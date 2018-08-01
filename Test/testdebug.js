var obj = [{
    id: 1,
    parent: null
  },
  {
    id: 2,
    parent: 1
  },
  {
    id: 3,
    parent: 2
  }
]

var obj2 = {
  obj: {
    id: 1,
    parent: null,
    child: {
      id: 2,
      parent: 1,
      child: {
        id: 3,
        parent: 2
      }
    }
  }
}


function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (typeof value === 'object' && value !== null) {
    let ret = {};
    for (let key in value) {
      ret[key] = value[key]
    }
    return ret;
  } else {
    return value;
  }
}
// const ret = obj.reduce((result,current,i) => {
//   result.child = current;
//   return current;
// })
function reverseDfs(nodes, parent = null) {
  nodes = clone(nodes);
  if (!nodes) {
    return
  }
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }
  let result = null; //存放返回结果的指针
  let pointer = null; //存放当前数组元素的指针
  while (nodes.length) {
    const found = nodes.find((node) => node.parent === parent);
    if (!found) {
      return result;
    }
    let delIndex = nodes.indexOf(found);
    nodes.splice(delIndex, 1);
    if (parent === null) {
      result = found;
      pointer = found;
      parent = found.id;
    } else {
      pointer.child = found;
      pointer = found;
      parent = found.id;
    }
  }
  return result;
}

res = reverseDfs(obj)

function toTree(list) {
  const root = Object.assign({}, list.find(item => item.parent === null))
  setChild(root, list)
  return root
}

function setChild(obj, list) {
  debugger
  var child = list.find(item => item.parent === obj.id)
  if (child) {
    obj.child = child
    return setChild(child, list)
  }
}
var objRees = toTree(obj)
debugger
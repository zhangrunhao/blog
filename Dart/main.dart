

// 变量声明
var name = "this is name";
var year = 1997;
var antennaDiameter = 3.7;
var flybyObjects = ['aaa', 'bbb', 'ccc', 'dddd'];
var image = {
  'tags': ['tag1', 'tag2'],
  'url': '//path/to/aaa.jpg',
};
int testVariables() {
  print(name);
  print(year);
  print(antennaDiameter);
  print(flybyObjects);
  print(image);
}



int controlFlowStatements() {
  if (year >= 2001) {
    print('21st century');
  } else if (year >= 1901) {
    print('20th century');
  }

  for (var object in flybyObjects) {
    print(object);
  }

  for (int month = 1; month <= 12; month++) {
    print(month);
  }

  while(year < 2016) {
    print(year);
    year += 1;
  }
}

// 函数
int fibonacci (int n) {
  if (n == 0 || n == 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}


void main() {
  // testVariables();
  // controlFlowStatements();
  var result = fibonacci(20);
  print(result);
  return;
}

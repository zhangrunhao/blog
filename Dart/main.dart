

// 变量声明
var name = "this is name";
var year = 1997;
var antennaDiameter = 3.7;
var flybyObjects = ['aaa', 'bbb', 'ccc', 'dddd'];
var image = {
  'tags': ['tag1', 'tag2'],
  'url': '//path/to/aaa.jpg',
};



void main() {
  // print(name);
  // print(year);
  // print(antennaDiameter);
  // print(flybyObjects);
  // print(image);

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
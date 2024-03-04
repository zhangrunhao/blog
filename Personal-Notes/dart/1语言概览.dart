class Person {
  Person();
  String greet(String who) => '';
}

class Impostor implements Person {
  String get _name => 'aa';

  @override
  String greet(String who) {
    return 'aaabb';
  }
}

class Television {
  void turnOn() {
    // ... jj
  }
}

class SmartTelevision extends Television {
  void turnOn() {
    super.turnOn();
    // ...
  }
}

enum Color {
  red,
  green,
  blue
}

mixin Musical {
  bool flag  = false;
  void judge() {
    if (flag) print("start");
    print("end");
  }
}
void main(List<String> args) {
  print(Color.blue);
}

// class Vector {
//   final int x, y;
//   const Vector(this.x, this.y);
//   Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
//   Vector operator -(Vector v) => Vector(x - v.x, y - v.y);
// }

// class Rectangle {
//   double left, top, width, height;
//   Rectangle(this.left, this.top, this.width, this.height);

//   double get right => left + width;
//   set right(double value) {
//     left = value - width;
//   }
// }

// abstract class Doer {
//   final String name = "zhang";
//   static int age = 1;

//   void doSomeThing();
// }

// class EffectiveDoer extends Doer {
//   @override
//   void doSomeThing() {
//     print(Doer.age);
//   }
// }

// void main(List<String> args) {
//   // Doer e = Doer();
//   // e.doSomeThing();

//   // const Vector v = Vector(2, 3);
//   // const Vector w = Vector(1, 1);
//   // final Vector r = v - w;
//   // print(r.x);
//   // print(r.y);
// }


// // class Logger {
// //   final String name;
// //   bool mute = false;

// //   static final Map<String, Logger> _cache = <String, Logger>{};

// //   factory Logger(String name) { // 从缓存中取对象
// //     return _cache.putIfAbsent(name, () => Logger._internal(name));
// //   }

// //   factory Logger.fromJson(Map<String, Object> json) {
// //     return Logger(json['name'].toString());
// //   }

// //   Logger._internal(this.name);

// //   void log(String msg) {
// //     if (!mute) print(msg);
// //   }
// // }



// // import 'dart:math';

// // class Point {
// //   final double x;
// //   final double y;
// //   final double distanceFromOrigin;

// //   Point(double x, double y) : x = x, y = y, distanceFromOrigin = sqrt(x * x + y * y);

// //   Point.alongXAxis(double x) : this(x, 0);
// // }

// // class A {
// //   // 常量构造函数
// //   // final String name;
// //   // const A(String name): name = name;
// //   // const A(this.name);
// //   // A.fromJson(Map<String, String> json) : name = json['name']! {
// //   // }

// //   // 构造函数, 可为null字段
// //   // String? name;
// //   // A(this.name);
// //   // A(String name) {
// //   //   this.name = name;
// //   // }
// //   // A(String name): name = name;
// //   // A({name: String}) {
// //   //   this.name = name;
// //   // }
// //   // A() {}

// //   // 构造函数, 不可为null
// //   // String name;
// //   // A(this.name);
// //   // A(String name): name = name;
// //   // A.fromJson(Map data) : name = data['name']!;
// // }

// // void main(List<String> args) {
// //   Point p = Point(2, 3);
// //   print(p.distanceFromOrigin);
// // }


// // // // const double xOrigin = 0;
// // // // const double yOrigin = 0;

// // // class Point {
// // //   final double x;
// // //   final double y;

// // //   Point(this.x, this.y);

// // //   Point.fromJson(Map<String, double> json) : x = json['x']!, y = json['y']! {
// // //     print("");
// // //   }
// // // }

// // // // class ProfileWork {
// // // //   final String name;
// // // //   final DateTime start = DateTime.now();

// // // //   bool unnamed() {
// // // //     print('unnamed');
// // // //     return this.name.isEmpty;
// // // //   }

// // // //   ProfileWork(this.name);
// // // //   ProfileWork.unnamed() : name = '';
// // // // }

// // // class Person {
// // //   String? firstName;
// // //   Person.fromJson(Map<String, double> json);
// // // }

// // // // class Employee extends Person {
// // // //   Employee.fromJson(super.data) : super.fromJson();
// // // // }

// // // class Vector2d {
// // //   final double x;
// // //   final double y;
// // //   // Vector2d(this.x, this.y);
// // //   Vector2d.named({required this.x, required this.y});
// // // }

// // // class Vector3d extends Vector2d {
// // //   final double z;
  
// // //   // Vector3d.named({required super.x, required super.y}) : super.named();
// // //   Vector3d.yzPlane({required super.y, required this.z}) : super.named(x: 0);
// // //   // Vector3d(final double x, final double y, this.z): super(x, y);
// // //   // Vector3d(super.x, super.y, this.z);

// // // }

// // // void main(List<String> args) {
// // //   Point p = Point.fromJson({
// // //     'x': 1,
// // //   });
// // //   print(p);
// // //   // Person employee = Employee.fromJson({});
// // //   // ProfileWork p = ProfileWork('aa');
// // //   // print(p);
// // //   // var p = Point();
// // //   // p.x = 4;
// // //   // print(p.x);
// // //   // print(p.y);

// // //   // var p = new Point(2, 2); // Point(2, 2), new关键字可选
// // //   // print(p.y);
// // //   // double distance = p.distanceTo(Point(4, 4));
// // //   // print(distance);
// // // }











// // // // void enableFlags({required bool bold, required bool hidden}) {
// // // //   // 命名参数, ?可选参数, required必要参数
// // // // }

// // // // void say (String from, String name, {int? age}) {
// // // //   print("----say");
// // // //   print(from);
// // // //   print(name);
// // // //   print("----say");
// // // // }

// // // // void say1({String? from, String? name}) {
// // // //   print("----say1");
// // // //   print(from);
// // // //   print(name);
// // // //   print("----say1");
// // // // }

// // // // void printElement(int element) {
// // // //   print(element);
// // // // }

// // // // List<int> list = [1, 2, 3];

// // // // Function loudify = ({required String msg}) => msg.toUpperCase();
// // // // // Function loudify = ({required String msg}) => msg.toUpperCase();
// // // // String a = "a";


// // // // Function makeAdder(int addBy) {
// // // //   return (int i) => addBy + i;
// // // // }

// // // // void foo() {}

// // // // class A {
// // // //   static void bar() {}
// // // //   void baz() {}
// // // // }

// // // // void main() {

// // //   // Function x;
// // //   // x = foo;
// // //   // print(foo == x);

// // //   // x = A.bar;
// // //   // print(A.bar == x);
  
// // //   // var a1 = A();
// // //   // var a2 = A();
// // //   // var a2_2 = a2;
// // //   // var a2_baz = a2.baz;

// // //   // print(a2.baz == a2_baz);
// // //   // print(a1.baz == a2.baz);
// // //   // var add2 = makeAdder(2);
// // //   // var add4 = makeAdder(4);

// // //   // print(add2(2));
// // //   // print(add4(2));


// // //   // String a = "b";
// // //   // print(a);
// // //   // void fun() {
// // //   //   String a = "c";
// // //   //   print(a);
// // //   // }
// // //   // void func1 () {
// // //   //   fun();
// // //   // }
// // //   // func1();
// // //   // list.forEach(printElement);
// // //   // print(loudify(msg: "aa"));
// // //   // say(
// // //   //   "from",
// // //   //   "name",
// // //   // );
// // //   // say1(from: "from", name: "name");
// // // // bool isNoble(int atomicNumber) {
// // // //   return _no
// // // // }

// // //   // final gifts = const { // const 关键字, 创建Map编译时常量
// // //   //   "aa",
// // //   //   "vv"
// // //   // };

// // //   // Set<String> gitfs = {
// // //   //   "aa",
// // //   //   "bb",
// // //   // };
// // //   // gitfs.add("bb");
// // //   // print(gitfs.toString());
// // //   // Map<String, String> girls = {
// // //   //   "mm": "aa",
// // //   //   "mm": "bb",
// // //   // };

// // //   // print(girls['mm']);
// // //   // // var fullName = 'a';
// // //   // Number r = 0 / 0;
// // //   // assert(r is Number);
// // //   // const aConstNum = 0;
// // //   // const aConstBool = true;
// // //   // const aConstString = "a const string";

// // //   // var aNum = 0;
// // //   // var aBool = true;
// // //   // var aString = "a string";
// // //   // const aConstList = [1, 2, 3];
// // //   // const validConstString = '$aConstNum, $aConstBool, $aConstString, $aConstList';
// // //   // print(validConstString);
// // //   // var a = "aa";
// // //   // Bob obj1 = const Bob("a");
// // //   // print(obj1.age);
// // //   // const Object i = 3;
// // //   // const list = [i as int];
// // //   // const map = {if (i is int) i : 'int'};
// // //   // const set = {if (list is List<int>) ...list};
// // //   // int number = 42;
// // //   // // printInteger(number);
// // //   // int lineCount;
// // //   // // assert(lineCount == null);

// // //   // final name = 'bob';
// // //   // final String nickName = "bobbb";
// // //   // // name = "aa"; // final 只能被赋值一次.

// // //   // // const 表示常量 , 修饰类中的常量, 必须使用 `static const`
// // //   // // 可以直接赋值, 也可以使用其他const赋值
// // //   // const bar = 100;
// // //   // const double atm = 1.22 * bar;

// // //   // final baa = 100;
// // //   // final double atmaa = 1.22 * baa;
// // //   // print(atmaa);
// // // // }


// // // // void printInteger(int oNumber) {
// // // //   print("the number is $oNumber");
// // // // }

// // // // class Bob {
// // // //   final int age = 1;
// // // //   final String? name;
  
// // // //   // Bob();

// // // //   const Bob(String this.name);

// // // //   // void setAge(int age) {
// // // //   //   this.age = age;
// // // //   // }
// // // // }

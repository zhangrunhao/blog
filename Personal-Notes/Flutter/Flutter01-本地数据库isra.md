# Flutter01-本地数据库 isar

## 介绍

- 一个跨平台的本地数据库。
- no-sql 存储
- 底层是 c++，采用二进制存储。

## 使用

- `官网https://isar.dev/`[https://isar.dev/]
- 添加依赖

```bash
flutter pub add isar isar_flutter_libs path_provider
flutter pub add -d isar_generator build_runner
```

- 声明`class`上的注解`@collection`相当于一张表

```dart
import 'package:isar/isar.dart';

part 'user.g.dart';

@collection
class User {
  Id id = Isar.autoIncrement; // you can also use id = null to auto increment

  String? name;

  int? age;
}
```

- 执行 build 就能自动生成一些文件，操作数据库

```bash
flutter pub run build_runner build
```

- 然后代码中进行初始化

```dart
   final dir = await getApplicationDocumentsDirectory();
    return await Isar.open(
      [
        RecordModelSchema,
        AccountModelSchema,
        CategoryModelSchema,
      ],
      directory: dir.path,
    );
```

- 然后就能在其他代码中进行应用了

```dart
  final isar = await isarService.db;
  await isar.accountModels.putAll([cash, credit]);
```

## 解释几个疑问

### 关于每次变动以后 build 生成 schema 文件

- `flutter pub run build_runner build`
- 根据`@collection`注解，生成一系列文件
  - `<ModuleName>Schema`，用来描述数据库.
  - 包括一些列操作数据库的方法
  - 还有，序列化反序列化的方法
- `build_runner`时 dart 官方提供，生成代码生成工具
- `isar_generator`是 isar 设计的代码生成插件
- build_runner 会调用 isar_generator

### 关于 schema 兼容

- 每次 build 的时候，都会对比上一次 schema
- 如果有新增 / 删除字段，都不会影响
- 如果有更新字段，例如字段的数据类型，会报错
- **建议，变更字段的时候，都使用新赠字段进行操作**

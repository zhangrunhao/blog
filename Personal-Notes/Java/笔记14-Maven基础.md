# Java笔记14 - Maven基础

## Maven介绍

* Maven主要功能;
  * 提供了一套标准化的项目结构;
  * 提供了一套标准化的构建流程 (编译, 测试, 打包, 发布..);
  * 提供了一套依赖管理机制

### Maven项目接口

a-maven-project // 项目名称
├── pom.xml // 项目描述文件
├── src
│   ├── main
│   │   ├── java // 存放java源码目录
│   │   └── resources // 存放资源文件目录
│   └── test
│       ├── java // 存放测试源码
│       └── resources // 存放测试资源
└── target // 所有打包, 编译生成的文件都放到这

```xml
<project ...>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.itranswarp.learnjava</groupId> // 组织, 公司名称
  <artifactId>hello</artifactId> // 项目名称
  <version>1.0</version> // 版本号
  <packaging>jar</packaging>
  <properties>
        ...
  </properties>
  <dependencies>
        <dependency> // 声明一个依赖, maven会自动下载
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>
  </dependencies>
</project>
```

* `groupId`, `artifactId`, `version`用来确定一个项目

## 依赖管理

* 自动解析各个依赖

### 依赖关系

* compile: 编译时, 需要用到的`jar`包(默认), 例如: `commons-logging`
  * 自动放入`classpath`中
* test: 编译Test时, 需要用到的`jar`包, 例如: `junit`
  * 仅在测试时用到, 正常运行时不需要
* runtime: 编译时不需要, 但运行时需要用到 例如: `mysql`
* provided: 编译时需要用到, 但运行时由JDK或某个服务器提供 例如: `servlet-api`
  * 编译时需要, 但运行时不需要, 因为Servlet服务器内置了相关的jar.

* maven维护了一个中央仓库, 所有的依赖包都在上面
* 本地设置缓存, 一旦下载过, 就永久安全的存放在本地, 不会重复下载
* `-SNAPSHOT`开发版本, 每次都会重复下载

### 唯一ID

* 三段确定一个唯一id, 一经发布无法修改, 只能发布新的版本

### Maven镜像

* 使用国内提供的镜像仓库进行下载

* `search.maven.org`进行搜索

* `mvn clean package`进行打包构建

## 构建流程

* Maven有一套标准化的构建流程, 可以自动化实现编译, 打包, 发布等等

### Lifecycle和Phase

* 内置生命周期`default`:
  * validate
  * initialize
  * generate-sources
  * process-sources
  * generate-resources
  * process-resources
  * compile
  * process-classes
  * generate-test-sources
  * process-test-sources
  * generate-test-resources
  * process-test-resources
  * test-compile
  * process-test-classes
  * test
  * prepare-package
  * package
  * pre-integration-test
  * integration-test
  * post-integration-test
  * verify
  * install
  * deploy
* 生命周期`clean`:
  * pre-clean
  * clean （注意这个clean不是lifecycle而是phase）
  * post-clean
* `mvn package`: 执行`default`生命周期, 执行到`package`
* `mvn clean compile`: 先执行`clean`生命周期, 到`clean`phase, 再运行`default`生命周期到`compile`phase
* 常用的:
  * `clean`: 清理
  * `compile`: 编译
  * `test`: 运行测试
  * `package`: 打包

* `mvn [phase]`: 自动执行到某个lifecycle的某个phase

### Goal

* 执行一个`phase`处罚一个或者多个`goal`
* lifecycle > phase > goal
* 少数直接运行`goal`: `mvn tomcat:run`: 直接运行了`tomcat`生命周期下面的一个`goal`
* 举例: `phase` -> `goal`&`goal`
  * `compile` -> `compiler:compile`
  * `test` -> `compiler:testCompiler`&`surefile:test`
* `执行goal都是插件:goal名称`

## 使用插件

* 执行`mvn compile`: 会自动执行`compile`这个`phase`, 这个`phase`会自动执行`compiler`插件关联的`compiler:compile`这个`goal`
* 执行每个`phase`都会通过插件(plugin)进行执行.
* 只是会找到`compiler`这个插件, 然后执行默认的`compiler:compile`这个`goal`来执行
* 使用Maven, 就是配置好需要使用的插件, 然后通过`phase`进行调用
* phase名称: 对应的插件名称
  * clean: clean
  * compile: compiler
  * test: surefire
  * package: jar

### 自定义插件

* 引入自定义插件, 并按照规则在指定的`phase`进行声明, 执行声明的`goal`
* 并根据插件需要的参数进行配置
* 常用的插件:
  * maven-shade-plugin: 打包所有的依赖包并生成可执行的jar
  * cobertura-maven-plugin: 生成单元测试覆盖率报告
  * findbugs-maven-plugin: 对java源码进行分析, 找出潜在问题

## 模块管理

* 建立maven模块
* 父级目录下建立`parent`文件夹, 并建立可集成的配置文件
* 每个模块下建立自己的配置文件
* 在根目录下建立一个`pom.xml`, 并声明所有的`module`, 进行统一的打包管理

## 使用mvnw

* 单独项目使用特定版本的`maven`
* 可以把mvnw的相关信息放到代码库中, 开发人员统一版本

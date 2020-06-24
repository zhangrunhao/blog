# Java笔记16 - XML和JSON

## XML简介

* 可扩展标记语言
  * 纯文本, 默认使用UTF-8
  * 可嵌套, 适合表示结构化数据

### XML的结构

* 首行表示版本, 可选的编码.
* 只有一个根元素, 并包含任意个子元素, 元素可以包含属性
* 空元素, 可以用`<tag />`表示
* 特殊符号需要转移
  * `<` &lt;
  * `>` &gt;
  * `&` &amp;
  * `"` &quot;
  * `'` &apos;
* DTD文档指定一系列规则
  * 根元素必须是`book`
  * `book`元素必须包含`name`, `author`等指定元素
  * `isbn`元素必须包含属性`lang`
* **浏览器对HTML有一定的包容性, 但对XML非常严格**

* XML是一个技术体系:
  * DTD/XSD: 验证xml结构和数据是否有效
  * Namespace: xml节点和属性的名字空间
  * XSLT: 把xml转化为另一种文本
  * XPath: 一种xml节点查询语言

## 使用DOM

* 两种解析方式:
  * DOM: 一次性读取XML, 并再内存中表示为树形结构
  * SAX: 以流的形式读取XML, 使用事件回调

## 使用SAX

* 使用`Handler`进行回调函数监听

## 使用Jackson

* 引包就完了, 不过这环境问题, 可折腾了有一会..
* mvn环境和eclipse环境, 还有不熟悉的java版本环境.. 折腾了有一会.

## 使用JSON

* 特点:
  * JSON只能使用UTF-8编码, 不存在编码问题
  * JSON只允许使用双引号作为key, 特殊字符用`\`转义, 格式简单
  * 浏览器内置JSON支持
* REST API: 使用JSON.

* 可以引入指定的解析规则, 解析指定的字段
* 可以自定义解析规则

* Jackson可以实现JavaBean和JSON之间的转化
* 可以通过Module扩展Jack能处理数据的能力
* 自定义`JsonSerializer`和`JsonDeserializer`进行序列化和反序列化

```java

public class UseJSON {
  public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
    InputStream input = UseJSON.class.getResourceAsStream("/book.json");
    ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
    // 反序列化, 忽略不存在的JavaBean属性
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    Book book = mapper.readValue(input, Book.class);
    System.out.println(book.name);
    System.out.println(book.isbn);
  }
}

class Book {
    public String name;
    // 使用注解, 表示反序列化时使用自定义的IbsnDeserializer
    @JsonDeserialize(using = IsbnDeserializer.class)
    public BigInteger isbn;
}

// 自定义解析规则, 解析非数字的
class IsbnDeserializer extends JsonDeserializer<BigInteger> {
  public BigInteger deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    String s = p.getValueAsString();
    if (s != null) {
      try {
        return new BigInteger(s.replace("-", ""));
      } catch (NumberFormatException e) {
        throw new JsonParseException(p, s, e);
      }
    }
    return null;
  }
}
```

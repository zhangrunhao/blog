# ai 学习 01-mcp

## 什么是 mcp

- Model Context Protocol
- 是一种标准协议，可以让 ai(chatgpt, claude)安全，可控的调用外部数据源
- 相当于一个接口规范。

## mcp 的工作方式

- model:
  - 模型，例如 chatgpt, claude 等
  - 通过 mcp 进行请求
- mcp 客户端
  - ai 工具本身，支持 mcp 协议
  - 能把 ai 的请求，变成 map 的调用
- mcp 服务端
  - 外部资源封装层
  - 定义了 ai 可以调用哪些功能，返回什么格式

## 应用场景

- ai 通过 mcp 链接 github 仓库，读代码，写 pr
- ai 通过 mcp 调用 postgreSQL mcp server 执行 sql，获取实时数据
- mcp server 可以链接本地文件系统，终端命令，ai 就变成超级助手

## 通用场景

1. 用户 提出请求：例如 “读取 README.md，如果测试失败就创建一个 issue。”
2. Host 应用（MCP 客户端） 发现并注册两个 MCP Server：filesystem 和 github。
3. 模型（LLM） 调用 read_file(path) → 文件系统 Server 返回文件内容。
4. 模型分析后，再调用 list_prs() / create_issue() → GitHub Server。
5. Host 负责权限检查、隐藏敏感信息、记录日志 → 最终把结果返回给用户。

## mcp 疑问

- host 应用是什么？mcp 客户端又是什么， 用一个 app 吗？需要安装吗？有什么例子吗？
  - 作为一个客户端，可以是聊天界面/IDE
  - 和 LLM 通信，链接多个 mcp server
  - host 就是应用容器
  - mcp 客户端，是应用容器里，对接 mcp 的那部分模块
- mcp 客户端，是如何发现注册 mcp server 的？ mcp server 是在哪里定义的？
  - host 会读取一份配置，告诉他有哪些 server

```json
// mcp.config.json（示例）
{
  "servers": {
    "filesystem": {
      "command": "node ./servers/fs-server.js",
      "transport": "stdio",
      "allowPaths": ["/workspace/project", "/tmp"]
    },
    "github": {
      "command": "python ./servers/github_server.py",
      "transport": "stdio",
      "env": { "GITHUB_TOKEN": "${env:GITHUB_TOKEN}" }
    }
  }
}
```

- 什么事 llm？ 这个 llm 又是如何知道调用什么方法的？
  - large language model 大语言模型。
  - host 把 mcp工具清单和json都给到llm
  - llm根据当前的语言，生成一个tool call. 例如哪个方法，传哪些参数
  - host验证参数，转发给mcp server执行，再把执行的结果返回给模型
- 模型分析的内容是什么？如何的出结论，并且怎么知道调用哪些方法的？
  - 包含了对话上下文，host给的任务指令，最近读取到的文件等
- host 怎么检查权限之类的？
  - host会进行第一编检查，例如路径权限，github的权限等
  - server会进行第二次检查

## mcp实践

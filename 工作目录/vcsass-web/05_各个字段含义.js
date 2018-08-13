var from = {
  "code": 0,
  "msg": "success",
  "data": {
    // 表单上的各个字段
    "fieldMetas": [{
        // 表单名称
        "name": "日程名称",
        // 对应的key, 用存储默认数据
        "key": "title",
        // 用来确定表单类型
        "type": "TEXT",
        // 可忽略的名称表示
        "innerName": "title",
        // 描述
        "description": null,
        // 对这个字段的一个详细配置
        "scene": {
          // 提交时的限制
          "validate": [{
              "message": "必填",
              "required": true
            },
            {
              "max": 20,
              "message": "最大长度20"
            }
          ]
        }
      },
      {
        "name": "开始时间",
        "key": "startTime",
        "type": "DATE",
        "innerName": "startTime",
        "description": null,
        "scene": {
          // 格式化
          "format": "yyyy-MM-dd HH:mm",
          // 表示传入的element的prop
          "element_props": {
            "format": "yyyy-MM-dd HH:mm",
            "type": "datetime"
          },
          "validate": [{
              "message": "必填",
              "required": true
            },
            {
              "validator": "const errors = [];if (value < (new Date()).valueOf()) {errors.push({message: \"开始时间必须大于当前时间\",});}callback(errors);"
            }
          ]
        }
      },
      {
        "name": "结束时间",
        "key": "endTime",
        "type": "DATE",
        "innerName": "endTime",
        "description": null,
        "scene": {
          "format": "yyyy-MM-dd HH:mm",
          "element_props": {
            "format": "yyyy-MM-dd HH:mm",
            "type": "datetime"
          },
          "validate": [{
              "message": "必填", // 指定解析规则
              "required": true
            },
            { // 运行一段函数
              "validator": "const errors = [];if (kr.moment(kr.moment(value).format(\"YYYY-MM-DD HH:mm\")).format(\"x\") < kr.moment(kr.moment(source.startTime).format(\"YYYY-MM-DD HH:mm\")).format(\"x\")){errors.push({message: \"结束时间不能小于开始时间\",});}callback(errors);"
            }
          ]
        }
      },
      {
        "name": "相关人员",
        "key": "attendees",
        "type": "SELECT_MULTIPLE_REMOTE",
        "innerName": "attendees",
        "description": null,
        "scene": {
          // 依赖数据源, 可以进行再次请求数据
          "related_data_remote": "result=\"/user/all/label\"",
          "validate": [{
            "message": "必填",
            "required": true
          }]
        }
      },
      {
        "name": "相关文件",
        "key": "fileIds",
        "type": "FILE",
        "innerName": "fileIds",
        "description": null,
        "scene": {
          "limit": 9
        }
      },
      {
        "name": "触发消息提醒",
        "key": "isRemind",
        "type": "SELECT",
        "innerName": "isRemind",
        "description": null,
        "scene": {
          "field_event_emit": [{
            "event": "change",
            "script": "result={};result.isRemind=ctx.component.value"
          }],
          "related_data": {
            "options": [{
                "label": "否",
                "value": "0"
              },
              {
                "label": "是",
                "value": "1"
              }
            ]
          },
          "field_event_listen": [],
          "validate": []
        }
      },
      {
        "name": "单次循环间隔",
        "key": "interval",
        "type": "NUMBER",
        "innerName": "interval",
        "description": null,
        "scene": {
          "field_event_emit": [],
          "field_event_listen": [{
            "src": "isRemind",
            "event": "change",
            "script": "ctx.component.cache.isRemind=ctx.args[0].isRemind;if(ctx.component.cache.isRemind===\"1\"){ctx.component.disabled=false;}else{ctx.component.disabled=true;}"
          }],
          "validate": [{
              "min": 0,
              "max": 60,
              "type": "integer",
              "message": "循环间隔次数必须为整数，且其长度不能大于60"
            },
            {
              "message": "必填",
              "required": true
            }
          ]
        }
      },
      {
        "name": "单位",
        "key": "unit",
        "type": "SELECT",
        "innerName": "unit",
        "description": null,
        "scene": {
          "field_event_emit": [],
          "related_data": {
            "options": [{
                "label": "分",
                "value": "MINUTES"
              },
              {
                "label": "小时",
                "value": "HOURS"
              },
              {
                "label": "天",
                "value": "DAYS"
              },
              {
                "label": "周",
                "value": "WEEKS"
              },
              {
                "label": "月",
                "value": "MONTHS"
              },
              {
                "label": "年",
                "value": "YEARS"
              }
            ]
          },
          "field_event_listen": [{
            "src": "isRemind",
            "event": "change",
            "script": "ctx.component.cache.isRemind=ctx.args[0].isRemind;if(ctx.component.cache.isRemind===\"1\"){ctx.component.disabled=false;}else{ctx.component.disabled=true;}"
          }],
          "validate": [{
            "message": "必填",
            "required": true
          }]
        }
      },
      {
        "name": "发送方式",
        "key": "taskReceiveType",
        "type": "SELECT_MULTIPLE",
        "innerName": "taskReceiveType",
        "description": null,
        "scene": {
          "field_event_emit": [],
          "related_data": {
            "options": [{
              "label": "站内消息",
              "value": "MESSAGE"
            }]
          },
          "field_event_listen": [{
            "src": "isRemind",
            "event": "change",
            "script": "ctx.component.cache.isRemind=ctx.args[0].isRemind;if(ctx.component.cache.isRemind===\"1\"){ctx.component.disabled=false;}else{ctx.component.disabled=true;}"
          }],
          "validate": [{
            "message": "必填",
            "required": true
          }]
        }
      },
      {
        "name": "发送内容",
        "key": "remark",
        "type": "TEXT_AREA",
        "innerName": "remark",
        "description": null,
        "scene": {
          "field_event_emit": [],
          "field_event_listen": [{
            "src": "isRemind",
            "event": "change",
            "script": "ctx.component.cache.isRemind=ctx.args[0].isRemind;if(ctx.component.cache.isRemind===\"1\"){ctx.component.disabled=false;}else{ctx.component.disabled=true;}"
          }],
          "validate": [{
              "required": false
            },
            {
              "max": 150,
              "message": "最大长度150"
            }
          ]
        }
      }
    ],
    "layout": [{
      "name": "新建日程",
      "type": "CONTAINER",
      "key": "5b6aa677d6018041de6acd14",
      "children": [{
          "type": "FIELD",
          "field": "title",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "startTime",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "endTime",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "attendees",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "fileIds",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "isRemind",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "interval",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "unit",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "taskReceiveType",
          "common": false
        },
        {
          "type": "FIELD",
          "field": "remark",
          "common": false
        }
      ],
      "data": {}
    }],
    "value": {
      "taskReceiveType": [{
        "value": "MESSAGE",
        "label": "站内消息"
      }],
      "attendees": [{
        "value": "5b3265774cedfd035e5a799d",
        "label": "Petter"
      }],
      "isRemind": {
        "value": "0",
        "label": "否"
      }
    }
  }
}
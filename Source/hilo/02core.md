# core模块分析

## Class

### Class介绍

* create方法:
  * 参数:
    * Extends: 继承的父类
    * Mixes: 混入的成员对象
    * Statics: 静态方法
    * constructor: 构造函数
    * 其他类的成员属性和方法
  * 返回:
    * 构建好的类
* mix方法
  * 参数:
    * target: 目标对象
    * source: 需要挂载的数据源
  * 返回:
    * 返回构造挂载完成后的目标对象

### Class代码分析

* create相关

```js
// ceate
var create = function(properties){
    properties = properties || {};
    // 查看是否赋值了constructor函数
    var clazz = properties.hasOwnProperty('constructor') ? properties.constructor : function(){};

    implement.call(clazz, properties);
    // 其实返回就是contructor, 其实new的过程, 也就是执行contructor的过程
    return clazz;
};

// implement
var implement = function(properties){
    var proto = {}, key, value;
    for(key in properties){
        value = properties[key];
        // 查看有无特殊属性, 有的话, 执行特殊属性
        if(classMutators.hasOwnProperty(key)){
            // this就是传入的的constructor, value就是指定的特殊值
            classMutators[key].call(this, value);
        }else{
            proto[key] = value;
        }
    }

    // 将构造函数的属性, 挂载在this, 也就是我们传入的constructor上面.
    mix(this.prototype, proto);
};

// classMutators
var classMutators = /** @ignore */{
    Extends: function(parent){
        // proto, 是一个对象 { __proto__: parent.prototype }
        var existed = this.prototype, proto = createProto(parent.prototype);

        // 继承静态属性, 把父元素上面的静态属性, 就是直接挂载Animal.isAnimal的方法, 混如成为Cat.isAnimal
        //inherit static properites
        mix(this, parent);

        // 把之前原型上的各个属性, 再放到新的原型上面
        //keep existed properties
        mix(proto, existed);

        // 原型上的constructor指向函数本身
        //correct constructor
        proto.constructor = this;

        // 更改原型链, 使用原型链实现继承
        //prototype chaining
        this.prototype = proto;

        //搞一条快速找到父元素的原型的属性
        //shortcut to parent's prototype
        this.superclass = parent.prototype;
        // 使用当前的实例, 去执行父级构造函数的constructor, 初始化, 一些参数
        // Cat.superclass.constructor.call(this, properties);
    },

    Mixes: function(items){
        // 需要混入的实例
        items instanceof Array || (items = [items]); // 如果是数组的话, 就把数组中的每一项都混入
        var proto = this.prototype, item;

        while(item = items.shift()){
             // 如果传入的是函数, 就是混入原型, 如果是对象, 就混入这个对象本身
            mix(proto, item.prototype || item);
        }
    },

    Statics: function(properties){
        // 把传入的属性, 将函数作为一个对象, 进行赋值
        mix(this, properties);
    }
};

// createProto
var createProto = (function(){
    if(Object.__proto__){
        return function(proto){
            return {__proto__: proto}; // 返回一个对象, 使此对象的`__proto__`指向传入的对象
        };
    }else{ // 不可以直接使用prototype的话, 通过构造函数的方法, 返回一个对象, 这个对象的`__proto__`执行传入的proto
        var Ctor = function(){};
        return function(proto){
            Ctor.prototype = proto;
            return new Ctor();
        };
    }
})();
```

* mix 相关

```js
var mix = function(target){ // 将第一个参数, 作为
    for(var i = 1, len = arguments.length; i < len; i++){ 
        var source  = arguments[i], defineProps;
        for(var key in source){
            var prop = source[key];
            if(prop && typeof prop === 'object'){
                // 当某个属性,是对象, 又刚好含有, value, 或者, set/get方法的时候
                // 会把后面这个对象, 最为前面属性名称的 一个描述 对象进行处理
                if(prop.value !== undefined || typeof prop.get === 'function' || typeof prop.set === 'function'){
                    defineProps = defineProps || {};
                    // 用属性描述的方法处理该属性
                    defineProps[key] = prop;
                    continue;
                }
            }
            target[key] = prop;
        }
        if(defineProps) defineProperties(target, defineProps);
    }

    return target;
};

var defineProperty, defineProperties;
try{
    defineProperty = Object.defineProperty;
    defineProperties = Object.defineProperties; // 直接在一个对象上定义新的属性, 或者修改现有的属性
    defineProperty({}, '$', {value:0});
}catch(e){ // 如果不能征程使用defineProperty, 就做个兼容处理
    if('__defineGetter__' in Object){ // 必须含有 __defineGetter__ , 做处理.
        defineProperty = function(obj, prop, desc){ // 使用 `__defineGetter` 确认该属性
            if('value' in desc) obj[prop] = desc.value;
            if('get' in desc) obj.__defineGetter__(prop, desc.get);
            if('set' in desc) obj.__defineSetter__(prop, desc.set);
            return obj;
        };
        defineProperties = function(obj, props){
            for(var prop in props){
                if(props.hasOwnProperty(prop)){
                    defineProperty(obj, prop, props[prop]);
                }
            }
            return obj;
        };
    }
}
```

## Hilo

### Hilo介绍

### Hilo代码分析
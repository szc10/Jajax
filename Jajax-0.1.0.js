/*!
 * Jajax JavaScript Library v0.1.0
 * http://
 *
 * author: 施哲晨
 * inf:一个轻量化的ajax组件
 * Date: 2016-03-22
 *
 * @param config
 *
 *  config.url: string,  请求的地址,不可省
 *  config.data: object,     请求的对象,可省
 *  config.type: "post||get", 请求的方式,可省,默认post
 *  config.json_back: boolean, 请求回的数据json序列化,可省,默认false
 *  config.file: object,要发送的文件,可省,如果请求方式为get,则自动忽略
 *  config.complete: function, 请求成功后的处理函数,不可省
 *  config.callback: function, 请求完成后的处理函数,不可省
 *  config.error: function,   请求失败后的处理函数,不可省
 *
 */
var Jajax = function (config) {

    var file = config.file;  //获取文件
    var url = config.url;  //获取url地址
    var data = config.data;  //获取data数据
    var complete = config.complete;  //接受200后的请求处理
    var callback = config.callback;   //任务完成后的回调函数
    var json_back = config.json_back;  //返回值是否json数组遍历化
    var error = config.error;   //任务失败的的回调函数
    var type = config.type || "post";
    var form = null;
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    if (type == 'GET' || type == 'get') {
        url += "?";
        data = (function (obj) { // 转成get请求所需要的字符串.
            var str = "";
            for (var name in obj) {
                str += name + "=" + obj[name] + "&"
            }
            return str;
        })(data);
        url += data;
        xhr.open('get', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //为get方式设置请求头
    } else {
        form = new FormData();  //建立一个表单对象
        for (var filename in file)
            form.append(filename, file[filename]);    //将文件放入表单中
        for (var name in data)
            form.append(name, data[name]);  //将data数据放入表单中
    }

    xhr.onreadystatechange = _onreadystatechange;

    if (type == 'get' || type == 'GET') {  //开始发送get请求
        xhr.send();
    }
    else {
        xhr.open('post', url, true);   //开始发送post请求
        xhr.send(form);
    }
    /**
     * 判读对象是否是函数
     * @param o
     * @returns {boolean}
     */
    var jsBox = Object.create(null);
    jsBox.isFunction = function (o) {
        return Object.prototype.toString.apply(o) === "[object Function]";
    }
    /**
     * 准备接受服务端发送过来的请求包
     * @private
     */
    function _onreadystatechange() {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
                if (json_back == true) {
                    var result = xhr.responseText;
                    if (result)
                        var re = eval("(" + result + ")");
                    else
                        var re = "";
                    complete(re);
                } else {
                    complete(xhr.responseText);
                }
                if (jsBox.isFunction(callback)) {
                    callback();
                }
            } else {
                if (jsBox.isFunction(error)) {
                    error();
                }
                console.log("error:readyState:" + xhr.readyState + "status:" + xhr.status);
            }
    }
}
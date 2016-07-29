var v = new Vue({
    el: 'body',
    data: {
        searchKey: '',//搜索输入框双向绑定数据
        apiErrMsg: [],//状态栏的信息提示数组
        api1Arr: [],//搜索关键字的城市列表
        //天气信息对象
        weatherInfo: {
            today: {},
        }
    },
    methods: {
        //查询按钮事件
        searchEvent: function () {
            if ($.trim(this.searchKey) == '') {
                this.apiErrMsg.push('请输入城市名称');

                return false;
            }

            this.apiErrMsg.push('正在请求数据...');

            //清空上一次查询结果，即清空页面城市列表数据
            v.api1Arr = [];

            //请求参数
            var params = {
                'cityname': this.searchKey
            }

            //调用接口
            ajax({
                url: 'http://apis.baidu.com/apistore/weatherservice/citylist',
                headers: {
                    'apikey': 'b9879e5e82c630b8de50e26b1759db30'
                },
                data: $.param(params),
                callback: function (json) {
                    if (json.errMsg == 'success') {
                        v.apiErrMsg.push('正在处理数据...');
                    } else {
                        v.apiErrMsg.push(json.errMsg);
                    }

                    v.api1Arr = json.retData;

                    v.apiErrMsg.push('数据加载完毕');
                }
            });

        },
        //城市列表事件
        getWeatherInfo7: function () {
            var obj = $(event.currentTarget);
            var id = obj.attr('data-id');

            this.apiErrMsg.push('正在请求数据...');

            var params = {
                'cityid': id
            }

            ajax({
                url: 'http://apis.baidu.com/apistore/weatherservice/recentweathers',
                headers: {
                    apikey: 'b9879e5e82c630b8de50e26b1759db30'
                },
                data: $.param(params),
                callback: function (json) {
                    if (json.errMsg == 'success') {
                        v.apiErrMsg.push('正在处理数据...');
                    } else {
                        v.apiErrMsg.push(json.errMsg);
                    }

                    v.weatherInfo = json.retData;

                    v.apiErrMsg.push('数据加载完毕');
                }
            });

        }
    }
});

//检视状态栏消息数组，定时清空。
v.$watch('apiErrMsg', function () {
    setTimeout(function () {
        if (v.apiErrMsg.length > 0 && v.apiErrMsg[0]) {
            v.apiErrMsg.splice(0, 1);
        }
    }, 4000);
});

/** 异步调用函数
 * 参数说明：
 * params.url:接口地址
 * params.header:写入请求header部分的参数
 * params.data:请求参数
 * params.callback:请求成功后的回调函数，回调参数：json对象
 */
function ajax(params) {
    var url = params.url || '';
    var headers = params.headers || '';
    var data = params.data || '';
    var callback = params.callback || function () { };

    //每次接口调用，初始化数据。
    v.apiErrMsg = [];
    v.weatherInfo = {
        today: {},
    };

    if (url == '' || headers == '' || data == '') {
        v.apiErrMsg.push('请参数出错...');
        return false;
    }

    $.ajax({
        type: 'get',
        url: url,
        data: data,
        headers: headers,
        success: function (data) {
            try {
                var json = eval('json=' + data);

                callback(json);

            } catch (e) {
                v.apiErrMsg.push('未请求到数据');
            }
        }
    });
}
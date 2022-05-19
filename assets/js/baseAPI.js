//每次调用ajax之前都会先调用这个函数，
// 它可以得到给ajax提供的配置对象

$.ajaxPrefilter(function (options) {
	//发起真正的ajax请求之前，统一拼接请求的根路径
	options.url = 'http://www.liulongbin.top:3007' + options.url;
	console.log(options.url);
});

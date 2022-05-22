//每次调用ajax之前都会先调用这个函数，
// 它可以得到给ajax提供的配置对象

$.ajaxPrefilter(function (options) {
	//发起真正的ajax请求之前，统一拼接请求的根路径
	options.url = 'http://www.liulongbin.top:3007' + options.url;
	// options.url = 'http://127.0.0.1:3007' + options.url;

	//统一为有权限的接口设置headers请求头
	if (options.url.indexOf('/my/' !== -1)) {
		options.headers = {
			Authorization: localStorage.getItem('token') || '',
		};
	}

	// 全局统一挂载complete 回调函数
	//无论成功还是失败都会执行complete函数,防止用户直接进入index
	options.complete = function (res) {
		//在complete中可以使用res.responseJSON得到返回的数据
		if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
			//1、强制清除本地存储的token
			localStorage.removeItem('token');
			//2、强制跳转到登录页
			location.href = '/login.html';
		}
	};
});

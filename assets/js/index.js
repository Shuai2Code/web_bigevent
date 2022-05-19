$(function () {
	// 调用
	getUserInfo();

	$('#btnLogout').on('click', function () {
		//提示用户是否确认退出
		layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
			//1、清除本地存储的token
			localStorage.removeItem('token');
			//2、重新跳转到登录页
			location.href = '/index.html';

			//关闭confirm询问框
			layer.close(index);
		});
	});
});

// 获取用户的基本信息
function getUserInfo() {
	$.ajax({
		method: 'GET',
		url: '/my/userinfo',
		// 请求头

		success: function (res) {
			if (res.status !== 0) {
				return layui.layer.msg('获取用户信息失败');
			}
			//渲染用户头像
			renderAvatar(res.data);
		},

		// //无论成功还是失败都会执行complete函数,防止用户直接进入index
		// complete: function (res) {
		// 	//在complete中可以使用res.responseJSON得到返回的数据
		// 	if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
		// 		//1、强制清除本地存储的token
		// 		localStorage.removeItem('token');
		// 		//2、强制跳转到登录页
		// 		location.href = '/login.html';
		// 	}
		// },
	});
}

//渲染用户头像
function renderAvatar(user) {
	var name = user.nickname || user.username;
	//nbsp 空格
	$('#welcome').html('欢迎&nbsp;&nbsp;' + name);

	// 按需渲染用户头像
	if (user.user_pic !== null) {
		//渲染图片头像
		$('.layui-nav-img').attr('src', user.user_pic).show();
		$('.text-avatar').hide();
	} else {
		// 渲染文字头像
		$('.layui-nav-img').hide();
		//名字的第一个字符设置为头像，如果英文，则转为大写
		var first = name[0].toUpperCase();
		$('.text-avatar').html(first).show();
	}
}

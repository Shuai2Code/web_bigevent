$(function () {
	//点击去注册账号的链接
	$('#link_reg').on('click', function () {
		$('.login-box').hide();
		$('.reg-box').show();
	});
	//点击去登录账号的链接
	$('#link_login').on('click', function () {
		$('.login-box').show();
		$('.reg-box').hide();
	});

	//从layui中获取Form对象
	var form = layui.form;
	var layer = layui.layer;
	//通过form.verify()函数自定义校验规则
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		//自定义新规则，检验两次输入是否一致
		repwd: function (password) {
			//通过value形参得到的是确认密码框的内容
			// 还需要拿到密码框的内容
			// 属性选择器[]
			var pwd = $('.reg-box [name=password]').val();
			if (pwd !== password) {
				return '两次密码不一致！';
			}
		},
	});

	//监听注册表单的提交事件
	$('#form_reg').on('submit', function (e) {
		//阻止默认的提交行为
		e.preventDefault();
		// 发起ajax.post请求
		var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
		$.post('/api/reguser', data, function (res) {
			if (res.status !== 0) {
				return layer.msg(res.message);
			}
			layer.msg('注册成功！');

			// 模拟人的点击行为
			$('#link_login').click();
		});
	});

	//监听登录表单的提交事件
	$('#form_login').submit(function (e) {
		e.preventDefault();
		$.ajax({
			url: '/api/login',
			method: 'POST',
			//快速获取表单数据
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('登录失败！');
				}
				layer.msg('登录成功！');

				//将成功之后的token字符串保存到localstorage里
				localStorage.setItem('token', res.token);
				//跳转到后台主页
				// location.href = './index.html';
			},
		});
	});
});

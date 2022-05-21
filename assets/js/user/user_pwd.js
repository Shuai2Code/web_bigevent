$(function () {
	var form = layui.form;
	form.verify({
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
		samepwd: function (value) {
			//通过value形参得到的是确认密码框的内容
			// 还需要拿到密码框的内容
			// 属性选择器[]
			if (value === $('[name=oldPwd]').val()) {
				return '新密码与原密码不能相同！';
			}
		},
		repwd: function (password) {
			//通过value形参得到的是确认密码框的内容
			// 还需要拿到密码框的内容
			// 属性选择器[]
			var pwd = $('[name=newPwd]').val();
			if (pwd !== password) {
				return '两次新密码不一致！';
			}
		},
	});

	$('.layui-form').on('submit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/updatepwd',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layui.layer.msg('更新密码失败！');
				}
				layui.layer.msg('更新密码成功！');
				//这是重置表单
				// 原生的form对象是有一个reset方法，要把jQuery转原生DOM
				$('.layui-form')[0].reset();
			},
		});
	});
});

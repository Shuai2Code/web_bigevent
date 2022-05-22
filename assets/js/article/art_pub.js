$(function () {
	var layer = layui.layer;
	var form = layui.form;

	initCate();
	initEditor();

	// 定义加载文章分类的方法
	function initCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('初始化文章分类数据失败！');
				}
				// 调用模板引擎渲染分类下拉菜单
				var htmlStr = template('tpl-cate', res);
				$('[name=cate_id]').html(htmlStr);
				// 一定要记得调用form渲染
				form.render();
			},
		});
	}
	// 1. 初始化图片裁剪器
	var $image = $('#image');
	// 2. 裁剪选项
	var options = {
		aspectRatio: 400 / 280,
		preview: '.img-preview',
	};

	// 3. 初始化裁剪区域
	$image.cropper(options);

	$('#btnChooseImage').on('click', function () {
		$('#coverFile').click();
	});
	//监听coverFile的change事件
	$('#coverFile').on('change', function (e) {
		var files = e.target.files;
		if (files.length === 0) {
			return;
		}
		// 2. 根据选择的文件，创建一个对应的 URL 地址：
		var newImgURL = URL.createObjectURL(files[0]);

		// 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
		$image
			.cropper('destroy') // 销毁旧的裁剪区域
			.attr('src', newImgURL) // 重新设置图片路径
			.cropper(options); // 重新初始化裁剪区域
	});

	//定义文章状态，默认已发布
	var art_state = '已发布';

	//为存为草稿绑定点击事件
	$('#btnSave2').on('click', function () {
		art_state = '草稿';
	});

	//为表单绑定submit
	$('#form-pub').on('submit', function (e) {
		e.preventDefault();
		//基于表单快速创建formdata对象
		var fd = new FormData($(this)[0]);

		//将文章的发布状态存到fd中
		fd.append('state', art_state);

		// 4. 将裁剪后的图片，输出为文件
		$image
			.cropper('getCroppedCanvas', {
				// 创建一个 Canvas 画布
				width: 400,
				height: 280,
			})
			.toBlob(function (blob) {
				// 将 Canvas 画布上的内容，转化为文件对象
				// 得到文件对象后，进行后续的操作

				//将文件对象存储到fd
				fd.append('cover_img', blob);

				//发起ajax数据请求
				publishArticle(fd);
			});
	});

	//定义一个发布文章的方法
	function publishArticle(fd) {
		$.ajax({
			method: 'POST',
			url: '/my/article/add',
			data: fd,
			//注意：如果向服务器提交的是formdata数据
			// 必须添加下面两个属性
			contentType: false,
			processData: false,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('发布文章失败！');
				}
				layer.msg('发布文章成功！');
				location.href = '/article/art_list.html';
			},
		});
	}
});

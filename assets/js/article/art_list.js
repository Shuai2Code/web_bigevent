$(function () {
	var layer = layui.layer;
	var form = layui.form;
	var laypage = layui.laypage;
	//定义一个查询的参数对象
	// 、、需要将请求参诉对象提交到服务器
	var q = {
		//默认请求第一页
		pagenum: 1,
		// 每页显示几条数据2
		pagesize: 2,
		cate_id: '',
		state: '',
	};
	//定义美化时间的过滤器
	template.defaults.imports.dataFormat = function (data) {
		const dt = new Date(data);
		var y = dt.getFullYear();
		var m = padZero(dt.getMonth() + 1);
		var d = padZero(dt.getDay());

		var hh = padZero(dt.getHours());
		var mm = padZero(dt.getMinutes());
		var ss = padZero(dt.getSeconds());
		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
	};

	//定义补0函数
	function padZero(n) {
		n = n > 9 ? n : '0' + n;
	}

	initTable();
	initCate();
	//获取文章列表数据
	function initTable() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: q,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取文章列表失败！');
				}
				var htmlStr = template('tpl-table', res);
				$('tbody').html(htmlStr);
				//调用渲染分页的方法
				renderPage(res.total);
			},
		});
	}

	// 初始化文章分类
	function initCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取文章分类数据失败！');
				}
				// 模板引擎渲染分类可选项
				var htmlStr = template('tpl-cate', res);
				$('[name=cate_id]').html(htmlStr);

				//通过layui重新渲染表单区域的UI结构
				form.render();
			},
		});
	}

	// 为筛选表单绑定submit事件
	$('#form-search').on('submit', function (e) {
		e.preventDefault();
		//获取表单选中项的值
		var cate_id = $('[name=cate_id]').val();
		var state = $('[name=state]').val();
		//为查询参数对象q 中对应属性赋值
		q.cate_id = cate_id;
		q.state = state;
		//重新渲染
		initTable();
	});

	//定义渲染分页的方法
	function renderPage(total) {
		laypage.render({
			//分页容器的id
			elem: 'pageBox',
			// 总数据条数
			count: total,
			// 每页显示数
			limit: q.pagesize,
			// 默认选中的分页
			curr: q.pagenum,
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
			limits: [2, 3, 5, 10],
			// 分页发生切换的时候出发回调

			// 触发jump方式有两种
			// 1、点击页码的时候
			// 2、只要调用了laypage方法，就会触发回调，这是死循环的原因
			jump: function (obj, first) {
				//通过first的值判断通过何种方式触发的
				// first=true为方法二触发
				// console.log(first);
				//obj包含了当前分页的所有参数，比如：
				// console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
				//最新的页码值赋值给q.pagenum
				q.pagenum = obj.curr;

				//把最新的条目数赋值给pagesize
				q.pagesize = obj.limit;

				// 根据最新的q获取列表并渲染
				// initTable();
				if (!first) {
					initTable();
				}
			},
		});
	}

	//通过代理为删除绑定
	$('tbody').on('click', '#btn-delete', function () {
		var len = $('#btn-delete').length;
		var id = $(this).attr('data-id');
		//询问确认？
		layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/delete/' + id,
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg('删除文章失败');
					}
					layer.msg('删除文章成功');

					//当数据删除完成后，需要判断当前页还有没有数据
					// 如果没有数据，则页码减1再init
					if (len === 1) {
						//如果len的值为1，则页面无数据
						// 页码值最小是1
						q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
					}

					initTable();
				},
			});

			layer.close(index);
		});
	});
});

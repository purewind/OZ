$(initGrid);
function initGrid() {
	//窗口大小变动后自动调整grid的
	$(window).resize(function(){
		$("#gridContainer").datagrid("resize");
	});
	
	$('#gridContainer').datagrid( {
		url: 'view.json',
		idField: 'id',
		frozenColumns: [[ 
		    {field: 'code',checkbox: true}, 
		    {field: 'subject',title: '标题',width: 150,sortable: true,formatter:function(value){
				return '<a href="#" onclick="window.open(\'\../form/form.htm\',\'_blank\')"><b>'+value+'</b></a>';
			}}
		]],
		columns: [[
		    {field: 'fileDate',title: '发布日期',width: 90,sortable: true},
		    {field: 'content',title: '内容',width: 300}
		]],
		sortName: 'id',
		sortOrder: 'asc',
		fit: true,
		width:500,height:300,
		nowrap: false,
		striped: true,
		remoteSort: false,
		pagination: true,
		rownumbers: true,
		onDblClickRow: function(rowIndex,rowData){
			alert(rowData.subject);
		},
		onLoadSuccess: function(){
			//$("#gridContainer").datagrid("resize");
		},
		toolbar: [ {
			id: 'btnNew',
			text: '新建',
			iconCls: 'icon-add',
			handler: function() {
				alert('新建')
			}
		}, {
			id: 'btnSave',
			text: '保存',
			iconCls: 'icon-save',
			handler: function() {
				//alert('保存')
			}
		},{
			id: 'btnEdit',
			text: '编辑',
			iconCls: 'icon-edit',
			handler: function() {
				//alert('编辑')
			}
		}, '-', {
			id: 'btnDelete',
			text: '删除',
			iconCls: 'icon-cancel',
			handler: function() {
				//alert('删除')
			}
		},{
			id: 'btnPrint',
			text: '打印',
			iconCls: 'icon-print',
			handler: function() {
				//alert('删除')
			}
		},{
			id: 'btnOk',
			text: '获取选中行的id',
			iconCls: 'icon-ok',
			handler: function() {
				var rows = $('#gridContainer').datagrid('getSelections');
				if(rows.length > 0){
					var ids = [];
					for(var i=0;i<rows.length;i++){
						ids.push(rows[i].id);
					}
					alert(ids.join(','));
				}else{
					alert('请先选择！');
				}
			}
		}]
	});
}
$(function(){
	var socket=io.connect();
	$('.j_btn').on('click',function(){
		console.log(8888);
		var msg = $('.j_nametext').val();
		socket.emit('login',msg);
	})
	$('#j_mesbtn').on('click',function(){
		var data = $('#j_msgtext').html();
		console.log(data);
		var str = '<li><div class="top-right-content"><pre>'+data+'</pre></div></li>'
		$('.right-top-ul').append(str);
		socket.emit('msg',data);
	})
	socket.on('system',function(data){
		var str = '<li class="right-top-time" style="color:red">欢迎&nbsp;&nbsp;'+data+'&nbsp;&nbsp;进入聊天室，撒花</li>';
		$('.right-top-ul').append(str);
	});
	socket.on('chat',function(data){
		console.log(data);
		var str = '<li><div class="top-left-content"><span>'+data.name+'</span><pre>'+data.data+'</pre></div></li>'
		$('.right-top-ul').append(str);
	})
	socket.on('loginSuccess',function(){
		$('.float-player').css('display','none');
		$('.dialog').css('display','none');
	});
	socket.on('disconnect',function(data){
		console.log(data);
		var str = '<li class="right-top-time" style="color:red">&nbsp;&nbsp;'+data+'&nbsp;&nbsp;离开了组织，愿他早日回到组织的怀抱</li>';
		$('.right-top-ul').append(str);
	});
	$('#j_sendmsg').on('change',function(){
		// 判断上传文件类型
		var objFile = $('#j_sendmsg').val();
		var objType = objFile.substring(objFile.lastIndexOf(".")).toLowerCase();
		var formData = new FormData(document.forms.namedItem("test"));
		$.ajax({
			type : 'post',
			url : '/uploadUserImgPre',
			data: formData ,
			processData:false,
			async:false,
			cache: false,  
	  		contentType: false, 
			success:function(re){
				re.imgSrc = re.imgSrc.replace('public','');
				re.imgSrc = re.imgSrc.replace(/\\/g,'\/');
				$('#j_msgtext').append('<img src="'+re.imgSrc+'">')
			},
			error:function(re){
				console.log(re);
			}
		});	
	});
})


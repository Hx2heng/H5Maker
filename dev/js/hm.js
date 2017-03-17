(function(){
	window.hm = function(config){
		this.config = {
			width:640,
			height:1010
		}
		var target = {
			container:$('#hm-container'),
			wrap:$('.hm-wrap')
		}
		//获取dom
		this.gel  = function(tar){
			if(!target[tar]) return false;
			return target[tar];
		}
		this.cfg = $.extend(this.config,config);
		return this.init();
	}
	hm.prototype.init=function(){
		var _this = this;
		this.handler = {};//自定义事件句柄

		this.pageList = [];//页面集合
		this.elLists = [];//元素列表
		
		this.selectEl = {};//选中元素
		//当前页数
		this.nowPage = 1;
		//设置活动页面宽高，再使其适应屏幕
		this.gel("wrap").find('.hm-content').eq(0).css({
			width:_this.cfg.width,
			height:_this.cfg.height
		}).onePage();
		this.multiple  = this.gel("wrap").find('.hm-content').eq(0).get(0).multiple;
		//
		this.gel("wrap").find('.hm-page').eq(0).addClass('active');
		//
		this.elDrag();
		//
		this.pageListPanel();
	}

	//添加新页
	hm.prototype.addPage = function(){
		var _this  = this;
		var page = $('<div class="hm-page">'),
			content = $('<div class="hm-content">');
		content.css({
			width:_this.cfg.width,
			height:_this.cfg.height
		});
		page.append(content);
		this.pageListCtrl.setPreview(this.nowPage);
		this.gel('wrap').find('.hm-page').css('display','none').removeClass('active');
		this.gel('wrap').append(page);

		page.addClass('active');
		content.onePage();

		this.nowPage = this.gel('wrap').find('.hm-page').length;
		this.pageListCtrl.addItem(this.nowPage);
	}
	hm.prototype.delPage = function(){
		var allPage = this.gel('wrap').find('.hm-page').length;
		this.gel('wrap').find('.hm-page').eq(this.nowPage-1).remove();
		if(this.nowPage == allPage!=0){
			this.nowPage--;
		}
		this.gotoPage(this.nowPage);
		this.pageListCtrl.delItem(this.nowPage);
	}
	//跳转到某页
	hm.prototype.gotoPage = function(i){
		this.selectElSet();
		this.pageListCtrl.setPreview(this.nowPage);
		this.nowPage = i;
		this.gel('wrap').find('.hm-page').css('display','none').removeClass('active');
		this.gel('wrap').find('.hm-page').eq(i-1).css('display','block').addClass('active');
	}
	//pageList控制
	hm.prototype.pageListPanel = function(){
		var _this = this;
		this.pageListCtrl = {
			el:$('.page-list'),
			prveIndex:1,
			init:function(){
				this.ul = $('<ul class="page-ul">');
				this.el.append(this.ul);
				this.addItem(1);
				this.itemClick();
			},
			addItem:function(i){
				var li = $('<li class="page-li">');
				this.ul.append(li);
				this.updataItem();
				this.setSelected(i);
			},
			delItem:function(i){
				this.ul.find('li').eq(i-1).remove();
				this.setSelected(i);
				this.updataItem();
				
			},
			updataItem:function(){
				this.ul.find('li').each(function(i){
					$(this).html(i+1);
				})
			},
			itemClick:function(){
				var $this  = this ;
				
				this.ul.on('click','li',function(){
					var index = $(this).html();
					

					_this.gotoPage(index);
					$this.setSelected(index);
					
				})
			},
			setPreview:function(index){
				var $this =this;
				var html = _this.gel('wrap').find('.hm-page').eq(index-1).get(0);
				html2canvas(html).then(function(canvas) {
					var imgSrc = canvas.toDataURL("image/png");
				   	$this.el.find('.page-li').eq(index-1).css('background-image','url('+imgSrc+')');
					
				});
			},
			setSelected:function(i){
				var $this =this;
				this.ul.find('li').removeClass('active');
				this.ul.find('li').eq(i-1).addClass('active');
			},
			clean:function(){
				this.ul.empty();
			}
		}
		this.pageListCtrl.init();
	}
		//选中元素设置，没传参数就清空选中
	hm.prototype.selectElSet = function(el){
		$('.hm-el').removeClass('selected');
		if(el){
			this.selectEl =el;
			el.addClass('selected');
			
			this.fire("selectEl",el);

			return el;
		}
		else{
			this.selectEl = {};
			this.fire('unSelectEl');
			return false;
		}
		
	}
	//判断是否选中
	hm.prototype.isSelected = function(arg){
		if(!arg){
			throw new Error('未传递参数');
			return false;
		}
		else if((Object.prototype.isPrototypeOf(this.selectEl) && Object.keys(this.selectEl).length === 0)){
			throw new Error('未选中元素');
			return false;
		}
		else{
			return true;
		} 
	}
		//创建元素
	hm.prototype.createEl = function(els){
		if(!els){
			throw new Error('添加元素失败');
			return;
		}
		var el = $('<div class="hm-el">');
		
		$(els).css('max-width',this.config.width);
		el.append(els);
		this.gel("wrap").find('.hm-page').eq(this.nowPage-1).find('.hm-content').append(el);
		els.w = els.offsetWidth;//纪录图片宽度
		

	}
	//删除元素
	hm.prototype.delEl = function(el){
		if(this.isSelected(el)){
			this.selectEl.remove();
			this.selectElSet();
		}else{
			return false;
		}
	}
	//元素拖动
	hm.prototype.elDrag = function(){
		var _this = this ;
		var multiple = this.multiple,
			top = _this.gel("wrap").offset().top,
			left = _this.gel("wrap").offset().left+7.5;
		
		this.isDraging = false;
		this.gel("wrap").on('mousedown ',function(e){
			var e = window.event || e;
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			_this.selectElSet();
		})
		this.gel("wrap").on('mousedown','img',function(e){
			var e = window.event || e;
			 e.preventDefault();
		})
		this.gel("wrap").on('mousedown','.hm-el',function(e){
			var e = window.event || e;
			_this.selectElSet($(this));
			_this.isDraging = true;
			this.elTop = e.clientY - $(this).offset().top;
			this.elLeft = e.clientX- $(this).offset().left;
		})
		this.gel("wrap").on('mousemove','.hm-el',function(e){
			if(_this.isDraging){
				var e = e || window.event;
				$(this).css({
					top:(e.clientY-top-this.elTop)/multiple,
					left:(e.clientX-left-this.elLeft)/multiple
				});
			}
		})
		this.gel("wrap").on('mouseup','.hm-el',function(e){
			_this.isDraging = false;
		})
		this.gel("wrap").on('mouseleave','.hm-el',function(e){
			_this.isDraging = false;
		})

		$(window).on('keydown',function(e){
			if(e.keyCode<=40&&e.keyCode>=37){
				e.preventDefault();
				if(_this.isSelected(e)){
					switch(e.keyCode){
						case 37:_this.selectEl.get(0).style.left = _this.selectEl.get(0).offsetLeft -1+'px';break;
						case 38:_this.selectEl.get(0).style.top = _this.selectEl.get(0).offsetTop -1+'px';break;
						case 39:_this.selectEl.get(0).style.left = _this.selectEl.get(0).offsetLeft +1+'px';break;
						case 40:_this.selectEl.get(0).style.top = _this.selectEl.get(0).offsetTop +1+'px';break;
					}
				}
			}
		})
	}
	//添加全局背景
	hm.prototype.addBg = function(files){
		var _this = this;
		this.filesSelected(files,function(img){
			_this.bgSrc = img.src;
			_this.gel('container').css('background-image','url('+img.src+')');
		});
	}
	//删除全局背景
	hm.prototype.delBg = function(){
		this.gel('container').removeAttr('style');
	}
	//添加当前页背景
	hm.prototype.addPageBg = function(files){
		var _this = this;
		this.filesSelected(files,function(img){
			_this.gel('wrap').find('.hm-page').eq(_this.nowPage-1).css('background-image','url('+img.src+')');
		});
	}
	//删除当前页背景
	hm.prototype.delPageBg = function(){
		this.gel('wrap').find('.hm-page').eq(this.nowPage-1).removeAttr('style');
	}
	//添加背景音乐
	hm.prototype.addMusic = function(files){
		var _this = this;

		if(files){
			var file = files[0];
			var audioType = /audio.*/;
		    //通过type属性进行图片格式过滤 
		    var type =  file.type.split("/")[1];
		    if (!file.type.match(audioType)) {  
		      alert('请选择音频'); 
		      return;   
		    }
			var reader = new FileReader();   
			reader.readAsDataURL(file);

			reader.onload = function(e){ 
			    //e.target.result返回的即是图片的dataURI格式的内容 
		    	var music = new Audio();
		    	music.src = e.target.result;
			   	if(!_this.audio){
			    	_this.audio = $('<div class="hm-audio">').addClass('rotate').attr('data-type',type).appendTo(_this.gel('container'));
			    	_this.audio.append($(music).attr({'autoplay':'','loop':''}));
			    	_this.audio.on('click',function(){
			    		if($(this).hasClass('rotate')){
				    		$(this).removeClass('rotate');
				    		$(this).find('audio').get(0).pause();
			    		}
			    		else{
			    			$(this).addClass('rotate');
				    		$(this).find('audio').get(0).play();
			    		}
			    	})
			   	}else{
			   		_this.audio.empty().append($(music).attr({'autoplay':'','loop':''})).addClass('rotate');

			   		//_this.audio.find('audio').get(0).play();
			   	}
			}  
		}
	}
	//删除背景音乐
	hm.prototype.delBgMusic = function(files){
		if(this.audio){
			this.audio.remove();
			this.audio=null;
		}
		else{
			return false
		}
	}	
	//添加图片元素
	hm.prototype.addImgEl =  function(files){
		var _this = this;
		this.filesSelected(files,function(img){
			_this.createEl(img);
		});
	}
	//上传图片控制
	hm.prototype.filesSelected = function(files,callback){
		//通过input files添加图片
		var _this  = this;
		for (var i = 0; i < files.length; i++) {   
		    var file = files[i];   
		    var imageType = /image.*/;
		    //通过type属性进行图片格式过滤 
		    var type =  file.type.split("/")[1];

		    if (!file.type.match(imageType)) {  
		      alert('请选择图片'); 
		      continue;   
		    }
		    var reader = new FileReader();   
		    reader.readAsDataURL(file);
		    reader.type = type;
		   	reader.onload = function(e){ 
		        //e.target.result返回的即是图片的dataURI格式的内容 
		        var img = new Image();
		        img.src = e.target.result;
		        $(img).attr('data-type',this.type);  
		        callback(img);
		    }  
		}
	}
	//添加文本元素
	hm.prototype.addTxtEl = function(txt){
		if(txt.replace(/(^\s*)|(\s*$)/g,"")==""){
			throw new Error('请先添加文本');
			return;
		}
		var text = $('<p>');
		text.html(txt).css('font-size','2em');
		this.createEl(text);
	}
	hm.prototype.addInputEl = function(){
		var text = $('<input>').addClass('hm-input');
		this.createEl(text);
	}
	hm.prototype.addBtnEl = function(){
		var text = $('<a>').addClass('hm-btn').html('button');
		this.createEl(text);
	}
	//设置字体大小
	hm.prototype.setFontSize = function(size){
		if(this.isSelected(size)){
			this.selectEl.find("p").css('font-size',size+'em');
		}
	}
	//设置字体颜色
	hm.prototype.setFontColor = function(color){
		if(this.isSelected(color)){
			this.selectEl.find("p").css('color',color);
		}
	}
	//设置选中元素的位置
	hm.prototype.indexSet = function(type){
		if(this.isSelected(type)){
			var prevEl = this.selectEl.prev(),
				nextEl = this.selectEl.next();
			if(type=='up'){
				this.selectEl.insertAfter(nextEl);
			}
			else if(type = 'down'){
				this.selectEl.insertBefore(prevEl);
			}
		}
	}
	//设置元素图片缩放
	hm.prototype.setImgSize = function(size){
		if(this.isSelected(size)){
			if(this.selectEl.find("img").get(0)){
				this.selectEl.find("img").css('max-width','');//去除宽度限制
				this.selectEl.find("img").css({
					width:this.selectEl.find("img").get(0).w*size
				});
				this.selectEl.attr('img-scale',size);
			}
		}
	}
	//添加动画
	hm.prototype.addAnimate = function(anim){
		if(this.isSelected(anim)){
			this.selectEl.attr('class','hm-el selected');
			this.selectEl.addClass('animated '+anim);
		}
		//this.preview();
	}
	//设置动画参数
	hm.prototype.setAnimate = function(cfg){
		if(this.isSelected(cfg)){
			if(!cfg['delay']&&!cfg['duration']&&!cfg['count']){
				throw new Error('未输入数值');
				return false;
			}
			var defAnim = {
				duration:'1s',
				delay:'0',
				count:1
			}
			var newAnim = {
				duration:cfg['duration'],
				delay:cfg['delay'],
				count:cfg['count']
			}
			var nowAnim = $.extend(defAnim,cfg);
			// var styleStr = 'animation-duration:'+nowAnim.duration+'s'+';'+
			// 	'-webkit-animation-duration:'+nowAnim.duration+'s'+';'+
			// 	'animation-delay:'+nowAnim.delay+'s'+';'+
			// 	'-webkit-animation-delay:'+nowAnim.delay+'s'+';'+
			// 	'animation-iteration-count:'+nowAnim.count+';'+
			// 	'-webkit-animation-iteration-count:'+nowAnim.count+';';
			// 	this.selectEl.attr('style',styleStr);
			this.selectEl.css({
				'animation-duration':nowAnim.duration+'s',
				'-webkit-animation-duration':nowAnim.duration+'s',
				'animation-delay':nowAnim.delay+'s',
				'-webkit-animation-delay':nowAnim.delay+'s',
				'animation-iteration-count':nowAnim.count,
				'-webkit-animation-iteration-count':nowAnim.count
			});
		}
	}
	//删除动画
	hm.prototype.delAnimate = function(type){
		if(this.isSelected(type)){
			this.selectEl.attr('class','hm-el selected');
		}
	}
	//添加额外css
	hm.prototype.addExtraStyle=function(styleString){
		if(this.isSelected(styleString)){
			this.selectEl.attr('style',this.selectEl.attr('style')+styleString);
			this.selectEl.css();
		}
	}
	//删除额外css
	hm.prototype.delStyle=function(){
		this.selectEl.removeAttr('style');
		this.selectEl.removeClass('animated');
	}
	//预览
	hm.prototype.preview = function(){
		var _this = this ;
		this.selectElSet();
		this.gel('wrap').find('.hm-page').eq(this.nowPage-1).css('display','none');
		setTimeout(function(){
			_this.gel('wrap').find('.hm-page').eq(_this.nowPage-1).css('display','block');
		 },50)
	}
	//发布
	hm.prototype.build = function(callback){
		var _this = this;
		this.selectElSet();
		var hm_copy = this.gel('container').clone();//复制整体
		//元素图片
		var allImg = hm_copy.find('.hm-page img'),
			allPage  = hm_copy.find('.hm-page'),
			audio  = hm_copy.find('.hm-audio').addClass('rotate'),
			allItem = [],
			audioItems = [],
			html = '',
			hm_copy_wrap = $('<div>');
		//全局背景图片
		if(_this.bgSrc){
			var bgItem = {
				id:"bg",
				type:"jpeg",
				src:_this.bgSrc
			}
			allItem.push(bgItem);
			hm_copy.attr('style','background-image:url("images/bg.jpeg")');
		}
		//全部页背景图片
		allPage.each(function(i){
			var $this  = this;
			var bgSrc = $(this).css('background-image');
			if(bgSrc){
				bgSrc = bgSrc.slice(4,bgSrc.length-1);
				var pageBgItem = {
					id:'pBg_'+i,
					type:'jpeg',
					src:bgSrc
				}
				allItem.push(pageBgItem);
				$(this).attr('style','background-image:url("images/pBg_'+i+'.jpeg")');
			}
		})
		//全部元素图片
		allImg.each(function(i){
			var src = $(this).attr('src');
			$(this).attr('data-elid',i);
			var type = $(this).attr('data-type');
			var imgItem = {
				id:i,
				type:type,
				src:src
			};
			allItem.push(imgItem);
			$(this).attr('src','images/'+i+'.'+type);
			$(this).removeAttr("data-elid");
			$(this).removeAttr("data-type");
			$(this).removeAttr("img-scale");
		});
		//背景音乐
		if(this.audio){
			var musicSrc = this.audio.find('audio').eq(0).attr('src');
			var type = this.audio.attr('data-type');
			if(musicSrc){
				var bgMusicItem = {
					id:"bgMusic",
					type:type,
					src:musicSrc,
				}
				audioItems.push(bgMusicItem);
				audio.find('audio').attr('src','bgMusic.'+type);
			}
			
		}

		// 设置html
		hm_copy.find('.hm-content').removeAttr('style');
		hm_copy.find('.hm-page').removeClass('active').css('display','none').eq(0).css('display','block');
		// 行内样式 转换
		var cssText = '';
		var classNameText = 'hm-el-class-';
		hm_copy.find('.hm-wrap').find('*').each(function(i){
			if(typeof $(this).attr('style') === 'string'){
				var oneClassNameText = classNameText+i;
				var oneCssText = '.'+oneClassNameText+'{'+$(this).attr('style')+'}';
				$(this).addClass(oneClassNameText).removeAttr('style');
				cssText += oneCssText;
			}
		})
		console.info(cssText);
		//字符串形式输出
		html = hm_copy_wrap.append(hm_copy).html().replace(/></g, ">\n <");
		callback(allItem,audioItems,html,cssText);
		//this.clean();
	}
	hm.prototype.clean = function(){
		this.gel('wrap').empty();
		this.nowPage = 0;
		this.pageListCtrl.clean();
	}
	hm.prototype.on=function(type, fn) {//自定义事件
	if (typeof this.handler[type] == 'undefined') {
		this.handler[type] = [];
	}
	this.handler[type].push(fn);
	}
	hm.prototype.fire = function(type, data) {
		if (this.handler[type] instanceof Array) {
			var handler = this.handler[type];
			for (var i = 0; i < handler.length; i++) {
				handler[i](data);
			}
		}
	}

 //

})()
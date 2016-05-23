(function($){
	window.hm = function(config){
		this.config = {
			width:640,
			height:1010,
			w_con:$('#index')
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
		this.gel("wrap").css({
			width:_this.cfg.width,
			height:_this.cfg.height
		}).onePage();
		//
		this.gel("wrap").find('.hm-page').eq(0).addClass('active');
		//
		this.elDrag();
		//
		this.pageListPanel();
	}
	//添加新页
	hm.prototype.addPage = function(){
		var page = $('<div class="hm-page">');
		this.gel('wrap').find('.hm-page').css('display','none').removeClass('active');
		this.gel('wrap').append(page);
		page.addClass('active');
		this.nowPage = this.gel('wrap').find('.hm-page').length;
		this.pageListCtrl.addItem(this.nowPage);
		console.log(this.nowPage);
	}
	hm.prototype.delPage = function(){
		var allPage = this.gel('wrap').find('.hm-page').length;
		this.gel('wrap').find('.hm-page').eq(this.nowPage-1).remove();
		if(this.nowPage == allPage!=0){
			this.nowPage--;
			console.log(111);
		}
		this.gotoPage(this.nowPage);
		this.pageListCtrl.delItem(this.nowPage);
	}
	//跳转到某页
	hm.prototype.gotoPage = function(i){
		this.nowPage = i;
		this.selectElSet();
		this.gel('wrap').find('.hm-page').css('display','none').removeClass('active');
		this.gel('wrap').find('.hm-page').eq(i-1).css('display','block').addClass('active');
	}
	//pageList控制
	hm.prototype.pageListPanel = function(){
		var _this = this;
		this.pageListCtrl = {
			el:$('.page-list'),
			init:function(){
				this.ul = $('<ul class="page-ul">');
				this.el.append(this.ul);
				this.addItem(1);
				this.itemClick();
			},
			addItem:function(i){
				var li = $('<li class="page-li">');
				this.ul.append(li);
				this.setSelected(i);
				this.updataItem();
			},
			delItem:function(i){
				this.ul.find('li').eq(i-1).remove();
				this.setSelected(i);
				this.updataItem();
				console.log('del'+_this.nowPage)
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
					$this.setSelected(index);
					_this.gotoPage(index);
					console.log(_this.nowPage);
				})
			},
			setSelected:function(i){
				this.ul.find('li').removeClass('active');
				this.ul.find('li').eq(i-1).addClass('active');
			},
			clean:function(){
				this.ul.empty();
			}
		}
		this.pageListCtrl.init();
	}
	//添加图片元素
	hm.prototype.addImgEl =  function(files){
		//通过input files添加图片
		var _this  = this;
		for (var i = 0; i < files.length; i++) {   
		    var file = files[i];   
		    var imageType = /image.*/;
		    //通过type属性进行图片格式过滤 
		    var type =  file.type.split("/")[1];

		    if (!file.type.match(imageType)) {   
		      continue;   
		    }
		    var reader = new FileReader();   
		    reader.readAsDataURL(file);
		    reader.type =    type;
		   	reader.onload = function(e){ 
		        //e.target.result返回的即是图片的dataURI格式的内容 
		        var img = new Image();
		        img.src = e.target.result;
		        $(img).attr('data-type',this.type);  
		        _this.createEl(img);
		    }  
		}
	}
	//添加文本元素
	hm.prototype.addTxtEl = function(txt){
		if(!txt||txt==''){
			throw new Error('请先添加文本');
			return;
		}
		var text = $('<p>');
		text.html(txt).css('font-size','2em');
		this.createEl(text);
	}
	hm.prototype.setFontSize = function(size){
		if(this.isSelected(size)){
			this.selectEl.find("p").css('font-size',size+'em');
		}
	}
	hm.prototype.setFontColor = function(color){
		if(this.isSelected(color)){
			this.selectEl.find("p").css('color',color);
		}
	}

	//创建元素
	hm.prototype.createEl = function(els){
		if(!els){
			throw new Error('添加元素失败');
			return;
		}
		var el = $('<div class="hm-el">');
		el.append(els);
		this.gel("wrap").find('.hm-page').eq(this.nowPage-1).append(el);
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
		var multiple = this.gel("wrap").get(0).multiple,
			top = _this.gel("wrap").offset().top,
			left = _this.gel("wrap").offset().left;
		
		this.isDraging = false;
		this.gel("wrap").on('mousedown',function(e){
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
			//console.log(this.elTop);
		})
		this.gel("wrap").on('mousemove','.hm-el',function(e){
			if(!_this.isDraging) return false;
			var e = e || window.event;

			$(this).css({
				// top:(e.clientY+sTop-top-elHeight/2)/multiple,
				// left:(e.clientX-left-elWidth/2)/multiple
				top:(e.clientY-top-this.elTop)/multiple,
				left:(e.clientX-left-this.elLeft)/multiple
			});
			//console.log(e.clientX,e.clientY,top,top2,top3,left)
		})
		this.gel("wrap").on('mouseup','.hm-el',function(e){
			_this.isDraging = false;
		})
		this.gel("wrap").on('mouseleave','.hm-el',function(e){
			_this.isDraging = false;
		})
	}
	//阻止事件冒泡捕获
	hm.prototype.eventDefault = function(e){
		if (e.stopPropagation) {
               e.stopPropagation();
           } else {
               e.cancelBubble = true;
           }
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
			return false;
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
			this.selectEl.css({
				'animation-duration':nowAnim.duration+'s',
				'animation-delay':nowAnim.delay+'s',
				'animation-iteration-count':nowAnim.count
			});
			console.log(newAnim);
		}
	}
	//删除动画
	hm.prototype.delAnimate = function(type){
		if(this.isSelected(type)){
			this.selectEl.attr('class','hm-el selected');
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
	//预览
	hm.prototype.preview = function(){
		var _this = this ;
		console.log('preview');
		this.selectElSet();
		//this.gel('wrap').find('.hm-page').removeClass('active');
		this.gel('wrap').find('.hm-page').eq(this.nowPage-1).css('display','none');
		setTimeout(function(){
			//_this.gel('wrap').find('.hm-page').eq(_this.nowPage-1).addClass('active');
			_this.gel('wrap').find('.hm-page').eq(_this.nowPage-1).css('display','block');
		 },50)
	}
	//发布
	hm.prototype.build = function(callback){
		var _this = this;
		this.selectElSet();
		var hm_copy = this.gel('container').clone();
		
		var allImg = hm_copy.find('.hm-page img'),
			allItem = [],
			html = '',
			hm_copy_wrap = $('<div>');
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
		})
		// 设置html
		hm_copy.find('.hm-wrap').attr('style','none').css({
			width:_this.cfg.width,
			height:_this.cfg.height
		});
		hm_copy.find('.hm-page').removeClass('active').css('display','none').eq(0).addClass('active').css('display','block');
		html = hm_copy_wrap.append(hm_copy).html();
		console.log(html);
		callback(allItem,html);
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

})(Zepto)
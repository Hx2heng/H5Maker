(function(){
	//十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	/*RGB颜色转换为16进制*/
	String.prototype.colorHex = function(){
	    var that = this;
	    if(/^(rgb|RGB)/.test(that)){
	        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
	        var strHex = "#";
	        for(var i=0; i<aColor.length; i++){
	            var hex = Number(aColor[i]).toString(16);
	            if(hex === "0"){
	                hex += hex; 
	            }
	            strHex += hex;
	        }
	        if(strHex.length !== 7){
	            strHex = that;  
	        }
	        return strHex;
	    }else if(reg.test(that)){
	        var aNum = that.replace(/#/,"").split("");
	        if(aNum.length === 6){
	            return that;    
	        }else if(aNum.length === 3){
	            var numHex = "#";
	            for(var i=0; i<aNum.length; i+=1){
	                numHex += (aNum[i]+aNum[i]);
	            }
	            return numHex;
	        }
	    }else{
	        return that;    
	    }
	}; 
	//字符串去空格
	String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　 }

//字符串替换
window.replaceAll = function(str , replaceKey , replaceVal){
  var reg = new RegExp(replaceKey , 'g');//g就是代表全部
  return str.replace(reg , replaceVal || '');
}
})()
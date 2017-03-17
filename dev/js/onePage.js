/*!
 * OnePage v0.1.1
 * "All content in one page"
 * Created by HuangXinZheng
 * Created in 2015.6
 * qq:397323988
 * 使用方法：$('#div').onePage(); 效果：在有宽高的父级容器中水平垂直居中并且把内容全部展示。
 */
(function(){
    $.extend($.fn, {
        onePage: function(position) {
            var methons = {
                setCss: function(multiple) {
                    $(this).css({
                        "transform": "scale(" + multiple + ")",
                        "-moz-transform": "scale(" + multiple + ")",
                        "-webkit-transform": "scale(" + multiple + ")",
                        "-o-transform": "scale(" + multiple + ")",
                        "transform-origin":"0% 0%",
                        "-moz-transform-origin":"0% 0%",
                        "-webkit-transform-origin":"0% 0%",
                        "-o-transform-origin":"0% 0%",
                        "position": "absolute"
                    });
                    $(this).get(0).hasOnePage = true; //是否应用过插件
                    methons.setPosition($(this));
                    //methons.check($(this), multiple);
                },
                setPosition: function(c) {
                    var c_w = c.offset().width,
                        c_h = c.offset().height,
                        w_w = c.parent().width(),
                        w_h = c.parent().height();
                    c.css({
                        'top': (w_h - c_h) / 2,
                        'left': (w_w - c_w) / 2
                    }).fadeIn();
                },
                check: function(c, multiple) {
                    var c_w = Math.floor(c.width() * multiple),
                        c_h = Math.floor(c.height() * multiple),
                        w_w = c.parent().width(),
                        w_h = c.parent().height(); 
                    if (c_w > w_w || c_h > w_h) {
                        console.log('No onePage ele:');
                        console.log(c.get(0));
                        c.css({
                            'width': '100%'
                        });
                    }
                }
            }
            return this.each(function() {
                var w_w = $(this).parent().width(),
                    w_h = $(this).parent().height(),
                    c_w = $(this).width(),
                    c_h = $(this).height(),
                    w_wh = w_w / w_h,
                    c_wh = c_w / c_h;
               		multiple = 1;
                    
                //设置缩放倍数
                if (w_wh < c_wh) {
                    multiple = w_w / c_w;
                } else if (w_wh > c_wh) {
                    multiple = w_h / c_h;
                } else {
                    multiple = w_w / c_w;
                }
                this.multiple =  multiple;    
                methons.setCss.call(this, multiple);
            })
        }
    });
})()
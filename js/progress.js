(function (window){
    function Progress($progressBar, $progressLine, $progressDot){
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }    
    Progress.prototype ={
        constructor: Progress,
        init:function ($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
            //console.log("1:",this);
        },
        isMove : false,
        progressClick:function(callBack) {
            //监听 背景的点击
            var $this = this; //谁调用progressClick这个方法，this就是谁，此时此刻的this就是progress
            //console.log("2.:",this);
            $this.$progressBar.click(function(event){
                //console.log("3:",this);
                //这里面的this是click调用的，此时此刻的this是click调用的，所以这里的this是$progressBar
                //获取背景距离窗口默认位置
                //该方法返回被选元素相对于文档的偏移坐标。它返回一个带有两个属性（以像素为单位的 top 和 left 位置）的对象。
                var normaLeft = $(this).offset().left;
                //获取点击位置距离窗口
                var eventLeft = event.pageX;
                //设置前景宽度
                $this.$progressLine.css("width", eventLeft - normaLeft);
                $this.$progressDot.css("left", eventLeft - normaLeft);
                //计算进度条比例
                var value = (eventLeft - normaLeft) / $(this).width();
                callBack(value);
            })
        },
        progressMove:function(callBack) {
            var $this = this;
            var normaLeft = $this.$progressBar.offset().left;
            var barWidth = $this.$progressBar.width();
            var eventLeft;
            //按下鼠标的监听事件
            $this.$progressBar.mousedown(function(){
                $this.isMove = true;
                //移动事件
                $(document).mousemove(function(event) {
                    var eventLeft = event.pageX;
                    var offset = eventLeft - normaLeft;
                    if(offset >=0 && offset <= barWidth ){
                        $this.$progressLine.css("width", eventLeft - normaLeft);
                        $this.$progressDot.css("left", eventLeft - normaLeft);
                    }
                });
            });
            //抬起事件
            $(document).mouseup(function(){
                $this.isMove = false;
                //在off内移除指定事件
                $(document).off("mousemove");
                //计算进度条比例
                var value = (eventLeft - normaLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress:function(value){
            if(this.isMove) return;
            if(value<0||value>100) return;
            this.$progressLine.css({
                //转化成百分比
                width : value + "%"
            });
            this.$progressDot.css({
                left: value+ "%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);
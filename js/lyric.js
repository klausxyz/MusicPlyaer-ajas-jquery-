(function (window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }    
    Lyric.prototype = {
        constructor: Lyric,
        init:function (path){
            this.path = path;
        },
        times: [],
        lyrics :[],
        index:-1,
        loadLyric : function(callBack){
            var $this = this;
            $.ajax({
                url: $this.path,
                //注意如果读取txt，要写text，不能写txt
                dataType: 'text',
                success: function(data){
                    //console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error: function(e){
                    console.log("出错了：",e);
                },
            });
        },
        parseLyric : function(data){
            var $this = this;
            //清空上一首
            $this.times = [];
            $this.lyrics =[];
            // stringObject.split(separator,howmany)
            // separator必需。字符串或正则表达式，从该参数指定的地方分割 stringObject。
            var array = data.split("\n");
            
            //正则表达式匹配时间
            //[00:00.92]
            var timeReg = /\[(\d*:\d*\.\d*)\]/
            //遍历取出每一条歌词
            $.each(array, function(index,ele){
                //处理歌词
                var lrc = ele.split("]")[1];
                //排除没有歌词的
                if(lrc.length == 1) return true;
                $this.lyrics.push(lrc);
                
                var res = timeReg.exec(ele);
                //console.log(res);
                if(res == null) return true;
                var timeStr = res[1]; //00:00.92
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0])*60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2)); //保留两位小数会自动转成字符创，所以要再转一次
                //方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                $this.times.push(time);

            });
            //console.log($this.lyrics);
        },
        currrentIndex: function(currentTime){
            //console.log(currentTime);
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift(); //删除数组最前面的一个元素
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);
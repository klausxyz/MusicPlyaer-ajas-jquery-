(function (window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype ={
        constructor: Player,
        musiclist:[],
        init: function($audio){
            this.$audio = $audio;
            //好像有点儿明白了，每次往List添加元素的时候，都是往首位置添加，要获取该元素，下标就是0
            this.audio = $audio.get(0);
        },
        currentIndex:-1,
        playMusic : function(index,music){
            //判断是否是同一首
            if(this.currentIndex == index){
                //
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                } 
            }else{
                //不是同一首
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex : function(){
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musiclist.length -1;
            }
            return index;
        },
        nextIndex: function(){
            var index = this.currentIndex + 1;
            if(index > this.musiclist.length - 1){
                index = 0;
            }
            return index;
        },
        changeMusic: function (index) {
            //
            this.musiclist.splice(index,1);
            //判断当前删的是否正在播放音乐前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex -1;
            }
        },
        //使用callBack让别人在调用的时候把一个函数传递进来，然后把格式化好的时间传递给传进来的参数
        musicTimeUpdate: function(callBack){
            var $this = this;
            $this.$audio.on("timeupdate",function(){
                //返回的数据是秒,要进行格式化
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatData(currentTime, duration);
                //如果在这里写return会返回给on调用的这个function
                //把格式化好的时间传递给传进来的参数
                callBack(currentTime,duration,timeStr);
            });
        },
        formatData : function(currentTime, duration){
            var endMin = parseInt(duration / 60); //只取整数
            var endSec = parseInt (duration % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }

            var startMin = parseInt(currentTime / 60); //只取整数
            var startSec = parseInt (currentTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }

            return (startMin + ":" + startSec + "/" + endMin + ":" + endSec);
        },
        musicSeekTo: function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function(value){
            //0 - 1
            if(isNaN(value)) return;
            if(value<0||value>1) return;
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)
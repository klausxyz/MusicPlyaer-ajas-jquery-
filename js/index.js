
$(function(){
    //0.自定义滚动条   
    //初始化
    $('.content_list').mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;

    //1.加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url: '../source/musiclist.json',
            dataType: 'json',
            success: function(data){
                //返回的data数据中包含音频文件地址
                player.musiclist = data;
                //3.1遍历获取到的数据创建每一条音乐
                var $musiclist = $('.content_list ul');
                $.each(data, function(index,ele){
                    var $item =crateMusicItem(index,ele);
                    $musiclist.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
                //index选择器的 index 位置，music 当前的元素（也可使用 "this" 选择器）
                $.each(data,function(index,music){
                    var $item = crateMusicItem(index,music);
                    $musiclist.append($item);
                });
            },
            timeout: 2000,
            error: function(e){
                console.log(e);
            },
        });
    }

    //2.初始化歌曲信息
    function initMusicInfo(music){
        //获取对应的元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAblum = $(".song_info_ablum a");
        var $musicProgressName = $(".music_progress_name ");
        var $musicProgressTime = $(".music_progress_time ");
        var $musicBg = $(".mask_bg");

        //给获取到的元素赋值
        $musicImage.attr("src",music.cover); 
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + "/" + music.singer);
        $musicProgressTime.text("00:00" + "/" + music.time);
        $musicBg.css("background", "url('"+ music.cover +"')" );
    }
    //3.歌词
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        //清空上一首歌词
        var $lyricContainer = $(".song_lyric")
        $lyricContainer.html("");
        var $lyricContainer = $(".song_lyric");
        lyric.loadLyric(function(){
            //创建歌词列表
            $.each(lyric.lyrics, function(index,ele){
                var $item = $("<li>" + ele + "</li>");
                $lyricContainer.append($item);
            });
        });
    }
    //3. 初始化进度条
    initProgress();
    function initProgress(){
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar, $progressLine, $progressDot);
        //传入函数function，function中执行musicSeekTo方法，progressClick返回值function(value)，value又作为musicSeekTo函数的参数
        progress.progressClick(function(value){
            player.musicSeekTo(value);
        });
        progress.progressMove(function(value){
            player.musicSeekTo(value);
        });
        
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar, $voiceLine, $voiceDot);
        //传入函数function，function中执行musicSeekTo方法，progressClick返回值function(value)，value又作为musicSeekTo函数的参数
        voiceProgress.progressClick(function(value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function(value){
            player.musicVoiceSeekTo(value);
        });
    };

    //2.初始化事件监听
    initEvents();
    function initEvents(){
        //1监听歌曲的移入移出事件
        $('.content_list').delegate('.list_music','mouseenter',function(){
            //hover第一个参数，移入
            //显示子菜单
            //$(".list_menu").stop().fadeIn(200);
            $(this).find('.list_menu').stop().fadeIn(10);
            //隐藏时长
            $(this).find('.list_time span').stop().hide();
            $(this).find('.list_time a').stop().fadeIn(10); 
        });
        $('.content_list').delegate('.list_music','mouseleave',function(){
            //hover第二个参数，移出
            //隐藏子
            $(this).find('.list_menu').stop().fadeOut(10); 
            //显示时长
            $(this).find('.list_time a').stop().hide();
            $(this).find('.list_time span').stop().fadeIn(10);
        });

        //2.监听复选框点击事件
        $('.content_list').delegate('.list_check','click',function(){
            $(this).toggleClass("list_checked");
        });

        //3.监听子菜单播放按钮
        var $musicPlay = $('.music_play');
        $('.content_list').delegate(".list_menu_play",'click',function(){
            //找到点击播放对应的父级
            var $item = $(this).parents('.list_music');
            //3.1 替换点选对象的播放图标
            $(this).toggleClass("list_menu_play2");

            //3.2 替换其他播放的图标
            //这里点击的.list_menu_play，其父级元素是.list_music
            //注意！！！removeclass中直接写类名，不用跟一个点
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            
            //3.3同步底部播放按钮
            //遍历子菜单是否包含正在播放按钮
            if($(this).attr('class').indexOf('list_menu_play2') != -1 ){
                $musicPlay.addClass("music_play2");
                $item.find('div').css("color",'rgba(255, 255, 255)')
                $item.siblings().find('div').css("color",'rgba(255, 255, 255, 0.5)');
            }else{
                $musicPlay.removeClass("music_play2");
                $item.find('div').css("color",'rgba(255, 255, 255, 0.5)');
            }
            $item.siblings().find('.list_number2').removeClass('list_number2');
            $item.find('.list_number').toggleClass("list_number2");
            
            //3.4播放音乐
            //从父级的0中获取index和music
            player.playMusic($item.get(0).index, $item.get(0).music);

            //3.5 播放音乐切换背景
            //console.log($item);
            initMusicInfo($item.get(0).music);
            //3.6切换歌词信息
            initMusicLyric($item.get(0).music);
        });
            
        //4.监听播放按钮
        $musicPlay.click(function(){
            if (player.currentIndex == -1){
                //没有播放过音乐
                //自动触发点击
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else{
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        //5.监听上一首
        $(".music_pre").click(function(){
            //引用方法记得加括号preIndex()
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        })
        //6.监听下一首
        $(".music_next").click(function(){
            //引用方法记得加括号nextIndex()
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        }) 
        //7.监听删除
        $(".content_list").delegate(".list_menu_del","click",function(){
            var $item = $(this).parents('.list_music');
            
            //判断当前删的是否正在播放
            if($item.get(0).index == player.currentIndex){
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            //重新排序
            $(".list_music").each(function (index, ele) {
                //ele返回的是遍历的。list_music中的一条li
                ele.index = index;
                //注意text不要拼错
                $(ele).find(".list_number").text(index + 1);
            });
        })
        //8.获取播放进度
        player.musicTimeUpdate(function(currentTime, duration,timeStr){
            //同步进度条
            //计算播放比例
            var value = currentTime / duration * 100; 
            progress.setProgress(value);
            $(".music_progress_time").text(timeStr);
            //同步歌词
            var index = lyric.currrentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if(index <= 2) return;
            $(".song_lyric").css({
                marginTop:( (-index+2) *30),
            });
        });
        //9.监听声音按钮的监听
        $(".music_voice_icon").click(function(){
            //图标且黄
            $(this).toggleClass("music_voice_icon2");
            //声音切换
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //没有声音
                player.musicVoiceSeekTo(0);
            }else{
                //有声
                player.musicVoiceSeekTo(1);
            }
        });
    }
    //定义一个方法创建音乐
    function crateMusicItem(index,music){
        var $item = $(
            '<li class="list_music">'+
            '   <div class="list_check"><i></i></div>'+
            '   <div class="list_number">'+(index + 1)+'</div>'+
            '   <div class="list_name">'+music.name+''+
            '      <div class="list_menu">'+
            '      <a href="javascript:;" title="播放" class ="list_menu_play"></a>'+
            '      <a href="javascript:;" title="添加"></a>'+
            '      <a href="javascript:;" title="下载"></a>'+
            '      <a href="javascript:;" title="分享"></a>'+
            '      </div>'+
            '   </div>'+
            '   <div class="list_singer">'+music.singer+'</div>'+
            '   <div class="list_time">'+
            '      <span>'+music.time+'</span>'+
            '      <a href="javascript:;" title="删除" class ="list_menu_del"></a>'+
            '   </div>'+
            '</li>'
        );
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }
});


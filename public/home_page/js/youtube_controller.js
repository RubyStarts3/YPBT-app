// for hover into popover
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function(obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        self.$tip.one('mouseenter', function() {
            clearTimeout(self.timeout);
            self.$tip.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        })
    }
};

// youtube player controllor
var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('ytplayer',{
        events: {
            'onStateChange': onStateChange,
            'onReady': onReady
        }
    });

}
function onStateChange (){
    return ;
}
function onReady(){
    progress_tracker();
    load_add_poin_func();
}
function seekTo(second){
  player.seekTo(second);
}
function progress_tracker(){
    var duratime = player.getDuration();
    add_func = function(){
        var duration = player.getDuration();
        var point = document.getElementById('add-point');
        var progress = player.getCurrentTime()*100.0/duration;
        point.style.left = 'calc('+progress+'% - 10px)';
    }
    setInterval(add_func,500);
}
function moveAdd(progress){
  var point = document.getElementById('add-point');
  point.style.left = 'calc('+progress+'% - 10px)';
}
function setPlayPoint(e){
  var bar = $('.tag-bar');
  var barX = bar.offset().left;
  var playTotal = bar.width();
  var playPoint = e.pageX - barX;
  var playPercentage = playPoint / playTotal;
  var videoDuration = player.getDuration();
  var playSecond = videoDuration * playPercentage;
  player.seekTo(playSecond);
  console.log('setPlayPoint');
  return false;
}

// get tag detail when mouseenter
function loadDetail(){
 var tag = $(this);
 tag.off( "mouseenter mouseleave" );
 var id =tag.attr('id');
 var popotion = { container: 'body',
                  html: true,
                  placement:'auto bottom',
                  trigger:'hover',
                  delay: {show: 300, hide: 100}};
 $.get('/time_tag/'+id,function(data){
     popotion.content = data;
     tag.popover(popotion);
     if ( tag.filter(':hover').length > 0){
         tag.popover('toggle');
     }
 });
}

// click the like in time tag popover
function ajax_like_tag(id){
    $.ajax({
      type: 'PUT',
      url: '/timetag_add_one_like',
      data: { 'time_tag_id': id },
    });
}
function add_like_count(id,count){
    count.text((+count.text()+1));
    ajax_like_tag(id);
}
function like_tag(like){
    like = $(like);
    if(!like.hasClass('liked')){
        like.removeClass('gray').addClass('liked');
        var tag_detail = like.parents('.tag-detail');
        var tag_id = tag_detail.attr('for');
        var tag_point = $('#'+tag_id);
        var count = tag_detail.find('span.like-count');
        add_like_count(tag_id,count);
        tag_point.data('bs.popover').options.content = tag_detail[0];
    }
    return false;
}

function get_add_form(){
    var crrent_time = player.getCurrentTime();
    player.pauseVideo();
    var form = $('#new_tag_form').clone(true);
    form.attr("for", "popover");
    form.find('[name=start_time]').attr('value',crrent_time);
    return form;
}
function load_add_poin_func(){
    var add_point = $('#add-point');
    var popotion = { container: 'body',
                     html: true,
                     placement:'bottom',
                     trigger:'manual',
                     content: get_add_form};
    add_point.popover(popotion);
    add_point.click(add_point_click);
}
function add_point_click(event){
    event.stopPropagation();
    var add_point = $(this);
    if(add_point.is('[aria-describedby]')){
        add_point.popover('hide');
    }else{
        add_point.popover('show');
    }
}
function close_add_form(event){
    event.preventDefault();
    $('#add-point').popover('hide');
    return false;
}
function submmit_form(event){
    event.preventDefault();
    tag_form = $(".add-tag-form#new_tag_form[for='popover']");
    params = tag_form.serialize();
    ajax_add_new_tag(params);
    $('#add-point').popover('hide');
    return false;
}
function ajax_add_new_tag(params){
    var tag_bar = $('.tag-bar');
    $.ajax({
      type: 'POST',
      url: 'add_new_time_tag',
      data: params,
      success: function(new_tag_point){
        tag_bar.append($(new_tag_point).hover(loadDetail));
      }
    });
}

// load tag bar
function load_tag_bar(video_id){
  var loading_tag = $("#tag-bar-loading");
  var tag_bar = $('.tag-bar');
  $.ajax({
    type: 'GET',
    url: '/tag_bar/' + video_id,
    success: function(tag_bar_loaded){
      loading_tag.remove();
      tag_bar.append(tag_bar_loaded);
      $(".tag-point").hover(loadDetail);
    }
  });
}

function load_pop_videos(){
  console.log("puts anything.");
  $.ajax({
    type: 'GET',
    url: '/get_pop_videos',
    success: function(pop_videos_table){
      var pop_videos = $('#pop-videos');
      pop_videos.append(pop_videos_table);

      var channel_id = $(pop_videos_table).siblings('input[name="channel-id"]').val();
      var pop_video_number = $(pop_videos_table).siblings('.col-md-6.col-sm-3.video-padding').length;
      console.log(channel_id);

      var receive_count = 0;
      update_progress(receive_count, pop_video_number, pop_videos_table);
      
      var client = new Faye.Client('/faye');
      client.subscribe('/' + channel_id, function(message) {
        receive_count = message['text'];;
        update_progress(receive_count, pop_video_number, pop_videos_table);
      });
    }
  });
}
function update_progress(receive_count, pop_video_number, pop_videos_table){
  var pop_videos = $('#pop-videos');
  var symbol_block = $("#symbol");
  var loading_area = pop_videos.find('.progress');
  var loading_value = loading_area.find('.progress-value');
  var loading_bar = loading_area.find('.progress-bar');

  var progress_value = Math.round(receive_count/pop_video_number*100);
  var original_value = parseInt(
                       loading_value.text().split(' ')[1].split('%')[0]);
  if (progress_value > original_value) {
    console.log(receive_count + "," + pop_video_number);
    loading_value.text('Loading... ' + progress_value + '%');
    loading_bar.attr("style", "width:" + progress_value +"%");
  }

  if (progress_value == 100) {
    setTimeout(function () {
      symbol_block.remove();
      loading_area.remove();
      pop_videos.find("*").show();
    }, 1000);
  }
}

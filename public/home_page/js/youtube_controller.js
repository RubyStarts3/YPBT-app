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
  return false;
}

// get tag detail when mouseenter
function loadDetail(){
 var tag = $(this);
 tag.removeClass('new-point');
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
function ajax_click_tag(id){
    $.ajax({
      type: 'PUT',
      url: '/timetag_add_one_click',
      data: { 'time_tag_id': id },
    });
}

function click_tag(tag){
    var tag_id = $(tag).attr('id');
    ajax_click_tag(tag_id);
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
      url: '/add_new_time_tag',
      data: params,
      success: function(new_tag_point){
        // tag_bar.append($(new_tag_point).hover(loadDetail));
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
      websocket_subscribe(video_id);
    }
  });
};

function render_new_tag_point(data){
    var current_points = $('.tag-point');
    var current_points_id = $.map(current_points,function(e){return e.id;});

    if ($.inArray(data['time_tag_id'],current_points_id) == -1){
        var tag_bar = $('.tag-bar');
        var new_point = $('<div class="tag-point new-point" >');
        new_point.css('left',"calc("+data['start_time_percentage']*100+"% - 8px)");
        new_point.css('background-color','rgb(255,160,160)');
        new_point.attr('onclick',"event.stopPropagation(); seekTo("+data['start_time']+");click_tag(this);")
        new_point.attr('id',data['time_tag_id']);
        new_point.attr('data-container','body');
        tag_bar.append(new_point.hover(loadDetail));
    }
}
function websocket_subscribe(video_id) {
  var client = new Faye.Client('/faye');
  var tag_bar = $('.tag-bar');
  client.subscribe('/' + video_id, function(message) {
    timetag_info = message['text'];
    var data = JSON.parse(timetag_info);
    render_new_tag_point(data);
  });
}

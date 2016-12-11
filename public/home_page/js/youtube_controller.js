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
    var add_point = $('#add-point');
    var popotion = { container: 'body',
                     html: true,
                     placement:'bottom',
                     trigger:'click',
                     content: get_add_form};
    add_point.popover(popotion);
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
        point.style.left = progress+'%';
    }
    setInterval(add_func,1000);
}

// get tag detail when mouseenter
function loadDetail(){
 console.log("load detail");
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
//$(".tag-point").hover(loadDetail);

// click the like in time tag popover
function ajax_like_tag(id){
    $.ajax({
      type: 'PUT',
      url: '/timetag_add_one_like',
      data: { 'id': id },
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

// add new tag
// function add_new_tag(){
//     player.pauseVideo();
//     return false;
// }
function get_add_form(){
    var crrent_time = player.getCurrentTime();
    player.pauseVideo();
    var form = $('#new_tag_form').clone(true);
    form.find('[name=start_time]').attr('valuse',Math.floor(crrent_time));
    return form;
}

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
};

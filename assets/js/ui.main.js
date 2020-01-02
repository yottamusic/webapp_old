// =========================================================
// Helper Functions
// =========================================================
function get_domain(){
  var url = window.location.href;
  var arr = url.split("/");
  var result = arr[0] + "//" + arr[2];

  return result;
}
function splash_screen(){
  $('.body-base').css('opacity', '');

  setTimeout(function(){
    $('.loading-screen').animate({
      opacity: 0
    }, 500, function(){
      $(this).remove();
      $('.no-overflow').removeClass('no-overflow');
    })
  }, 2000);
}
function get_parameter(name){
  var result = null, tmp = [];
  location.search.substr(1).split("&").forEach(function (item) {
    tmp = item.split("=");
    if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
  });
  return result;
}
function ui_functions(){
  var current_url = window.location.href;
  var home_url = current_url.replace(/((\w|\-)*\.html|(\?(\w|\-|\=)*))/gi, "");

  $(".drawer").on("click", function () {
    var nav = $(".app-navigation");
    if (nav.hasClass('open')) {
      nav.removeClass('open');
      $('.close-nav, .menu-item, .back-nav').removeClass('visible');
    } else {
      nav.addClass('open');
      $('.close-nav, .menu-item, .back-nav').addClass('visible');
    }
  });

  $('.close-nav').on("click", function () {
    var nav = $(".app-navigation");
    if (nav.hasClass('open')) {
      nav.removeClass('open');
      $('.close-nav, .menu-item, .back-nav').removeClass('visible');
    } else {
      nav.addClass('open');
      $('.close-nav, .menu-item, .back-nav').addClass('visible');
    }
  });
  
  $('.back-nav').on("click", function () {
    var nav = $(".app-navigation");
    if (nav.hasClass('open')) {
      nav.removeClass('open');
      $('.close-nav, .menu-item, .back-nav').removeClass('visible');
    } else {
      nav.addClass('open');
      $('.close-nav, .menu-item, .back-nav').addClass('visible');
    }
    
    setTimeout(function(){
      window.history.back();
    }, 250);
  });

  $("[just-href]").on('click', function(){
    window.location = home_url + $(this).attr('just-href');
  });

  $("[data-href]").on('click', function(){
    var new_url = home_url + $(this).data('href') +  '.html';

    barba.go(new_url);
  });

  if('complete-initial-setup.html' == current_url.replace(home_url, "")){
    setInterval(function(){
      window.location = home_url + 'speaker-mode.html';
    }, 2000);
  }
}



// =========================================================
// WiFi Mode Render
// =========================================================
function ui_render(page, value){
  try{
    if('index' == page){
      if('AP' == value){
        $('.ap-mode-connected').css('display', '');
        $('.round-cta.ap-mode-block').addClass('active');
        $('.sta-mode').css('display', '');
      } else if('STA' == value){
        $('.ap-mode').css('display', '');
        $('.sta-mode-connected').css('display', '');
      } else {
        $('.ap-mode').css('display', '');
        $('.sta-mode').css('display', '');
      }
    }
  } catch(err){}
}
function get_wifi_mode(){
  try{
    $.ajax({
      method: "GET",
      url: get_domain() + "/wifi/api/v1/mode"
    }).done(function(response){
      try{ var data = JSON.parse(response); } catch(e) {}
      ui_render('index',  data['message']);
    }).fail(function(response){
      ui_render('index', '');
    }).error(function(response){
      ui_render('index', '');
    });
  } catch(err) {}
}



// =========================================================
// Create  Speaker List
// =========================================================
function render_speaker_list(){
  try{
    $('.speaker-list-slider').slick({
      infinite: false,
      vertical:true,
      verticalSwiping:true,
      swipeToSlide: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0',
      arrows: false
    });

    $('.speaker-list .speaker-slide').on('click', function(){
      var parent = $(this).parents('.slick-slide')

      if(parent.hasClass('slick-current')){
        $(this).find('.ico-speaker-test').addClass('repulsive').queue(function() {
          try{
            var spkr_id = $(this).data('id');
            $.ajax({
              method: "POST",
              url: get_domain() + "/speakers/api/v1/select",
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify({"speakerID": spkr_id.toString(), "mode": $(this).data('position')})
            });
          } catch(err) {}
          $(this).dequeue();
        }).delay(3000).queue(function() {
          $(this).removeClass("repulsive").dequeue();
        });
      } else {
        $(this).parents('.speaker-list-slider').slick('slickGoTo',$(this).data("slide")).dequeue();
      }
    });

    setTimeout(function(){
      $('.no-display').removeClass('no-display');
      $('.loading-indicator').animate({
        opacity: 0
      }, 500, function(){
        $(this).remove();
      });
    }, 1000);
  } catch(err) {}
}
function render_speakers_list(speakers){
  $('.load-speakers').each(function(){
    var mono_speakers_list = "";
    var right_speakers_list = "";

    if('mono' == $(this).data('mode')){
      var count_ele = "#" + $(this).data('mode') + "-list-count";
      $(count_ele).html(speakers.length);

      for(let i = 0; i < speakers.length; i++){
        let speaker_elem = speakers[i];
        let speaker_array = speaker_elem.split('_');

        let html = '<div class="speaker-slide" data-slide="' + i + '">';
        html = html + '<div class="slide-content"><div class="speaker-set">';
        html = html + '<span class="ico ico-speaker-flat"></span>';
        html = html + '<span class="ico ico-speaker-test" data-id="' + speaker_array[1];
        html = html + '" data-position="mono"></span><span class="ico ico-ok"></span>';
        html = html + '</div><p>SPK ' + speaker_array[1] + '</p></div></div>';

        mono_speakers_list = mono_speakers_list + html;
      }

      $(this).find(".speaker-list-slider").html(mono_speakers_list);
    }

    if('left' == $(this).data('mode') || 'right' == $(this).data('mode')){
      let left_i = 0;
      let right_i = 0;

      for(let i = 0; i < speakers.length; i++){
        let speaker_elem = speakers[i];
        let speaker_array = speaker_elem.split('_');

        if("Left" == speaker_array[2]){
          let html = '<div class="speaker-slide" data-slide="' + left_i + '">';
          html = html + '<div class="slide-content"><div class="speaker-set">';
          html = html + '<span class="ico ico-speaker-flat"></span>';
          html = html + '<span class="ico ico-speaker-test" data-id="' + speaker_array[1];
          html = html + '" data-position="left"></span><span class="ico ico-ok"></span>';
          html = html + '</div><p>SPK ' + speaker_array[1] + '</p></div></div>';

          mono_speakers_list = mono_speakers_list + html;

          left_i++;

        } else if("Right" == speaker_array[2]){
          let html = '<div class="speaker-slide" data-slide="' + right_i + '">';
          html = html + '<div class="slide-content"><div class="speaker-set">';
          html = html + '<span class="ico ico-speaker-flat"></span>';
          html = html + '<span class="ico ico-speaker-test" data-id="' + speaker_array[1];
          html = html + '" data-position="right"></span><span class="ico ico-ok"></span>';
          html = html + '</div><p>SPK ' + speaker_array[1] + '</p></div></div>';

          right_speakers_list = right_speakers_list + html;

          right_i++;
        }
      }

      if('left' == $(this).data('mode')){

        $('#left-list-count').html(left_i);
        $(this).find(".speaker-list-slider").html(mono_speakers_list);

      } else if('right' == $(this).data('mode')){

        $('#right-list-count').html(right_i);
        $(this).find(".speaker-list-slider").html(right_speakers_list);

      }
    }
  }).delay(500).queue(function(){
    render_speaker_list();
  });
}
function create_speaker_list(){
  try{
    $.ajax({
      method: "GET",
      url: get_domain() + "/speakers/api/v1/list"
    }).done(function(response){
      var result = JSON.parse(response);
      var speakers_list = result['message'];
      render_speakers_list(speakers_list.split(','));
    }).fail(function(xhr, status, error) {
      render_speakers_list(["Spkr_ERROR_Left"]);
    });
  } catch(err) {}
}



// =========================================================
// Finally Complete Speaker Setup
// =========================================================
function send_speaker_config(ids, mode){
  try{
    $.ajax({
      method: "POST",
      url: get_domain() + "/speakers/api/v1/config",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({"speakerID": ids, "mode": mode})
    }).done(function(){
      var current_url = window.location.href;
      var home_url = current_url.replace(/((\w|\-)*\.html|(\?(\w|\-|\=)*))/gi, "");

      window.location = home_url + 'z-completed.html';
    });
  } catch(err){}
}
function confirm_selection(){
  $('#confirm-selection').on('click', function(){
    var id_mono = id_left = id_right = false;

    var speakers_list = $(this).parents('.content').find('.load-speakers');

    speakers_list.each(function(){
      let mode = $(this).data('mode');

      if('mono' == mode){
        id_mono = $(this).find('.slick-current').find('.ico-speaker-test').data('id');
      }
      
      else if('left' == mode){
        id_left =  $(this).find('.slick-current').find('.ico-speaker-test').data('id');
      }

      else if('right' == mode){
        id_right =  $(this).find('.slick-current').find('.ico-speaker-test').data('id');
      }
    });
  
    if(id_mono){
      send_speaker_config(id_mono.toString(), 'mono');
    } else if (id_left || id_right){
      send_speaker_config((id_left + ',' + id_right).toString(), 'stereo');
    }
  });
}



function render_wifi(){
  setTimeout(function(){
    var current_url = window.location.href;
    var home_url = current_url.replace(/((\w|\-)*\.html|(\?(\w|\-|\=)*))/gi, "");

    $('.no-display').removeClass('no-display');
    $('.loading-indicator').animate({
      opacity: 0
    }, 500, function(){

      $(this).remove();

      $("[data-href-query]").on('click', function(){
        var new_url = home_url + $(this).data('href-query');
    
        barba.go(new_url);
      });
    });
  }, 1000);
}
function render_wifi_list(wifi){
  $('.wifi-list-base').each(function(){
    var wifi_list = "";

    if(wifi){
      for(let i = 0; i < wifi.length; i++){

        let html = '<div class="wifi-ssid" data-href-query="network-wifi-login.html?ssid=';
        html = html +  wifi[i] + '"><span class="ico ico-wifi"></span>';
        html = html + '<span>' + wifi[i] + '</span>';
        html = html + '</div>';
  
        wifi_list = wifi_list + html;
      }
  
      $(this).html(wifi_list);

      render_wifi();
    } else {
      $(this).html('<div class="wifi-ssid no-wifi"><span>No Wifi Found</span></div>');

      render_wifi();
    }
  });
}
function create_wifi_list(){
  try{
    $.ajax({
      method: "GET",
      url: get_domain() + "/wifi/api/v1/list"
    }).done(function(response){
      var result = JSON.parse(response);
      var wifi_list = result['message'];
      render_wifi_list(wifi_list.split(','));
    }).fail(function(xhr, status, error) {
      render_wifi_list(["false"]);
    });
  } catch(err) { render_wifi_list(false); }
}



function pre_set_wifi_login_form(){
  var ssid = get_parameter("ssid");

  if(ssid){
    $('#username').attr('value', ssid);
  }

  $('.wifi-login-form').submit(function(e){
    var username = $(this).find("#username").val();
    var password = $(this).find("#password").val();

    try{
      $.ajax({
        method: "POST",
        url: get_domain() + "/wifi/api/v1/connect",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"ssid": username, "password": password})
      }).done(function(){
        var current_url = window.location.href;
        var home_url = current_url.replace(/((\w|\-)*\.html|(\?(\w|\-|\=)*))/gi, "");
  
        window.location = home_url + 'wifi-connected.html';
      });
    } catch(err){}

    event.preventDefault();
  });
}



// =========================================================
// Function Sequence
// =========================================================
function function_sequence(){
  try{ ui_functions() } catch(err) {}
  try{ getSSIDList() } catch(err) {}
  try{ cmf_init(); } catch(e) {}
}



// =========================================================
// init Barba with a default "opacity" transition
// =========================================================
barba.init({
  transitions: [{
    leave: function (data) {
      var done = this.async();
      $(data.current.container).animate({
        opacity: 0
      }, 250, function(){
        done();
      });
    },
    enter: function (data) {
      var done = this.async();
      $(data.next.container).animate({
        opacity: 1
      }, 250, function(){
        done();
        function_sequence();
      });
    }
  }]
});



// =========================================================
// On Start - Bootstrap Functions
// =========================================================
if (window.addEventListener) {
  window.addEventListener('load', function () {
    try{ splash_screen() }catch(err){}
    try{ function_sequence() }catch(err){}
  });
} else {
  window.attachEvent('onload', function () {
    try{ splash_screen() }catch(err){}
    try{ function_sequence() }catch(err){}
  });
}

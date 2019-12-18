$(function(){

  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      var html = `<div class="message">
                    <div class="message__top-info">
                      <div class="message__top-info__sender">
                        ${message.user_name}
                      </div>
                      <div class="message__top-info__time">
                        ${message.time}
                      </div>
                    </div>
                  </div>
                  <div class="message__top-info__text">
                    ${message.content}
                    <img src="${message.image}">
                  </div>`;//メッセージに画像が含まれる場合のHTMLを作る
    } else {
      var html =  `<div class="message">
                    <div class="message__top-info">
                      <div class="message__top-info__sender">
                        ${message.user_name}
                      </div>
                      <div class="message__top-info__time">
                        ${message.time}
                      </div>
                    </div>
                  </div>
                  <div class="message__top-info__text">
                    ${message.content}
                  </div>`;//メッセージに画像が含まれない場合のHTMLを作る
    }
    return html
  }

function scroll() {
  $('.main__chat__message__board').animate({ scrollTop: $('.main__chat__message__board')[0].scrollHeight});
}

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);     
      $('.main__chat__message__board').append(html);
      $('#new_message')[0].reset()
      $('.text__send-btn').prop('disabled', false);
      scroll()
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.text__send-btn').prop('disabled', false);
  })
  })
});
$(function(){

 

  var buildHTML = function (message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.content && message.image) {
      var html = `<div class="message" data-message-id="${message.id}">
                    <div class="message__top-info">
                      <div class="message__top-info__sender">
                        ${message.user_name}
                      </div>
                      <div class="message__top-info__time">
                        ${message.created_at}
                      </div>
                    </div>
                  </div>
                  <div class="message__top-info__text">
                    ${message.content}
                    <img src="${message.image}">
                  </div>`;//メッセージに画像が含まれる場合のHTMLを作る
    } else if (message.content) {
      var html = `<div class="message" data-message-id="${message.id}">
                    <div class="message__top-info">
                      <div class="message__top-info__sender">
                        ${message.user_name}
                      </div>
                      <div class="message__top-info__time">
                        ${message.created_at}
                      </div>
                    </div>
                  </div>
                  <div class="message__top-info__text">
                    ${message.content}
                  </div>`;//メッセージに画像が含まれない場合のHTMLを作る
    } else if (message.image) {
      var html = `<div class="message" data-message-id="${message.id}">
                    <div class="message__top-info">
                      <div class="message__top-info__sender">
                        ${message.user_name}
                      </div>
                      <div class="message__top-info__time">
                        ${message.created_at}
                      </div>
                    </div>
                  </div>
                  <div class="message__top-info__text">
                    <img src="${message.image}">
                  </div>`;
    };
    return html;
  };

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

    var reloadMessages = function(){
      if (window.location.href.match(/\/groups\/\d+\/messages/)){    // group/:group_id/messagesというURLの時だけ、以降の記述が実行されます。
      var href = 'api/messages#index {:format=>"json"}'              // リクエスト先と形式を指定しています。
      var last_message_id = $('.message:last').data('message-id');   // カスタムデータ属性を利用して、最新のメッセージIDを取得しています。

      // ajaxの形式をそれぞれ指定しています。
      $.ajax({
        url:  href,
        type: 'GET',
        data: {id: last_message_id},
        dataType: 'json'
      })


      .done(function(messages){        // フォームに入力されたデータを引数として取得しています。
        var insertHTML='';
          messages.forEach(function(message){
            insertHTML = buildHTML(message);
            $('.main__chat__message__board').append(insertHTML);
            $('.main__chat__message__board').animate({ scrollTop: $('.main__chat__message__board')[0].scrollHeight});
          });
      })
      .fail(function(){
        alert("自動更新に失敗しました")
      });
    };
  };
  setInterval(reloadMessages, 7000);
});
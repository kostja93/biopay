// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var full_name = "";
var full_iban = "";

$(document).ready(function(){
  $('.modal-trigger').leanModal();
  $('#video').materialbox();

  navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
  navigator.getMedia({video:true, audio:false},
      function (mediaStream) {
          var video = document.getElementsByTagName('video')[0];
          video.src = window.URL.createObjectURL(mediaStream);
          video.play();
      },
      //handle error
      function (error) {
          console.log(error);
      });

  var buyableItems = [
      {type: 'snooze', name: 'Apple MacBook Pro', price: 29.99},
      {type: 'translate', name: 'POST/bank Notizblock', price: 9.99},
      {type: 'web', name: '', price: 49.99},
      {type: 'today', name: 'Jacket', price: 129.99}
  ];
  var full_price = 0;

  function CheckoutList() {
      var checkoutList = $('#checkout-list');
      var list = [];

      var render = function () {
          checkoutList.html('');
          full_price = 0;
          $(list).each(function (index, item) {
              var $li = $('<li class="collection-item avatar"></li>');
              $li.append('<i class="material-icons circle">'+
                  item.type+'</i><span class="title">'+item.name+'</span><p>'+item.price+' €</p>');

              full_price += item.price;
              checkoutList.append($li);
          });
          full_price = full_price.toFixed(2);
          var $li = $('<li class="collection-item avatar"></li>');
          $li.append('<i class="material-icons circle">star</i><span class="title"><b>Full Price</b></span><p>'+full_price+' €</p>');
          checkoutList.append($li);

          $('#checkout_info').html('<h5 class="white-text">Einkauf scannen</h5>');
          $('#checkout_info').append('<p>Items: '+list.length+'</p>');
          $('#checkout_info').append('<p>Price: '+full_price+'</p>');
      };

      $(buyableItems).each(function(i, item) {
          var card = $('<div class="row modal-close"> <div class="col s12 m6"><div class="card blue-grey darken-1"><div class="card-content white-text">'+
              '<span class="card-title">'+item.name+'<p>'+item.price+' €</p></span></div>'+
              '<div class="card-action"><a href="#">add to checkout</a></div></div></div></div>');
          card.click(function () {
              list.push(buyableItems[i]);
              render();
          });
          $('.modal-content').append(card);
      });

      return {render: render, list: list}
  }

  $('#pay').click(function () {
      App.payChannel.send({amount: full_price, name: full_name, iban: full_iban});

      $('.progress').html('<div class="indeterminate"></div>');
      $('#payed').html('Sending Money');
  });

  $(document).keypress(function(key) {
      console.log(key.keyCode);
      if (key.keyCode == 32) {

          var canvas = document.getElementById('canvas');
          var context = canvas.getContext('2d');
          var video = document.getElementById('video');
          context.drawImage(video, 0, 0, 320, 240);
          var bytes = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
          App.photoChannel.send({image: bytes});

          $('#payed').html('Sending Picture to Microsoft Service');
          $('.progress').html('<div class="indeterminate"></div>');
          $('#eye').show()
      }

      if (key.keyCode == 13) {
          cl.list.push(buyableItems.pop());
          cl.render();
          document.getElementById('beep').play()
      }
  });
  var cl = CheckoutList();
});

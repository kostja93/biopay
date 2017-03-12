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
      {type: 'snooze', name: 'Chips', price: 2.99},
      {type: 'translate', name: 'Salzstangen', price: 0.99},
      {type: 'web', name: 'Erdnuss Flips', price: 1.99},
      {type: 'today', name: 'Kasten Rothaus', price: 15.99}
  ];

  var cartItems = [];

  var total = 0;

  var started = false;

  var consumer_id = parseInt(Math.random() * 10000).toString();
  App.cable.subscriptions.create({
    channel: "IdentificationChannel",
    consumer_id: consumer_id
  }, {
    received: function(data) {
      data = JSON.parse(data);
      console.log(data);
      if (data.result == "fail") {
        run();
      } else {
        $("#canvas").removeClass("hidden");
        $("#video").addClass("hidden");

        $("#identification").removeClass("hidden");
        $("#identification").append("<p>Benutzer: "+ data.name + "</p> <p>IBAN: " + data.iban + "</p>")

        //draw face
        face = data.faceDetails
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.beginPath();
        context.strokeStyle = 'yellow';
        context.lineWidth=3;
        context.closePath()
        context.strokeRect(face.faceRectangle.left, face.faceRectangle.top, face.faceRectangle.height, face.faceRectangle.width);
        context.fill();

        //mouth
        context.beginPath();
        context.strokeStyle = '#00FF00';
        context.lineWidth=2;
        context.moveTo(face.faceLandmarks.mouthLeft.x,face.faceLandmarks.mouthLeft.y);
        context.lineTo(face.faceLandmarks.mouthRight.x,face.faceLandmarks.mouthRight.y);
        context.stroke();

        //other landmarks
        context.beginPath();
        context.fillStyle = '#00FF00';
        context.fillRect(face.faceLandmarks.pupilLeft.x, face.faceLandmarks.pupilLeft.y, 5, 5);
        context.fillRect(face.faceLandmarks.pupilRight.x, face.faceLandmarks.pupilRight.y, 5, 5);

        context.fillRect(face.faceLandmarks.noseTip.x, face.faceLandmarks.noseTip.y, 5, 5);
        context.stroke();
      }

      // full_name = data.name || "Peter Pan";
      // full_iban = data.iban || "DE12345678";
      //
      // $('#person_info').html('<h5 class="white-text">Person erkennen</h5>');
      // $('#person_info').append('<p>Name: '+full_name+'</p>');
      // $('#person_info').append('<p>IBAN: '+full_iban+'</p>');
      //
      // $('.progress').html('<div class="determinate" style="width: 100%"></div>');
      // $('#payed').html('IBAN Available<i class="material-icons green-text">done</i>');
      // $('.eye').hide();
    }
  });

  App.photoChannel = App.cable.subscriptions.create({channel: 'PhotoChannel', consumer_id: consumer_id});


function run() {
  $('#video').addClass('video-working');

  /* start the whole thing after 2 seconds */
  setTimeout(function() {
    var canvas = document.getElementById('canvas');

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    var video = document.getElementById('video');

    context.drawImage(video, 0, 0, $(video).width(), $(video).height());

    var bytes = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');

    App.photoChannel.send({image: bytes});
  }, 20)
}

  $(document).keypress(function(key) {
      console.log(key.keyCode);

      if (key.keyCode == 32) {
        // Zahlung
        $('#payment-in-progress').removeClass('hidden');
        setTimeout(function() {
          $('#payment-in-progress').addClass('hidden');
          $("#payment-success").removeClass('hidden');
        }, 1500);

      }

      if (key.keyCode == 13) {

          if (!started) {
            started = true;
            run();
            $("#video").addClass("identification-working");
          }

            item = buyableItems.pop();
            if (item == undefined){
              return
            }
            cartItems.push(item);
            total = total + item.price

            console.log(cartItems);

            $('#item-table tbody').append("<tr><td>"+ item.name + "</td><td> " +item.price+ "</td></tr>");
            $("#total").html(total);


          document.getElementById('beep').play()


      }
      //
      // if (key.keyCode == 32) {
      //
      //     var canvas = document.getElementById('canvas');
      //     var context = canvas.getContext('2d');
      //     var video = document.getElementById('video');
      //     context.drawImage(video, 0, 0, 320, 240);
      //     var bytes = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      //     App.photoChannel.send({image: bytes});
      //
      //     $('#payed').html('Sending Picture to Microsoft Service');
      //     $('.progress').html('<div class="indeterminate"></div>');
      //     $('.eye').show();
      // }
  });

  //
  // function CheckoutList() {
  //     var itemTable = $('#item-table');
  //     var items = [];
  //
  //     var render = function () {
  //         checkoutList.html('');
  //         full_price = 0;
  //         $(list).each(function (index, item) {
  //             var $li = $('<li class="collection-item avatar"></li>');
  //             $li.append('<i class="material-icons circle">'+
  //                 item.type+'</i><span class="title">'+item.name+'</span><p>'+item.price+' €</p>');
  //
  //             full_price += item.price;
  //             checkoutList.append($li);
  //         });
  //         full_price = full_price.toFixed(2);
  //         var $li = $('<li class="collection-item avatar"></li>');
  //         $li.append('<i class="material-icons circle">star</i><span class="title"><b>Full Price</b></span><p>'+full_price+' €</p>');
  //         checkoutList.append($li);
  //
  //         $('#checkout_info').html('<h5 class="white-text">Einkauf scannen</h5>');
  //         $('#checkout_info').append('<p>Items: '+list.length+'</p>');
  //         $('#checkout_info').append('<p>Price: '+full_price+'</p>');
  //     };
  //
  //     $(buyableItems).each(function(i, item) {
  //         var card = $('<div class="row modal-close"> <div class="col s12 m6"><div class="card blue-grey darken-1"><div class="card-content white-text">'+
  //             '<span class="card-title">'+item.name+'<p>'+item.price+' €</p></span></div>'+
  //             '<div class="card-action"><a href="#">add to checkout</a></div></div></div></div>');
  //         card.click(function () {
  //             list.push(buyableItems[i]);
  //             render();
  //         });
  //         $('.modal-content').append(card);
  //     });
  //
  //     return {render: render, list: list}
  // }
  //
  // $('#pay').click(function () {
  //     App.payChannel.send({amount: full_price, name: full_name, iban: full_iban});
  //
  //     $('.progress').html('<div class="indeterminate"></div>');
  //     $('#payed').html('Sending Money');
  // });
  //
  // $(document).keypress(function(key) {
  //     console.log(key.keyCode);
  //     if (key.keyCode == 32) {
  //
  //         var canvas = document.getElementById('canvas');
  //         var context = canvas.getContext('2d');
  //         var video = document.getElementById('video');
  //         context.drawImage(video, 0, 0, 320, 240);
  //         var bytes = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
  //         App.photoChannel.send({image: bytes});
  //
  //         $('#payed').html('Sending Picture to Microsoft Service');
  //         $('.progress').html('<div class="indeterminate"></div>');
  //         $('.eye').show();
  //     }
  //
  //     if (key.keyCode == 13) {
  //         cl.list.push(buyableItems.pop());
  //         cl.render();
  //         document.getElementById('beep').play()
  //     }
  // });
  // var cl = CheckoutList();
  //
  //   var hide = function () {
  //       $('#eye').hide('fade');
  //       setTimeout(show, 1000);
  //   };
  //   var show = function () {
  //       $('#eye').show('fade');
  //       setTimeout(hide, 1000);
  //   };
  //   hide();
});

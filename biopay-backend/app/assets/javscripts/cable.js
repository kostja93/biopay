// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the rails generate channel command.
//
//= require action_cable
//= require_self

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();
  //
  //
  // App.payChannel = App.cable.subscriptions.create({
  //   channel: 'PayChannel',
  //   consumer_id: consumer_id
  // }, {
  //   received: function (data) {
  //     data = JSON.parse(data);
  //     $('#payment_info').append('<p>Amount: '+data.amount+'</p>');
  //     $('#payment_info').append('<p>IBAN: '+data.iban+'</p>');
  //     $('.progress').html('<div class="determinate" style="width: 100%"></div>');
  //     $('#payed').html('Payed<i class="material-icons green-text">done</i>');
  //     document.getElementById('ching').play()
  //   }
  // });
}).call(this);

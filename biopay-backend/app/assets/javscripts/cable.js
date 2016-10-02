// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the rails generate channel command.
//
//= require action_cable
//= require_self

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();
  var consumer_id = parseInt(Math.random() * 10000).toString();

  App.cable.subscriptions.create({
    channel: "IdentificationChannel",
    consumer_id: consumer_id
  }, {
    received: function(data) {
      data = JSON.parse(data);
      full_name = data.name || "Peter Pan";
      full_iban = data.iban || "DE12345678";

      $('#person_info').html('<h5 class="white-text">Person erkennen</h5>');
      $('#person_info').append('<p>Name: '+full_name+'</p>');
      $('#person_info').append('<p>IBAN: '+full_iban+'</p>');

      $('.progress').html('<div class="determinate" style="width: 100%"></div>');
      $('#payed').html('IBAN Available<i class="material-icons green-text">done</i>');
      $('#eye').hide();
    }
  });

  App.photoChannel = App.cable.subscriptions.create({channel: 'PhotoChannel', consumer_id: consumer_id});

  App.payChannel = App.cable.subscriptions.create({
    channel: 'PayChannel',
    consumer_id: consumer_id
  }, {
    received: function (data) {
      data = JSON.parse(data);
      $('#payment_info').append('<p>Amount: '+data.amount+'</p>');
      $('#payment_info').append('<p>IBAN: '+data.iban+'</p>');
      $('.progress').html('<div class="determinate" style="width: 100%"></div>');
      $('#payed').html('Payed<i class="material-icons green-text">done</i>');
      document.getElementById('ching').play()
    }
  });
}).call(this);

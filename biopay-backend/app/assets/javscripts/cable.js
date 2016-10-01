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
      alert(data);
    }
  });

  App.photoChannel = App.cable.subscriptions.create({channel: 'PhotoChannel', consumer_id: consumer_id});
  App.payChannel = App.cable.subscriptions.create({channel: 'PayChannel', consumer_id: consumer_id});
}).call(this);

require 'base64'
require 'tempfile'

class PayChannel < ApplicationCable::Channel
  def receive(data)
    consumer_id = params[:consumer_id]
    amount = Float(data['amount'])
    response = {
      result: 'fail',
      name: data.fetch('name'),
      iban: data.fetch('iban'),
      amount: amount
    }
    result = PostbankTransferService.(amount)
    response.merge!(result: 'success') if result

    ActionCable.server.broadcast("pay_#{consumer_id}", response.to_json)
  end

  def subscribed
    stream_from "pay_#{params[:consumer_id]}"
  end
end

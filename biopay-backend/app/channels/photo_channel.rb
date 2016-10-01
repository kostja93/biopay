class PhotoChannel < ApplicationCable::Channel
  def receive(data)
    consumer_id = params[:consumer_id]
    iban = RecognizeFaceService.(data)
    amount = 1
    if iban
      result = PostbankTransferService.(amount)
      ActionCable.server.broadcast("identification_#{consumer_id}", result ? 'success' : 'fail')
    else
      ActionCable.server.broadcast("identification_#{consumer_id}", 'fail')
    end

  end
end

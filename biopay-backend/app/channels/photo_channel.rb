class PhotoChannel < ApplicationCable::Channel
  def receive(data)
    consumer_id = params[:consumer_id]
    result = RecognizeFaceService.(data)
    ActionCable.server.broadcast("identification_#{consumer_id}", result)
  end
end

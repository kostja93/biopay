class IdentificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "identification_#{params[:consumer_id]}"
  end
end

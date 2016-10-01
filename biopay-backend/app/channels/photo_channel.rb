require 'base64'
require 'tempfile'

class PhotoChannel < ApplicationCable::Channel
  def receive(data)
    consumer_id = params[:consumer_id]
    image = Base64.decode64(data['image'])
    Tempfile.open do |f|
      f.binmode
      f.write image
      f.flush

      result = RecognizeFaceService.(f.path)
      if result[:result] == 'success'
        payload = { name: result[:name], iban: result[:iban], result: 'success' }
        ActionCable.server.broadcast("identification_#{consumer_id}", payload.to_json)
      else
        ActionCable.server.broadcast("identification_#{consumer_id}", { result: 'fail' }.to_json)
      end
    end
  end
end

class RecognizeFaceService
  def self.call(path)
    new.call(path)
  end

  def call(path)
    person_group = "pbh-ber-biopay"
    api_base_url = "https://api.projectoxford.ai/face"
    api_key = ENV['COGNITION_API_KEY']

    begin
      result = RestClient.post "#{api_base_url}/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceId=true&returnFaceLandmarks=false", File.new(path, 'rb'), content_type: 'application/octet-stream; charset=binary', :ocp_apim_subscription_key => api_key

      face_id = JSON.parse(result.body).first["faceId"]
      identification_result = RestClient.post "#{api_base_url}/v1.0/identify", {personGroupId: person_group, faceIds: [face_id], maxNumOfCandidatesReturned: 1, confidenceThreshold: "0.5"}.to_json, content_type: 'json', :ocp_apim_subscription_key => api_key
      candidate = JSON.parse(identification_result.body).first["candidates"].first

      person_details_result = RestClient.get "#{api_base_url}/v1.0/persongroups/#{person_group}/persons/#{candidate["personId"]}", content_type: 'json', :ocp_apim_subscription_key => api_key
      person_details = person_details_result.body
      puts "identified #{person_details} with confidence #{candidate["confidence"]}"
      person_details
    rescue RestClient::ExceptionWithResponse => e
      puts e.response.body
    end
  end
end

#RecognizeFaceService.('./lib/tasks/Fabian/1.jpg')

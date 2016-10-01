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

      parsed_results = JSON.parse(result.body)
      return {result: "fail", message: "No face detected."} if parsed_results.empty?

      face_id = parsed_results.first["faceId"]

      identification_result = RestClient.post "#{api_base_url}/v1.0/identify", {personGroupId: person_group, faceIds: [face_id], maxNumOfCandidatesReturned: 1, confidenceThreshold: "0.5"}.to_json, content_type: 'json', :ocp_apim_subscription_key => api_key
      candidate = JSON.parse(identification_result.body).first["candidates"].first

      return {result: "fail", message: "No known face recognized."} if JSON.parse(identification_result.body).first["candidates"].empty?

      person_details_result = RestClient.get "#{api_base_url}/v1.0/persongroups/#{person_group}/persons/#{candidate["personId"]}", content_type: 'json', :ocp_apim_subscription_key => api_key
      person_details = JSON.parse(person_details_result.body)
      puts "identified #{person_details} with confidence #{candidate["confidence"]}"

      user_data = JSON.parse(person_details["userData"])
      return {result: "success", name: person_details["name"], iban: user_data["iban"]}
    rescue RestClient::ExceptionWithResponse => e
      return {result: "fail", message: JSON.parse(e.response.body)["error"]["message"]}
    end
  end
end

#RecognizeFaceService.('./public/demo.jpg')

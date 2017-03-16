namespace :biopay do
  desc "TODO"
  task cognitive_setup: :environment do
    RestClient.log = 'stdout'

    #clean up person group
    person_group = "pbh-ber-biopay"
    api_base_url = "https://westus.api.cognitive.microsoft.com/face"
    api_key = ENV['COGNITION_API_KEY']

    begin
      RestClient.delete "#{api_base_url}/v1.0/persongroups/#{person_group}", content_type: 'json', :ocp_apim_subscription_key => api_key

      #register person group @ Microsoft Cognitive API
      RestClient.put "#{api_base_url}/v1.0/persongroups/#{person_group}", {name: 'Default Person Group'}.to_json, content_type: 'json', :ocp_apim_subscription_key => api_key

      #add beautiful ppl w/ beautiful faces and add face pictures to train the API
      [{ name: "Fabian", iban: "DE750193123866413939171" }, { name: "Konstantin", iban: "DE750193123866413939172" }, { name: "Felix", iban: "DE750193123866413939173" }].each do |person|
        response = RestClient.post "#{api_base_url}/v1.0/persongroups/#{person_group}/persons", {name: person[:name], userData: {iban: person[:iban]}.to_json}.to_json, content_type: 'json', :ocp_apim_subscription_key => api_key

        person_id = JSON.parse(response.body)["personId"]
        puts "#{person} has personId #{person_id} in the Microsoft Cognition API"

        Dir.glob("public/cognitive_training/#{person[:name]}/*").each do |photo|
          RestClient.post "#{api_base_url}/v1.0/persongroups/#{person_group}/persons/#{person_id}/persistedFaces", File.new(photo, 'rb'), content_type: 'application/octet-stream; charset=binary', :ocp_apim_subscription_key => api_key
        end

        puts "Faces have been uploaded. Enqueueing Face Training Job..."
      end
      RestClient.post "#{api_base_url}/v1.0/persongroups/#{person_group}/train", {}.to_json, content_type: 'json', :ocp_apim_subscription_key => api_key
      loop do
        training_result = RestClient.get "#{api_base_url}/v1.0/persongroups/#{person_group}/training", content_type: 'json', :ocp_apim_subscription_key => api_key
        puts "Training result is #{training_result}"
        break if (JSON.parse(training_result)["status"].in? %w[succeeded failed])
        sleep(1)
      end
    rescue RestClient::ExceptionWithResponse => e
      puts e.response.body
    end
  end
end

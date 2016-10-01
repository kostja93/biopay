class PostbankApi
  def self.merchant
    new(ENV['POSTBANK_USER_MERCHANT'], ENV['POSTBANK_PASS_MERCHANT'])
  end

  def self.customer
    new(ENV['POSTBANK_USER_CUSTOMER'], ENV['POSTBANK_PASS_CUSTOMER'])
  end

  attr_reader :username, :password
  def initialize(username, password)
    @username, @password = username, password
  end

  def accounts
    response = client['/accounts'].get
    json = JSON.parse(response.body)
    json['accounts']
  end

  def token
    @token ||= begin
      response = client(token_headers)["/token?username=#{username}&password=#{password}"].post({})
      json = JSON.parse(response.body)
      json['token']
    end
  end

  def base_uri
    'https://hackathon.postbank.de/bank-api/gold/postbankid'
  end

  def headers
    {
      'X-Auth' => token,
      'API-Key' => ENV['POSTBANK_API_KEY'],
      'Device-Signature' => ENV['POSTBANK_DEV_SIG'],
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end

  def token_headers
    {
      'API-Key' => ENV['POSTBANK_API_KEY'],
      'Device-Signature' => ENV['POSTBANK_DEV_SIG'],
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end

  def client(used_headers = headers)
    RestClient.log = 'stdout'
    RestClient::Resource.new(base_uri, headers: used_headers)
  end
end

class PostbankApi
  def self.merchant
    new(ENV['POSTBANK_USER_MERCHANT'], ENV['POSTBANK_PASS_MERCHANT'])
  end

  def self.merchant_account
    {
      iban: 'DE66100100100001744103',
      bic: 'PBNKDEFF',
      paymentName: 'Mariu Freudeaerc',
      bankName: 'Postbank',
      accountNumber: '1744103',
      accountHolder: 'Mariu Freudeaerc'
    }
  end

  def self.customer
    new(ENV['POSTBANK_USER_CUSTOMER'], ENV['POSTBANK_PASS_CUSTOMER'])
  end

  def self.customer_account
    {
      iban: 'DE92100100100625037117',
      bic: 'PBNKDEFF',
      paymentName: 'Maria Hassaeqz',
      bankName: 'Postbank',
      accountNumber: '625037117',
      accountHolder: 'Maria Hassaeqz'
    }
  end

  attr_reader :username, :password
  def initialize(username, password)
    @username, @password = username, password
  end

  def create_credit_transfer(from, to, amount)
    transfer = {
      creditTransfer: {
        amount: amount,
        bookingDate: Date.today.to_s,
        purpose: ['Bezahlung Verkauf'],
        sender: from,
        recipient: to
      },
      authorizationDevice: authorization_device.merge('authorizationState' => 'SELECTED')
    }
    response = client['/credittransfer'].post(transfer.to_json)
    json = JSON.parse(response.body)

    if links = json['links']
      if link = links.find {|this_link| this_link['rel'] == 'self'}
        link['href']
      end
    end
  rescue RestClient::ExceptionWithResponse => e
    puts "Error creating credit transfer: #{e.inspect}"
    false
  end

  def watch_credit_transfer(endpoint)
    tries = 10
    success = false

    loop do
      tries -= 1
      response = client(used_base_uri: endpoint).get
      json = JSON.parse(response.body)

      if device = json['authorizationDevice']
        if state = device['authorizationState']
          if state.downcase == 'done'
            success = true
          end
        end
      end

      break if success || tries <= 0
    end

    success
  rescue RestClient::ExceptionWithResponse => e
    puts "Error watching credit transfer: #{e.inspect}"
    false
  end

  def credit_transfer_template
    response = client['/credittransfer'].get
    json = JSON.parse(response.body)
    json['creditTransfer']
  end

  def authorization_device
    response = client['/authorizations'].get
    json = JSON.parse(response.body)
    json['bestSign']['devices'].first
  end

  def accounts
    response = client['/accounts'].get
    json = JSON.parse(response.body)
    json['accounts']
  end

  def token
    @token ||= begin
      response = client(used_headers: token_headers)["/token?username=#{username}&password=#{password}"].post({})
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

  def client(used_base_uri: base_uri, used_headers: headers)
    RestClient.log = 'stdout'
    RestClient::Resource.new(used_base_uri, headers: used_headers)
  end
end

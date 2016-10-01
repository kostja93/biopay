class PostbankTransferService
  def self.call(amount)
    new.call(amount)
  end

  def call(amount)
    customer = PostbankApi.customer
    watch_url = customer.create_credit_transfer(PostbankApi.customer_account,
                                                PostbankApi.merchant_account,
                                                amount)
    customer.watch_credit_transfer(watch_url)
  end
end

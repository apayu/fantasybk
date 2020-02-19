Rails.application.config.middleware.use OmniAuth::Builder do
  provider :yahoo_auth, Rails.application.credentials.yahoo[:client_id], Rails.application.credentials.yahoo[:client_secret]
end

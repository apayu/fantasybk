Rails.application.config.middleware.use OmniAuth::Builder do
  # provider :yahoo_auth, Rails.application.credentials.yahoo[:client_id], Rails.application.credentials.yahoo[:client_secret]

  provider :yahoo_auth, "dj0yJmk9ZE13Y2R1NUpmQjRVJmQ9WVdrOVRUQmxZbUUyTjJrbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWRk", "092d6cfdce357fda2ebd5cb0109be1c5e56a9cd8"
end

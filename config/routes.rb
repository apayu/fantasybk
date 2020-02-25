Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#custom'

  devise_for :users
  root "players#index"

  get "/search" => "players#search"

  resources :players, param: :player_id do
    collection do
      post :conditions
    end
  end

  resources :posts

  # API routes
  namespace :api do
    namespace :v1 do
      get "leagues/index", to: "leagues#index"
      get "players/value/:player_id", to: "players#value"
      get "players/log/:player_id", to: "players#log"
      get "players/info/:player_id", to: "players#info"
    end
  end

  resources :leagues
end

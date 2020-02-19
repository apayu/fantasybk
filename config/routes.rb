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

  namespace :api do
    namespace :v1 do
      get "leagues/index", to: "leagues#index"
    end
  end

  resources :leagues
end

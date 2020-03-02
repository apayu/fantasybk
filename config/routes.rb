Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#custom'

  devise_for :users
  root "players#index"

  get "/search" => "players#search"
  get "/pages/about" => "pages#about"
  get "/teams/schedule" => "teams#schedule"
  get "/players/compare" => "players#compare"

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
      get "leagues/roster", to: "leagues#roster"
      get "players/value/:player_id", to: "players#value"
      get "players/log/:player_id", to: "players#log"
      get "players/info/:player_id", to: "players#info"
      get "players/list", to: "players#list"
      get "players/score/:player_id", to: "players#score"
      get "teams/schedule", to: "teams#schedule"
    end
  end

  resources :leagues
end

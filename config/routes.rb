Rails.application.routes.draw do
  devise_for :users
  root "players#index"

  get "/search" => "players#search"

  resources :players, param: :player_id do
    collection do
      post :conditions
    end
  end

  resources :posts
end

Rails.application.routes.draw do
  root "players#index"
  get "/search" => "players#search"
  resources :players, param: :player_id do
    collection do
      post :conditions
    end
  end
end

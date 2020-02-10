Rails.application.routes.draw do
  root "players#index"
  get "/search" => "players#search"
  resources :players, param: :api_person_id do
    collection do
      post :conditions
    end
  end
end

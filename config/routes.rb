Rails.application.routes.draw do
  resources :rounds
  resources :players
  resources :lobbies do
    resources :players
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

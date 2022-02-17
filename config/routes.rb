Rails.application.routes.draw do
  resources :rounds
  resources :players
  resources :lobbies do
    resources :players do
      resources :player_readies
    end
  end

  resource :current_player, only: :show
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

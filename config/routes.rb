Rails.application.routes.draw do
  resources :player_scores
  resources :rounds
  resources :players
  resources :lobbies do
    resources :players do
      resources :player_readies
      resources :player_scores, only: :create
    end

    resources :rounds do
      resource :player_scores, only: :index
    end
  end

  resource :current_player, only: :show
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end


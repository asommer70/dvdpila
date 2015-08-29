Rails.application.routes.draw do
  root 'dvds#index'

  #resources :dvds
  resources :dvds do
    resource :episodes
    resource :bookmarks
  end

  post '/search', to: 'dvds#search', as: 'search'

  resources :episodes, only: [:show, :update, :destroy] do
    resource :bookmarks
  end

  resources :bookmarks, only: [:show, :update, :destroy]
end

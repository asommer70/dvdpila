Rails.application.routes.draw do
  resources :dvds
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'dvds#index'

  resources :dvds do
    resource :episodes
    resource :bookmarks
  end

  resources :episodes, only: [:show, :update, :destroy] do
    resource :bookmarks
  end

  resources :bookmarks, only: [:show, :update, :destroy]
end

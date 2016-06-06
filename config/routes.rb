Rails.application.routes.draw do
  root 'dvds#index'

  #resources :dvds
  resources :dvds do
    resource :episodes
    resource :bookmarks
  end

  post '/search', to: 'dvds#search', as: 'search'
  get '/search.json', to: 'dvds#search_json', as: 'search_json'
  post '/barcode', to: 'dvds#barcode', as: 'barcode'
  post '/ddg', to: 'dvds#ddg', as: 'ddg'
  post '/omdb', to: 'dvds#omdb', as: 'omdb'

  resources :episodes, only: [:show, :update, :destroy] do
    resource :bookmarks
  end

  resources :bookmarks, only: [:show, :update, :destroy]
end

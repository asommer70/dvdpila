WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  # subscribe :new, :to => PlayingsController, :with_method => :create
  #   end
  # The above will handle an event triggered on the client like `product.new`.
  #namesapce :playing do

  subscribe :client_connected, :to => PlayingsController, :with_method => :connected

  subscribe :play, :to => PlayingsController, :with_method => :play
  subscribe :pause, :to => PlayingsController, :with_method => :pause
  subscribe :stop, :to => PlayingsController, :with_method => :stop
  
  subscribe :now, :to => PlayingsController, :with_method => :now

  subscribe :remote_play, :to => PlayingsController, :with_method => :remote_play
  subscribe :remote_pause, :to => PlayingsController, :with_method => :remote_pause
  subscribe :remote_previous, :to => PlayingsController, :with_method => :remote_previous
  subscribe :remote_advance, :to => PlayingsController, :with_method => :remote_advance
  #end
end

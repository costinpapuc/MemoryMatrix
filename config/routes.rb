Rails.application.routes.draw do

  post '/login' => 'main#validate'
  post '/updatescore' => 'main#updatescore'
  post '/pattern' => 'main#pattern'

end

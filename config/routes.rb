Rails.application.routes.draw do

  post '/login' => 'main#validate'
  post '/updatescore' => 'main#updatescore'

end

Rails.application.routes.draw do

  get '/login' => 'main#validate'
  get '/updatescore' => 'main#updatescore'

end

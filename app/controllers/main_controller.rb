class MainController < ActionController::Base

	def validate
		given_name = params[:user]
		given_pass = params[:password]
		login_type = params[:type]

		reply = ""
		error = 0;

		item = LoginDetail.find_by({:username => given_name})
		# login - se cauta sa existe
		if login_type == 'existing'
			if item # s-a gasit username, se verifica parola
				if item.password != given_pass # parola incorecta, eroare
					error = 1
				end
			else # nu s-a gasit username, eroare
				error = 1
			end
			if error == 1 
				reply = "Login error: incorrect username or password."
			end
			if error = 0
				reply = "Login successful."
			end
		end
		# signup - se cauta sa nu existe
		if login_type == 'new'
			if item # s-a gasit username, eroare
				error = 1
				reply = "Signup error: username already exists."
			else # nu s-a gasit username, se creeaza
				LoginDetail.create({:username => given_name,
									:password => given_pass,
									:high_score => 0})
			end
			if error = 0
				reply = "Signup successful."
			end
		end

		render json: {"error" => error, "reply" => reply}
	end

	def updatescore
		user = params[:user]
		score = params[:score].to_i
		usd =  UserStatisticsDetail.create({:username => user, :score => score})
		# iau intrarea din tabela cu detaliile de logare si updatez campul 
		entry = LoginDetail.find_by(:username => user)
		if entry
			if entry.high_score < score
				entry.update(:high_score => score)
			end	
		end
		render json: {}
	end

	def pattern
		r = params[:r].to_i
		c = params[:c].to_i

		row = []
		c.times do
			row.push(0)
		end
		mat = []
		r.times do
			mat.push(row)
		end

		#zones

		render json: {"matrix" => mat}
	end

end
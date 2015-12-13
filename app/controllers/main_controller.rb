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
			if error == 0
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
				reply = "DA"
			end
			if error == 0
				reply = "Signup successful."
			end
		end
		reply += " #{given_name} #{given_pass} #{login_type}"
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
		# 3 <= d <= 15
		d = params[:dimension].to_i

		mat = []
		reply = ""
		error = 0
		if ((d < 3) || (d > 15))
			error = 1
			reply = "The dimension must be in range [3..15]."
		else
			#         0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15
			zones = [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2]
			#
			d.times do
				row = []
				d.times do
					row.push(1)
				end
				mat.push(row)
			end
			if zones[d] == 0 # complet random
				indices = (0..d*d-1).to_a.sort{ rand() - 0.5 }[1..d]
				indices.each { |x| mat[x/d][x%d] = 2 }
			elsif zones[d] == 3
				dd = d
				indices = (0..d*d/2-1).to_a.sort{ rand() - 0.5 }[1..dd/2]
				dd -= dd/2
				indices += (d*d/2..d*d*3/4-1).to_a.sort{ rand() - 0.5 }[1..dd/2]
				dd -= dd/2
				indices += (d*d*3/4..d*d-1).to_a.sort{ rand() - 0.5 }[1..dd]
				indices.each { |x| mat[x/d][x%d] = 2 }
			elsif zones[d] == 2
				dd = d
				indices = (0..d*d/2-1).to_a.sort{ rand() - 0.5 }[1..dd/2]
				dd -= dd/2
				indices += (d*d/2..d*d-1).to_a.sort{ rand() - 0.5 }[1..dd]
				indices.each { |x| mat[x/d][x%d] = 2 }
			end

		end

		render json: {"error" => error, "reply" => reply, "matrix" => mat}
	end

	def statistics
		user = params[:user]		
		item = UserStatisticsDetail.where("username = ?", user).map(&:score)
		render json: {"username_scores" => item}
	end

end

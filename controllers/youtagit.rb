# frozen_string_literal: true

# YouTagit web application
class YouTagit < Sinatra::Base
  # Home page: show list of all Videos
  get '/?' do
    slim :home_page
  end

  get '/video_viewer/?' do
    url_request = UrlRequest.call(params)
    results = SearchVideoWholeInfo.call(url_request)

    if results.success?
      @whole_info = results.value
      slim :video_viewer
    else
      flash[:error] = results.value.message
      redirect back
    end


  end
=begin
  post '/new_video/?' do
    url_request = UrlRequest.call(params)
    result = CreateNewVideo.call(url_request)

    if result.success?
      flash[:notice] = 'Group successfully added'
    else
      flash[:error] = result.value.message
    end
    redirect '/'
  end
=end

  set(:probability) { |value| condition { rand <= value } }

  get '/win_a_car/:number' do
    unless params['number'].nil?
      unless params['probability'].nil?
        "You won! #{params['number']} and #{params['probability']}"
      else
        "You won! #{params['number']}"
      end
    end
  end

#  get '/win_a_car/?' do
    #"Sorry, you lost. #{params['number']}"
#    "Sorry, you lost."
#  end
end

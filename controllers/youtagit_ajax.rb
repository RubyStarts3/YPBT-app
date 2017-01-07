class YouTagit < Sinatra::Base
  get '/tag_bar/:video_id/?' do
    results = SearchTagBarPoints.call(params)

    if results.success?
      @whole_info = results.value
      slim :video_viewer_tag_bar, layout: false
    else
      results.value.message
    end
  end

  get '/time_tag/:id/?' do
    results = SearchTimeTagDetail.call(params[:id])
    if results.success?
      @tag = results.value
      slim :video_viewer_tag_popover, layout: false
    else
      results.value.message
    end
  end

  post '/add_new_time_tag/?' do
    results = AddNewTimeTag.call(params)

    if results.success?
      @whole_info = results.value
      slim :video_viewer_tag_bar, layout: false
    else
      ErrorRepresenter.new(results.value).to_status_response
    end
  end

  put '/timetag_add_one_like/?' do
    results = TimetagAddOneLike.call(params)
    if results.success?
      results.value
    else
      ErrorRepresenter.new(results.value).to_status_response
    end
  end

  put '/timetag_add_one_click/?' do
    results = TimetagAddOneClick.call(params)
    if results.success?
      results.value
    else
      ErrorRepresenter.new(results.value).to_status_response
    end
  end
end

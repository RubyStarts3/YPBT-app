# frozen_string_literal: true

# Gets list of popular videos from API
class GetPopVideos
  extend Dry::Monads::Either::Mixin
  extend Dry::Container::Mixin

  NUMBER = 20

  register :get_pop_videos, lambda { |params|
    begin
      channel_id = params[:channel_id]
      results = HTTP.get("#{YouTagit.config.YPBT_API}/PopVideos/#{NUMBER}?" +
        "channel_id=#{channel_id}&api_key=#{YouTagit.config.YOUTUBE_API_KEY}")
      videos_pop_json = JSON.parse(results.body.to_s)

      videos_pop_view = videos_pop_json.map do |video_pop_json|
        video_pop = video_pop_json.to_json
        video_pop_info =
          VideoPopInfoRepresenter.new(VideoPopInfo.new).from_json(video_pop)
        VideoPopView.new(video_pop_info)
      end

      Right(videos_pop_view)
    rescue
      Left(Error.new(:internal_error,
                     'Our servers failed - we are investigating!'))
    end
  }

  def self.call(params)
    Dry.Transaction(container: self) do
      step :get_pop_videos
    end.call(params)
  end
end

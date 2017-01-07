# frozen_string_literal: true

# Add add new timetag in API database
class TimetagAddOneClick
  extend Dry::Monads::Either::Mixin
  extend Dry::Container::Mixin

  register :api_call, lambda { |params|
    url = "#{YouTagit.config.YPBT_API}/TimeTag/add_one_click"
    params[:api_key] = YouTagit.config.YOUTUBE_API_KEY
    response = HTTP.put(url, json: params)
    if response.status == 200
      Right(response.body.to_json)
    else
      Left(Error.new(:internal_error,
                     'Our servers failed - we are investigating!'))
    end
  }

  def self.call(params)
    Dry.Transaction(container: self) do
      step :api_call
    end.call(params)
  end
end

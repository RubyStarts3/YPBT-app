# frozen_string_literal: true
ENV['RACK_ENV'] = 'test'

require 'minitest/autorun'
require 'minitest/rg'

require 'watir'
require 'headless'
require 'page-object'
require 'rack/test'
require 'rspec/retry'

require './init.rb'

include Rack::Test::Methods

def app
  YouTagit
end

unless ENV['YOUTUBE_API_KEY']
  ENV['YOUTUBE_API_KEY'] = app.config.YOUTUBE_API_KEY
end

unless ENV['YPBT_API']
  ENV['YPBT_API'] = app.config.YPBT_API
end

HAPPY_VIDEO_URL = 'https://www.youtube.com/watch?v=OyDSCKYz5sA'
SAD_VIDEO_URL = 'htt://www.youtube'
INVALID_VIDEO_URL = 'https://www.youtube.com/watch?v=XXa12345'

HOST = 'http://ypbt-app.herokuapp.com/'

# Helper methods
def homepage
  HOST
end

def video_viewer_page(url)
  "#{HOST}/video_viewer/?video_url=#{url}"
end

RSpec.configure do |config|
  #show retry status in spec process
  config.verbose_retry = true
  # Try twice (retry once)
  config.default_retry_count = 5
  # Only retry when Selenium raises Net::ReadTimeout
  config.exceptions_to_retry = [Net::ReadTimeout]
end

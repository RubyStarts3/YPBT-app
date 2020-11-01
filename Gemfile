# frozen_string_literal: true
source 'https://rubygems.org'

ruby '2.6.6'

gem 'puma', ">= 3.12.4"
gem 'sinatra'
gem 'json'
gem 'econfig'
gem 'rake'
gem 'slim'
gem 'rack-flash3'
gem 'ruby-duration'
gem 'http'
gem 'faye', '1.4.0'

gem 'roar'
gem 'multi_json'
gem 'dry-monads'
gem 'dry-validation'
gem 'dry-container'
gem 'dry-transaction'

group :development do
  gem 'rerun'
  gem 'flog'
  gem 'flay'
end

group :test do
  gem 'minitest'
  gem 'minitest-rg'
  gem 'rack-test'
  gem 'watir', '~> 6.17'
  gem 'headless'
  gem 'page-object', '~> 2.2', '>= 2.2.6'
  gem 'rspec-retry', '~> 0.4.5'
end

group :development, :production do
  gem 'tux'
end

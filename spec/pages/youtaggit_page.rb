# frozen_string_literal: true

# Page object
class GroupsPage
  include PageObject

  page_url 'http://ypbt-app.herokuapp.com/'

  h1(:heading)
  div(class: 'container-fluid')
  a(class: 'navbar-brand')
  p(class: 'navbar-text')
  div(id: 'search-bar-container')
  img(src: '/logo.png')
  span(class: 'input-group-addon logo-addon')
  div(class: 'container-fluid content-container row')
  h4(class: 'video-title-leave-out')
  p(class: 'channel-title-leave-out')
  div(class: 'container-fluid row')

  img(src: '/view.png')
  img(src: '/like.png')
  text_field(id: 'yt_video_url_input')
  button(id: 'search-form-submit')
  div(class: 'alert')
  h1.text
  iframe(id: 'ytplayer')
  div(class: 'tag-bar')
end

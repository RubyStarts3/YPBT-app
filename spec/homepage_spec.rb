# frozen_string_literal: true
require_relative 'spec_helper'

describe 'Homepage' do
  before do
    unless @browser
      @browser = Watir::Browser.new
    end
  end

  after do
    @browser.close
  end

  describe 'Page elements' do
    it '(HAPPY) should see website features' do
      # GIVEN
      @browser.goto homepage

      # THEN :navbar elements and search bar
      @browser.title.must_include 'YouTagit'

      @browser.div(class: 'container-fluid').visible?.must_equal true
      @browser.a(class: 'navbar-brand').text.must_include 'YOUTAGIT'
      @browser.p(class: 'navbar-text').text.must_include 'Tag your favorite moments on YouTube Videos'
      @browser.label.text.must_include 'Search YouTube Video URL:'
      @browser.div(id: 'search-bar-container').visible?.must_equal true
      @browser.img(src: '/logo.png').visible?.must_equal true
      @browser.span(class: 'input-group-addon logo-addon').visible?.must_equal true
    end

    it '(HAPPY) should see popular movies features' do
      # GIVEN
      @browser.goto homepage

      # THEN
      @browser.h3.text.must_include 'Popular Videos'
      @browser.div(class: 'container-fluid content-container row').visible?.must_equal true
      @browser.h4(class: 'video-title-leave-out').visible?.must_equal true
      @browser.p(class: 'channel-title-leave-out').visible?.must_equal true
      video_info = @browser.div(class: 'container-fluid row')
      video_info.img(src: '/view.png').visible?.must_equal true
      video_info.img(src: '/like.png').visible?.must_equal true
    end

    it '(SAD) should alert user if incorrect URL given' do
      # GIVEN: on the homepage
      @browser.goto homepage

      # WHEN: add an invalid group url
      @browser.text_field(id: 'yt_video_url_input').set(SAD_VIDEO_URL)
      @browser.button(id: 'search-form-submit').click


      # THEN: danger flash notice should be seen
      flash_notice = @browser.div(class: 'alert')
      flash_notice.attribute_value('class').must_include 'danger'
    end

    it '(SAD) should alert user if incorrect URL given' do
      # GIVEN: on the homepage
      @browser.goto homepage

      # WHEN: add an invalid group url
      @browser.text_field(id: 'yt_video_url_input').set(INVALID_VIDEO_URL)
      @browser.button(id: 'search-form-submit').click


      # THEN: danger flash notice should be seen
      error_message = @browser.h1.text
      error_message.must_include 'Server Error'
    end
  end


  describe 'Search a video' do
    it '(HAPPY) should open video_viewer page' do
      # GIVEN: on the homepage
      @browser.goto homepage

      # WHEN
      @browser.text_field(id: 'yt_video_url_input').set(HAPPY_VIDEO_URL)
      @browser.button(id: 'search-form-submit').click

      # THEN
      Watir::Wait.until { @browser.iframe(id: 'ytplayer').visible?}
      @browser.div(class: 'tag-bar').visible?.must_equal true
      content = @browser.div(class: 'container content-container')
      content.h4.visible?.must_equal true
      content.a.img.visible?.must_equal true
      content.a.href.must_include 'https://www.youtube.com/channel/'
      icon_location = @browser.div(class: 'col-sm-6 text-right')
      icon_location.span.is_a? Integer
      icon_location.img(src: '/view.png').visible?.must_equal true
      icon_location.img(src: '/like.png').visible?.must_equal true
      icon_location.img(src: '/dislike.png').visible?.must_equal true
      @browser.p.visible?.must_equal true
      @browser.p(class: 'collapse').visible?.must_equal false
      @browser.button(id: 'collapse').click
      @browser.p(id: 'description-remain').visible?.must_equal true
    end

    it 'should can use tag-bar dialog' do
      # GIVEN
      @browser.goto video_viewer_page(HAPPY_VIDEO_URL)

      # WHEN
      @browser.div(class: 'add-point').click

      # THEN
      @browser.div(class: 'popover-content').visible?.must_equal true
      dialog = @browser.div(class: 'popover-content')
      dialog.select_list(id: 'tag_type').select 'video'
      dialog.textarea.set '123test'
      dialog.button(onclick: 'submmit_form(event)').click
    end
  end
end

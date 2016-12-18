# frozen_string_literal: true

# all video info view
class VideoAllInfoView
  attr_accessor :video_info, :_time_tags

  def time_tags
    return _time_tags if _time_tags.empty?
    assign_color(_time_tags)
    _time_tags.sort! { |a, b| a.like_color <=> b.like_color }.reverse!
  end

  def assign_color(time_tags)
    like_counts = time_tags.map(&:like_count)
    counts_norm = normalize(like_counts)
    time_tags.zip(counts_norm).each do |tag, count_norm|
      tag.like_color = count_norm
    end
  end

  def normalize(counts)
    min = counts.min
    range = counts.max - min
    return Array.new(counts.length, 160) if range.zero?
    counts.map do |count|
      160 - ((count - min) * 100 / range)
    end
  end
end

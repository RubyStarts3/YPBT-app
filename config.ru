# frozen_string_literal: true
require 'faye'
require './init.rb'

use Faye::RackAdapter, :mount => '/faye', :timeout => 25 do |bayeux|
  hash_table = {}

=begin
  bayeux.on(:handshake) do |client_id|
    puts "Connected: #{client_id}"
  end
=end

  bayeux.on(:subscribe) do |client_id,channel|
    puts "#{client_id} subscribed #{channel}"
  end

  bayeux.on(:unsubscribe) do |client_id,channel|
    puts "#{client_id} unsubscribed #{channel}"
  end

  bayeux.on(:publish) do |client_id,channel,data|
    puts "#{client_id} published #{channel}: #{data}"
  end

=begin
  bayeux.on(:disconnect) do |client_id|
    puts "Disconected: #{client_id}"
  end
=end
end
run YouTagit

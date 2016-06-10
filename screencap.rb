#!/usr/bin/env ruby
#-*- coding:utf-8 -*-

def screencap
  file = "#{Time.now.to_i.to_s}.png"
  `adb shell screencap /data/local/tmp/#{file}`
  `adb pull /data/local/tmp/#{file} #{ENV['TMPDIR']}`
  `adb shell rm /data/local/tmp/#{file}`
  puts "screenshot: #{ENV['TMPDIR']}/#{file}"
end

screencap

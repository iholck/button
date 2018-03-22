class Measurement < ApplicationRecord
  belongs_to :button

  validates_presence_of :timestamp, :button, :value
end

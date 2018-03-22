class Button < ApplicationRecord
    has_many :measurements, dependent: :destroy

    validates_presence_of :name, :mac, :regexp, :configured, :customer

end

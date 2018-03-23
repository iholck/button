FactoryBot.define do
    factory :measurement do
      timestamp { DateTime.now }
      button_id 1
      value { Faker::Number.number(1) }
    end
  end
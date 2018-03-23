FactoryBot.define do
    factory :button do
      name { Faker::Lorem.word }
      mac { Faker::Internet.mac_address }
      regexp { Faker::Lorem.word }
      configured true
      customer 1
    end
  end
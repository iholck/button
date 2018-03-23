require 'rails_helper'

RSpec.describe Measurement, type: :model do
  # Association test
  # ensure a measurement record belongs to a single button record
  it { should belong_to(:button) }
  # Validation test
  # ensure column name is present before saving
  it { should validate_presence_of(:timestamp) }
  it { should validate_presence_of(:value) }
end
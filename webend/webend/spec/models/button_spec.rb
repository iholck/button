require 'rails_helper'

RSpec.describe Button, type: :model do
  # Association test
  # ensure Button model has a 1:m relationship with the Measurement model
  it { should have_many(:measurements).dependent(:destroy) }
  # Validation tests
  # ensure columns title and created_by are present before saving
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:mac) }
  it { should validate_presence_of(:regexp) }
  it { should validate_presence_of(:configured) }
  it { should validate_presence_of(:customer) }

end
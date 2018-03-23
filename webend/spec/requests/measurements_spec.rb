require 'rails_helper'

RSpec.describe 'Measurement API' do
  # Initialize the test data
  let!(:button) { create(:button) }
  let!(:measurements) { create_list(:measurement, 20, button_id: button.id) }
  let(:button_id) { button.id }
  let(:id) { measurements.first.id }

  # Test suite for GET /todos/:todo_id/items
  describe 'GET /buttons/:button_id/measurements' do
    before { get "/buttons/#{button_id}/measurements" }

    context 'when button exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all measurement items' do
        expect(json.size).to eq(20)
      end
    end

    context 'when button does not exist' do
      let(:button_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Button/)
      end
    end
  end

  # Test suite for GET /todos/:todo_id/items/:id
  describe 'GET /buttons/:button_id/measurements/:id' do
    before { get "/buttons/#{button_id}/measurements/#{id}" }

    context 'when measurement exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns the item' do
        expect(json['id']).to eq(id)
      end
    end

    context 'when measurement does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Measurement/)
      end
    end
  end

  # Test suite for PUT /todos/:todo_id/items
  describe 'POST /buttons/:button_id/measurements' do
    let(:valid_attributes) { { timestamp: DateTime.now , button_id: :button_id, value: 10 } }

    context 'when request attributes are valid' do
      before { post "/buttons/#{button_id}/measurements", params: valid_attributes }

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when an invalid request' do
      before { post "/buttons/#{button_id}/measurements", params: {} }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a failure message' do
        expect(response.body).to match(/Validation failed: /)
      end
    end
  end

  # Test suite for PUT /buttons/:button_id/measurements/:id
  describe 'PUT /buttons/:button_id/measurements/:id' do
    let(:valid_attributes) { { timestamp: DateTime.now , button_id: :button_id, value: 1 } }

    before { put "/buttons/#{button_id}/measurements/#{id}", params: valid_attributes }

    context 'when item exists' do
      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      it 'updates the item' do
        updated_item = Measurement.find(id)
        expect(updated_item.value).to match(1)
      end
    end

    context 'when the item does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Measurement/)
      end
    end
  end

  # Test suite for DELETE /todos/:id
  describe 'DELETE /buttons/:id/measurements/:id' do
    before { delete "/buttons/#{button_id}/measurements/#{id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end
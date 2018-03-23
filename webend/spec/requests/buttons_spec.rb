require 'rails_helper'

RSpec.describe 'Buttons API', type: :request do
  # initialize test data 
  let!(:buttons) { create_list(:button, 10) }
  let(:button_id) { buttons.first.id }

  # Test suite for GET /measurements
  describe 'GET /buttons' do
    # make HTTP get request before each example
    before { get '/buttons' }

    it 'returns buttons' do
      # Note `json` is a custom helper to parse JSON responses
      expect(json).not_to be_empty
      expect(json.size).to eq(10)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  # Test suite for GET /measurements/:id
  describe 'GET /buttons/:id' do
    before { get "/buttons/#{button_id}" }

    context 'when the record exists' do
      it 'returns the button' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(button_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:button_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Button/)
      end
    end
  end

  # Test suite for POST /buttons
  describe 'POST /buttons' do
    # valid payload
    let(:valid_attributes) { { name: 'TestButton', mac: '1111.2222.3333', regexp: '/.*/', configured: true, customer: 1 } }

    context 'when the request is valid' do
      before { post '/buttons', params: valid_attributes }

      it 'creates a button' do
        expect(json['mac']).to eq('1111.2222.3333')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/buttons', params: { configured: 'Foobar' } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
          .to match(/Validation failed:/)
      end
    end
  end

  # Test suite for PUT /measurements/:id
  describe 'PUT /buttons/:id' do
    let(:valid_attributes) { { configured: true } }

    context 'when the record exists' do
      before { put "/buttons/#{button_id}", params: valid_attributes }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end

  # Test suite for DELETE /buttons/:id
  describe 'DELETE /buttonss/:id' do
    before { delete "/buttons/#{button_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end
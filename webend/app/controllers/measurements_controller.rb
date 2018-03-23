class MeasurementsController < ApplicationController
    before_action :set_button
    before_action :set_button_measurement, only: [:show, :update, :destroy]
  
    # GET /todos/:todo_id/items
    def index
      json_response(@button.measurements)
    end
  
    # GET /todos/:todo_id/items/:id
    def show
      json_response(@measurement)
    end
  
    # POST /todos/:todo_id/items
    def create
      @button.measurements.create!(measurement_params)
      json_response(@button, :created)
    end
  
    # PUT /todos/:todo_id/items/:id
    def update
      @measurement.update(measurement_params)
      head :no_content
    end
  
    # DELETE /todos/:todo_id/items/:id
    def destroy
      @measurement.destroy
      head :no_content
    end
  
    private
  
    def measurement_params
      params.permit(:timestamp, :button_id, :value)
    end
  
    def set_button
      @button = Button.find(params[:button_id])
    end
  
    def set_button_measurement
      @measurement = @button.measurements.find_by!(id: params[:id]) if @button
    end
  end
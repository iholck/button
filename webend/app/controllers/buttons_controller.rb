class ButtonsController < ApplicationController
  before_action :set_button, only: [:show, :update, :destroy]

  # GET /todos
  def index
    @buttons = Button.all
    json_response(@buttons)
  end

  # POST /buttons
  def create
    @button = Button.create!(button_params)
    json_response(@button, :created)
  end

  # GET /buttons/:id
  def show
    json_response(@button)
  end

  # PUT /buttons/:id
  def update
    @button.update(button_params)
    head :no_content
  end

  # DELETE /buttons/:id
  def destroy
    @button.destroy
    head :no_content
  end

  private

  def button_params
    # whitelist params
    params.permit(:name, :mac, :regexp, :configured, :customer)
  end

  def set_button
    @button = Button.find(params[:id])
  end
end




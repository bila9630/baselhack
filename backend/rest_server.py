from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flasgger import Swagger
from flask_cors import CORS
from openai_client import send_user_input
import traceback

app = Flask(__name__)
CORS(app)
api = Api(app)
swagger = Swagger(app)

def get_id_gen():
    for i in range(0, 99999):
        yield i

get_id = get_id_gen()

# Temporary storage for extracted data
extracted_data_storage = []

# Handler for the first POST method
class Application(Resource):
    def post(self):
        """
        Receive a CompletedForm
        ---
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                field1:
                  type: string
                  example: "value1"
                field2:
                  type: string
                  example: "value2"
            responses:
              200:
                description: Extracted data response
                schema:
                  type: object
                  properties:
                    field1:
                      type: string
                      example: "value1"
                    field2:
                      type: string
                      example: "value2"
                    recommendedQuestion:
                      type: string
                      example: "What do you think about this?"
                    additionalData:
                      type: object
                      properties:
                        is_done:
                          type: boolean
                          example: true
                        recommendation_bubbles:
                          type: array
                          items:
                            type: string
                            example: null
                        target_information:
                          type: array
                          items:
                            type: string
                            example: "insurance_length"
                    knownUserInfo:
                      type: object
                      properties:
                        address:
                          type: string
                          example: "123 Main Street, Cityville, ABC123"
                        date_of_birth:
                          type: string
                          format: date
                          example: "1985-07-15"
        """
        completed_form = request.get_json()
        
        # Here you can add logic to process CompletedForm
        print("Received CompletedForm:", completed_form)
        
        # Example response
        return {"status": "success"}, 201

# Handler for the second POST method
class ExtractData(Resource):
    def post(self):
        """
        Extract data based on provided fields and source
        ---
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                user_id: 
                  type: integer
                  example: "7"
                fields:
                  type: array
                  items:
                    type: string
                  example: ["field1", "field2"]
                source:
                  type: string
                  example: "example_source"
        responses:
            200:
                description: Extracted data response
                schema:
                type: object
                properties:
                    field1:
                    type: string
                    example: "value1"
                    field2:
                    type: string
                    example: "value2"
                    recommendedQuestion:
                    type: string
                    example: "What do you think about this?"
                    additionalData:
                    type: object
                    properties:
                        is_done:
                            type: boolean
                            example: true
                        recommendation_bubbles:
                                type: array
                                items:
                                    type: string
                                    example: null
                        target_information:
                        type: array
                        items:
                            type: string
                            example: "insurance_length"
                    knownUserInfo:
                    type: object
                    properties:
                        address:
                        type: string
                        example: "123 Main Street, Cityville, ABC123"
                        date_of_birth:
                        type: string
                        format: date
                        example: "1985-07-15"
        """
        request_for_extraction = request.get_json()
        
        # Here you can add logic to process RequestForExtraction
        fields = request_for_extraction.get('fields', [])
        user_id = request_for_extraction.get('user_id', None)
        source = request_for_extraction.get('source', '')

        print("Received RequestForExtraction:", request_for_extraction)
        try:
            json_for_frontend  = send_user_input(user_input=source, fields=fields, user_id=user_id)
            return jsonify(json_for_frontend)

        except Exception as err:
            error_details = traceback.format_exc()
            print(f'There was an error: {error_details}')  
            return jsonify({
                "recommendedQuestion": "Sorry, I didn't understand your answer.",
                "error": str(err),  
                "error_details": error_details  
            })


class NewTemporalId(Resource):
    
    def get(self):
        """
        Generate a new temporal ID
        ---
        responses:
          200:
            description: New temporal ID
            schema:
              type: integer
              example: 5
        """
        
        return next(get_id)


# Adding resources to the API
api.add_resource(NewTemporalId,'/application/new_temporal_id')
api.add_resource(Application, '/application/')
api.add_resource(ExtractData, '/application/chat/extract_data')

if __name__ == '__main__':
    app.run(debug=True)

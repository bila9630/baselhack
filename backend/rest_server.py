from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flasgger import Swagger

app = Flask(__name__)
api = Api(app)
swagger = Swagger(app)

# Structure for storing extracted data
class ExtractedData:
    def __init__(self, field1, field2, recommended_question):
        self.field1 = field1
        self.field2 = field2
        self.recommended_question = recommended_question

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
          201:
            description: Success response
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: "success"
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
        """
        request_for_extraction = request.get_json()
        
        # Here you can add logic to process RequestForExtraction
        fields = request_for_extraction.get('fields', [])
        source = request_for_extraction.get('source', '')

        print("Received RequestForExtraction:", request_for_extraction)

        # Example of creating extracted data
        extracted_data = ExtractedData(field1="value1", field2="value2", recommended_question="What do you think about this?")
        extracted_data_storage.append(extracted_data)

        # Forming the response in JSON format
        response_data = {
            "field1": extracted_data.field1,
            "field2": extracted_data.field2,
            "recommendedQuestion": extracted_data.recommended_question
        }
        
        return jsonify(response_data)

# Adding resources to the API
api.add_resource(Application, '/application/')
api.add_resource(ExtractData, '/application/chat/extract_data')

if __name__ == '__main__':
    app.run(debug=True)

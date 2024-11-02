
import os
from openai import OpenAI
from dotenv import load_dotenv
import json
import warnings

load_dotenv()
OpenAiClient = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

def modify_user_prompt(user_input, required_information):
    instruction = (
    f"""
You are an insurance company operator and you are asking a client for the information necessary for insurance. 
You need to know the following information, ask in natural language for a good user experience, but turn it into the correct format later: 
{required_information}

Here is the information that the client gave you:
"
{user_input}

Write the answers to the specified questions in json format. 
If the answer to the specified question is not in the client's response, set the value as null. 

Decide on the next pieces of information you want to get from the user, and write the keys into the field 'target_information'
Additionally write a clarifying question that you need to ask the client about the target_information in the "recommendedQuestion" field. 
Ask very kind and friendly, try to ask for only one or two missing pieces of Information. Embed the question into a question about a topic.

"""

    )
    return instruction


user_info_descriptions = {
    "name": "The name of the client",
    "gender": "Gender of the individual: 'Male', 'Female', or 'Other'.",
    "date_of_birth": "Date of birth in 'YYYY-MM-DD' format.",
    "smoking_status": "Boolean indicating if the individual is a smoker.",
    "insurance_amount": "Coverage amount in currency (numerical value).",
    "insurance_length": "Duration of insurance in years (numerical value).",
    "weight": "weight in KG",
    "height" : "height in cm",
    "address": "Residential address (string).",
    "profession": "Job title or occupation (string)."
}

class UserInformation:
    def __init__(self, name = None, gender=None, date_of_birth=None, smoking_status=None,
                 insurance_amount=None, insurance_length=None, height=None, weight=None,  
                 address=None, profession=None):
        self.name = name
        self.gender = gender
        self.date_of_birth = date_of_birth
        self.smoking_status = smoking_status
        self.insurance_amount = insurance_amount
        self.insurance_length = insurance_length
        self.height = height 
        self.weight = weight  
        self.address = address 
        self.profession = profession

    def get_empty_fields(self):
        empty_fields = [field for field, value in self.__dict__.items() if value is None]
        return empty_fields

    def get_empty_fields_with_description(self):
        empty_fields = self.get_empty_fields()
        arr  = [f'`{field}`: {user_info_descriptions[field]} \n' for field in empty_fields]
        return "".join(arr)
        
    def fill_from_dict(self, data_dict):
        if data_dict is None: return None
        for key, value in data_dict.items():
            if hasattr(self, key):
                if value is not None:
                    setattr(self, key, value)
            elif key in ['recommendedQuestion', 'target_information']: 
                pass
            else:
                warnings.warn(f"Attribute '{key}' does not exist on UserInformation and will be ignored.", stacklevel=2)
             
    def get_known_user_json(self):
        return {field: value for field, value in self.__dict__.items() if value is not None}
                
class ChatClient:
    def __init__(self, model="gpt-3.5-turbo", initial_instructions = '', remember_history = True):
        self.messages = [ {"role": "system", "content": initial_instructions} ]
        self.model = model
        self.remember_history = remember_history
    
    # `prompt` is the actual prompt that will be sent to the LLM.
    # `prompt_without_instructions` is the version saved in the message history for future requests (usually without initial instructions).
    def send_prompt(self, prompt, prompt_without_instructions = None,temperature=0.7, max_tokens=300):
        if not prompt_without_instructions:
            prompt_without_instructions = prompt

        messages_with_instruction_prompt = self.messages + [{"role": "user", "content": prompt}]
        self.messages.append({"role": "user", "content": prompt_without_instructions})
        
        try:
            result = OpenAiClient.chat.completions.create(
                messages=messages_with_instruction_prompt,
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens
            )
            response_message = result.choices[0].message.content.replace('`', '').replace('json', '').strip()
            self.messages.append({"role": "assistant", "content": response_message})
            return response_message
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

def parse_user_data(response):
    try:
        user_data = json.loads(response)
        return user_data
    except json.JSONDecodeError:
        print("Failed to turn chatgpts response to JSON. Response received:")
        print(response)
        return None


def generate_json_for_frontend(user_data, known_user_info, user):
    known_user_info = user.get_known_user_json()
    
    additional_data = {
    'recommendedQuestion': user_data.get('recommendedQuestion'),
    'target_information': user_data.get('target_information'),
    'recommendation_bubbles': [None]
    }
    
    json_for_frontend = {
        'knownUserInfo': known_user_info,
        'additionalData': additional_data
    }
    return json_for_frontend

user_sessions = {}
def send_user_input(user_input, fields = [], user_id = 0):
    if user_id not in user_sessions:
        # Create a new ChatClient and UserInformation for the user
        user_sessions[user_id] = (ChatClient(), UserInformation())
    client, user = user_sessions[user_id]

    modified_prompt = modify_user_prompt(
        required_information=user.get_empty_fields_with_description(),
        user_input=user_input
    )
    
    response = client.send_prompt(prompt=modified_prompt, prompt_without_instructions=user_input)
    user_data = parse_user_data(response)
    user.fill_from_dict(user_data)
    json_for_frontend = generate_json_for_frontend(
        user_data=user_data,
        known_user_info=user.get_known_user_json(),
        user = user
    )
    
    if len(user.get_empty_fields())==0:
        print(f'WE ARE DONE, GOT ALL USERDATA')
    
    return json_for_frontend


if __name__ == "__main__":
    # pass
    client = ChatClient()
    user = UserInformation()

    print('CHATON: Hello Human, im CHATON and here to assist you with an insurance. Tell me about yourself!')
    
    for i in range(10):
        user_input = input("User: ")
        json_for_frontend  = send_user_input(user_input, user_id=2)
        print(f'INFO: Json Data for frontend: {json_for_frontend}')   
        print('CHATON: {}'.format(json_for_frontend['additionalData']['recommendedQuestion']))

            

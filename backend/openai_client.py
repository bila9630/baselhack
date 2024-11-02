
import os
from openai import OpenAI
from dotenv import load_dotenv
import json
import warnings

load_dotenv()
OpenAiClient = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)


def modify_user_prompt(required_information, user_input):
    instruction = (
    f"""
Updated prompts with no empty fields:

You are an insurance company operator and you are asking a client for the information necessary for insurance. You need to know the following information (the fields and its types in which the answers should be written are written in brackets. if there is no type it have to be string): 
{required_information}

Here is the information that the client gave you:
"
{user_input}
Write the answers to the specified questions in json format. If the answer to the specified question is not in the client's response, don't create fields for them. 
If there are any questions that you have not found an answer to, write a clarifying question that you need to ask the client in the "recommendedQuestion" field. Make the question kind and friendly
"""

    )
    return instruction


user_info_descriptions = {
    "gender": "Gender of the individual, a string that can be 'Male', 'Female', or 'Other'.",
    "date_of_birth": "Date of birth of the individual, a string formatted as 'YYYY-MM-DD'.",
    "smoking_status": "Smoking status of the individual, a boolean indicating if the person is a smoker (True) or non-smoker (False).",
    "insurance_amount": "Insurance amount, a numerical value representing the coverage amount in currency (e.g., 100000).",
    "insurance_length": "Length of insurance, a numerical value representing the duration in years (e.g., 5).",
    "bmi": "Body Mass Index (BMI) of the individual, a numerical value representing weight in kilograms divided by the square of height in meters.",
    "address": "Residential address of the individual, a string that describes the physical location.",
    "profession": "Profession of the individual, a string that represents their job title or occupation."
}


class UserInformation:
    def __init__(self, gender=None, date_of_birth=None, smoking_status=None,
                 insurance_amount=None, insurance_length=None, bmi=None, 
                 address=None, profession=None):
        self.gender = gender
        self.date_of_birth = date_of_birth
        self.smoking_status = smoking_status
        self.insurance_amount = insurance_amount
        self.insurance_length = insurance_length
        self.bmi = bmi
        self.address = address
        self.profession = profession

    def get_empty_fields(self):
        empty_fields = [field for field, value in self.__dict__.items() if value is None]
        return empty_fields

    def get_empty_fields_with_description(self):
        empty_fields = self.get_empty_fields()
        arr  = [f'{field} {user_info_descriptions[field]} \n' for field in empty_fields]
        return "".join(arr)
        

    def fill_from_dict(self, data_dict):
        for key, value in data_dict.items():
            if hasattr(self, key):
                setattr(self, key, value)
            else: 
                warnings.warn(f"Attribute '{key}' does not exist on UserInformation and will be ignored.", stacklevel=2)
                
class ChatClient:
    # Initial instructions tell the LLM what to do in general (e.g., "extract information by ...").
    def __init__(self, model="gpt-3.5-turbo", initial_instructions = ''):
        self.messages = [ {"role": "system", "content": initial_instructions} ]
        self.model = model
    
    # `prompt` is the actual prompt that will be sent to the LLM.
    # `prompt_without_instructions` is the version saved in the message history for future requests (usually without initial instructions).
    def send_prompt(self, prompt, prompt_without_instructions = None,temperature=0.7, max_tokens=100):
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
            response_message = result.choices[0].message.content.strip()
            self.messages.append({"role": "assistant", "content": response_message})
            return response_message
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

# if __name__ == "__main__":
#     client = ChatClient(initial_instructions='')
#     user_input = "My Name is Magnus Fischer, im the best tic tac toe player the world has ever seen who smokes. I was born in january, the first, in the year 1977 and I love Pizza"
#     modified_prompt = modify_user_prompt(user_input)
#     response = client.send_prompt(prompt=modified_prompt, prompt_without_instructions=user_input)
#     print(f"Response: {response}")
    
#     user_data = json.loads(response)
#     print(f'Json Data extracted: {user_data}')
    

if __name__ == "__main__":
    
    user = UserInformation()
    print(user.get_empty_fields_with_description())
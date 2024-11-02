



bubble = {
    "name": [],
    "gender": ['Male', 'Female', 'Other'],
    "date_of_birth": [],
    "smoking_status": ['Yes', 'No'],
    "insurance_amount": ['50000', '100000'],
    "insurance_length": ['2 Year', '10 Years', '5 Years'],
    "weight": ['60kg', '80kg', '100kg'],
    "height" : ['160cm', '170cm', '180cm'],
    "address": ['Basel'],
    "profession": ['Hacker', 'IT Engineer', 'Painter']
}

def get_bubbles(target_information):
    all_bubbles_to_return = []
    if isinstance(target_information, str):
        target_information = target_information.split(',')
        
    print(target_information)
    for target in target_information:
        if target in bubble:
            all_bubbles_to_return += bubble[target.strip()]
        else:
            print(f'Key {target} is unknown!')
    return all_bubbles_to_return[:5]



from faker import Faker

fake = Faker()

def get_Fake_user():
    user_data = {
        # User Information
        "name": fake.name(),
        "gender": fake.random_element(elements=["Male", "Female", "Other"]),
        "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=90),
        "smoking_status": fake.boolean(),
        "insurance_amount": fake.random_int(min=10000, max=100000),
        "insurance_length": fake.random_int(min=1, max=30),  # in years
        "bmi": round(fake.pyfloat(left_digits=2, right_digits=1, positive=True, min_value=18, max_value=35), 1),
        "address": fake.address(),
        "profession": fake.job(),

        # Browser Information
        "user_agent": fake.user_agent(),
        "operating_system": fake.random_element(elements=["Windows", "Mac OS", "Linux", "Android", "iOS"]),
        "ip_address": fake.ipv4_public(),  # or fake.ipv6() for IPv6
        "mac_address": fake.mac_address(),
        "url": fake.url(),
        "domain_name": fake.domain_name(),
        "http_method": fake.random_element(elements=["GET", "POST", "PUT", "DELETE"]),
        "referer": fake.url(),
        "screen_resolution": f"{fake.random_int(800, 2560)}x{fake.random_int(600, 1440)}",
        "language": fake.random_element(elements=["en-US", "fr-FR", "es-ES", "de-DE", "zh-CN"])
    }
    return user_data

for i in range(1):
    print(get_Fake_user())







from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import io
from datetime import date, datetime

user_info_descriptions = {
    "name": "John Pork",
    "gender": "Male",
    "date_of_birth": "2001-10-09",
    "smoking_status": "True",
    "insurance_amount": "250000",
    "insurance_length": "5",
    "weight": "89",
    "height": "186",
    "address": "Rue de creugenant 16, 2900 Porrentruy",
    "profession": "Farmer"
}


class pdf_export:
    def __init__(self, user_info_descriptions):
        self.name = user_info_descriptions["name"]
        self.gender = user_info_descriptions["gender"]
        self.date_of_birth = user_info_descriptions["date_of_birth"]
        self.smoking_status = user_info_descriptions["smoking_status"].lower() == "true"
        self.insurance_amount = user_info_descriptions["insurance_amount"]
        self.insurance_length = user_info_descriptions["insurance_length"]
        self.weight = int(user_info_descriptions["weight"])  # Weight in kg
        self.height = int(user_info_descriptions["height"]) / 100  # Convert height to meters
        self.bmi = self.weight / (self.height ** 2)  # Correct BMI calculation
        self.address = user_info_descriptions["address"]
        self.profession = user_info_descriptions["profession"]

    @staticmethod
    def AgeCalc(birthDate):
        today = date.today()
        age = today.year - birthDate.year - ((today.month, today.day) < (birthDate.month, birthDate.day))
        return age

    def price_per_year(self):
        date_of_birth = datetime.strptime(self.date_of_birth, '%Y-%m-%d').date()
        age = pdf_export.AgeCalc(date_of_birth)
        base_age = 65
        if self.smoking_status:
            base_age -= 5
        if self.gender.lower() == "male":
            base_age -= 5
        death_risk = (age / (5 * base_age)) ** 2
        price = (int(self.insurance_amount) * death_risk) / int(self.insurance_length)
        return price

    def save_pdf(self, filename="user_info.pdf"):
        # Create a PDF file
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Add Title
        c.setFont("Helvetica-Bold", 20)
        c.drawString(72, height - 72, "User Information Report")

        # Add Subtitle
        c.setFont("Helvetica", 12)
        c.drawString(72, height - 100, "A comprehensive overview of user details")

        # Add User Image in the Top Right Corner
        image_path = "chaton.png"  # Ensure this path is correct
        image_width = 2.5 * inch  # Desired width for the image (adjust as needed)
        image_height = (image_width / (2941 / 845))  # Maintain aspect ratio based on original dimensions

        # Positioning the image
        x_position = width - image_width - 72  # Right margin of 72 points
        y_position = height - image_height - 72  # Top margin of 72 points

        c.drawImage(image_path, x_position, y_position,
                    width=image_width, height=image_height)  # Place image

        # Add user information
        c.setFont("Helvetica", 12)
        y_position -= image_height + 20  # Adjusted y_position to account for the image height

        user_info_lines = [
            f"Name: {self.name}",
            f"Gender: {self.gender}",
            f"Date of Birth: {self.date_of_birth}",
            f"Age: {self.AgeCalc(datetime.strptime(self.date_of_birth, '%Y-%m-%d').date())}",
            f"Smoking Status: {'Yes' if self.smoking_status else 'No'}",
            f"Insurance Amount: ${self.insurance_amount}",
            f"Insurance Length: {self.insurance_length} years",
            f"Weight: {self.weight} kg",
            f"Height: {self.height * 100:.0f} cm",  # Display height in cm
            f"Address: {self.address}",
            f"Profession: {self.profession}",
            f"Calculated BMI: {self.bmi:.2f}",
            f"Estimated Price per Year: ${self.price_per_year():.2f}"
        ]

        for line in user_info_lines:
            c.drawString(72, y_position, line)
            y_position -= 20

        # Add footer
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(72, 50, "Generated on: " + str(date.today()))

        # Save PDF
        c.showPage()
        c.save()
        buffer.seek(0)

        # Write the buffer to a file
        with open(filename, 'wb') as f:
            f.write(buffer.read())
        buffer.close()


# Create the pdf_export object and save the PDF
pdf = pdf_export(user_info_descriptions)
pdf.save_pdf("Lebensversicherung.pdf")

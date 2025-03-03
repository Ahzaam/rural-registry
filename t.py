import random

from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 14)
        self.cell(200, 10, "Family Information Document", ln=True, align="C")
        self.ln(10)

    def chapter_title(self, title):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, title, ln=True, align="L")
        self.ln(5)

    def chapter_body(self, body):
        self.set_font("Arial", "", 10)
        self.multi_cell(0, 8, body)
        self.ln(5)

# Function to generate a random Sri Lankan Muslim family
def generate_family_pdf(pdf_name):
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Randomized Home ID and Address
    home_id = f"SL{random.randint(10000000, 99999999)}"
    address = f"No. {random.randint(1, 100)}, {random.choice(['Masjid Road', 'Galle Road', 'Kandy Street', 'Main Street', 'Colombo Lane'])}, {random.choice(['Colombo', 'Kandy', 'Galle', 'Kurunegala', 'Batticaloa'])}, Sri Lanka"

    pdf.chapter_title("1. Home ID/Registration Number")
    pdf.chapter_body(f"Home ID: {home_id}")

    pdf.chapter_title("2. Full Address")
    pdf.chapter_body(address)

    # Random Head of Family
    head_of_family = random.choice(["Mohamed", "Ahamed", "Farhan", "Rizwan", "Ismail"]) + " " + random.choice(["Rahman", "Fazil", "Nawaz", "Iqbal", "Hassan"])
    pdf.chapter_title("3. Head of Family Details")
    pdf.chapter_body(f"Full Name: {head_of_family}\nNIC: {random.randint(700000000, 999999999)}V\nDate of Birth: {random.randint(1970, 1990)}-{random.randint(1, 12):02}-{random.randint(1, 28):02}\nGender: Male\nOccupation: {random.choice(['Businessman', 'Engineer', 'Doctor', 'Teacher', 'IT Specialist'])}\nWork Location: {random.choice(['Colombo', 'Kandy', 'Galle', 'Puttalam'])}\nEducation Level: {random.choice(['Advanced Level', 'Bachelor’s Degree', 'Master’s Degree'])}\nContact Number: +94 77{random.randint(1000000, 9999999)}")

    # Random Spouse Details
    spouse_name = random.choice(["Fathima", "Ayesha", "Nashwa", "Zainab", "Rashida"]) + " " + random.choice(["Nafeesa", "Hassan", "Iqbal", "Rahman", "Fazil"])
    pdf.chapter_title("4. Spouse Details")
    pdf.chapter_body(f"Full Name: {spouse_name}\nNIC: {random.randint(800000000, 999999999)}V\nDate of Birth: {random.randint(1975, 1995)}-{random.randint(1, 12):02}-{random.randint(1, 28):02}\nGender: Female\nOccupation: {random.choice(['Homemaker', 'Teacher', 'Nurse', 'Doctor'])}\nWork Location: {random.choice(['N/A', 'Local School', 'City Hospital'])}\nEducation Level: {random.choice(['Advanced Level', 'Bachelor’s Degree'])}\nContact Number: +94 77{random.randint(1000000, 9999999)}")

    # Children Details (Random 2-5 Children)
    num_children = random.randint(2, 5)
    pdf.chapter_title("5. Children Details")
    for _ in range(num_children):
        child_name = random.choice(["Ahamed", "Ismail", "Muneer", "Rashid", "Sameer", "Yusuf"]) + " " + random.choice(["Rahman", "Iqbal", "Hassan", "Fazil", "Nawaz"])
        pdf.chapter_body(f"Full Name: {child_name}\nDate of Birth: {random.randint(2005, 2020)}-{random.randint(1, 12):02}-{random.randint(1, 28):02}\nGender: {random.choice(['Male', 'Female'])}\nSchool Name: {random.choice(['Zahira College', 'Muslim Ladies College', 'Al-Hikma International School'])}\nGrade/Education Level: Grade {random.randint(1, 13)}\n")

    # Other Family Members (Random 1-3 Members)
    pdf.chapter_title("6. Other Family Members")
    num_members = random.randint(1, 3)
    for _ in range(num_members):
        member_name = random.choice(["Abdul", "Haleem", "Mansoor", "Zainab", "Ayesha"]) + " " + random.choice(["Rahman", "Fazil", "Iqbal", "Hassan"])
        pdf.chapter_body(f"Full Name: {member_name}\nNIC: {random.randint(600000000, 799999999)}V\nDate of Birth: {random.randint(1940, 1970)}-{random.randint(1, 12):02}-{random.randint(1, 28):02}\nGender: {random.choice(['Male', 'Female'])}\nRelationship to Head of Family: {random.choice(['Father', 'Mother', 'Uncle', 'Aunt'])}\nOccupation: {random.choice(['Retired', 'Housewife'])}\n")

    # Family Income Details
    pdf.chapter_title("7. Family Income Details")
    pdf.chapter_body(f"Total Monthly Income: LKR {random.randint(200000, 600000)}\nPrimary Income Source: {random.choice(['Business', 'Salary', 'Investments'])}\nAdditional Income Sources: {random.choice(['Rental Property', 'Online Work', 'None'])}")

    # Land Ownership Status
    pdf.chapter_title("8. Land Ownership Status")
    pdf.chapter_body(f"Status: {random.choice(['Owned', 'Rented'])}\nSize: {random.randint(10, 50)} Perches\nLand Type: {random.choice(['Residential', 'Commercial'])}")

    # Additional Information
    pdf.chapter_title("9. Additional Information")
    pdf.chapter_body(f"Household Size: {num_children + num_members + 2} Members\nEmergency Contact: +94 77{random.randint(1000000, 9999999)}\nSpecial Notes: {random.choice(['Active in community events', 'Has a prayer room', 'Owns a small shop', 'Participates in charity work'])}")

    # Save the PDF
    pdf_path = pdf_name
    pdf.output(pdf_path)
    return pdf_path

# Generate 10 PDFs with different families
pdf_files = [generate_family_pdf(f"srilankan_muslim_family_{i+1}.pdf") for i in range(10)]
pdf_files

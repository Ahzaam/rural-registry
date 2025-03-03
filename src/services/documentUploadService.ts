import { Family, Person, Child, OtherMember } from '../types/types';
import { vertexAI } from '../firebase/config';
import { getGenerativeModel } from 'firebase/vertexai';

// Initialize the generative model with Gemini 2.0 Flash
const model = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });

/**
 * Validates if the file is an accepted type (PDF or image)
 */
export function validateFileType(file: File): boolean {
  const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  return acceptedTypes.includes(file.type);
}

/**
 * Converts a File object to a base64-encoded string for Vertex AI
 */
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { 
      data: await base64EncodedDataPromise, 
      mimeType: file.type 
    },
  };
}

export async function extractFamilyDataFromDocument(file: File): Promise<Omit<Family, "id" | "createdAt" | "updatedAt">> {
  if (!validateFileType(file)) {
    throw new Error("Invalid file type. Please upload a PDF or image file (JPG, PNG).");
  }

  try {
    const imagePart = await fileToGenerativePart(file);
    
    // Create a detailed prompt for the LLM
    const prompt = `
    Please analyze this document which contains family information for registration purposes.
    Extract all the following details that may be present (document may be in English, Tamil, or Sinhala - please translate to English):

    1. Home ID/Registration Number
    2. Full Address
    3. Head of Family details: 
       - Full name (first and last name)
       - NIC (National Identity Card) number
       - Date of birth
       - Gender
       - Occupation
       - Work location
       - Education level
       - Contact number
    4. Spouse details (if present):
       - Full name (first and last name)
       - NIC number
       - Date of birth
       - Gender
       - Occupation
       - Work location
       - Education level
       - Contact number
    5. Children details (for each child):
       - Full name (first and last name)
       - Date of birth
       - Gender
       - School name
       - Grade/education level
    6. Other family members (for each member):
       - Full name (first and last name)
       - NIC number
       - Date of birth
       - Gender
       - Relationship to head of family
    7. Family income details (if available)
    8. Land ownership status (owned/rented/other)

    Format your response as a clean JSON object. Ensure:
    1. All fields are included even if empty
    2. Dates are in YYYY-MM-DD format
    3. JSON is properly structured and valid
    4. NIC numbers are properly formatted
    5. Gender values are strictly "male" or "female"
    6. landOwnership is strictly "owned", "rented", or "other"
    
    
    Format your response as a clean JSON object that follows this exact structure:
    {
      "homeId": "string",
      "address": "string",
      "headOfFamily": {
        "firstName": "string",
        "lastName": "string",
        "nic": "string",
        "dateOfBirth": "YYYY-MM-DD",
        "gender": "male|female|other",
        "occupation": "string",
        "workLocation": "string",
        "education": "string",
        "contact": "string"
      },
      "spouse": {
        "firstName": "string",
        "lastName": "string",
        "nic": "string",
        "dateOfBirth": "YYYY-MM-DD",
        "gender": "male|female|other",
        "occupation": "string",
        "workLocation": "string",
        "education": "string",
        "contact": "string"
      },
      "children": [
        {
          "firstName": "string",
          "lastName": "string",
          "dateOfBirth": "YYYY-MM-DD",
          "gender": "male|female|other",
          "school": "string",
          "grade": "string"
        }
      ],
      "otherMembers": [
        {
          "firstName": "string",
          "lastName": "string",
          "nic": "string",
          "dateOfBirth": "YYYY-MM-DD",
          "gender": "male|female|other",
          "relationship": "string",
          "occupation": "string"
        }
      ],
      "income": "string",
      "landOwnership": "owned|rented|other"
    }

    Only include fields where you find information. If a piece of information isn't available, omit that field rather than including an empty value.
    Ensure all dates are formatted as YYYY-MM-DD.
    `;

    // Call the model with the file and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Find JSON object in the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const jsonString = jsonMatch[0];
      const extractedData = JSON.parse(jsonString);
      
      // Validate and clean up the data
      const validatedData = validateAndCleanData(extractedData);

      return validatedData;
      
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse the extracted data. Please try again or enter information manually.");
    }
  } catch (error) {
    console.error("Error extracting data:", error);
    throw new Error("Failed to process document. Please try again or enter information manually.");
  }
}

function validateAndCleanData(data: any): Omit<Family, "id" | "createdAt" | "updatedAt"> {
  // Ensure all required fields exist with proper default values
  const validatedData = {
    homeId: data.homeId || "",
    address: data.address || "",
    headOfFamily: {
      id: crypto.randomUUID(),
      firstName: data.headOfFamily?.firstName || "",
      lastName: data.headOfFamily?.lastName || "",
      nic: data.headOfFamily?.nic || "",
      dateOfBirth: data.headOfFamily?.dateOfBirth || "",
      gender: validateGender(data.headOfFamily?.gender),
      occupation: data.headOfFamily?.occupation || "",
      workLocation: data.headOfFamily?.workLocation || "",
      education: data.headOfFamily?.education || "",
      contact: data.headOfFamily?.contact || "",
    },
    spouse: {
      id: crypto.randomUUID(),
      firstName: data.spouse?.firstName || "",
      lastName: data.spouse?.lastName || "",
      nic: data.spouse?.nic || "",
      dateOfBirth: data.spouse?.dateOfBirth || "",
      gender: validateGender(data.spouse?.gender, "female"),
      occupation: data.spouse?.occupation || "",
      workLocation: data.spouse?.workLocation || "",
      education: data.spouse?.education || "",
      contact: data.spouse?.contact || "",
    },
    children: Array.isArray(data.children) ? data.children.map((child: any) => ({
      id: crypto.randomUUID(),
      firstName: child.firstName || "",
      lastName: child.lastName || "",
      nic: child.nic || "",
      dateOfBirth: child.dateOfBirth || "",
      gender: validateGender(child.gender),
      school: child.school || "",
      grade: child.grade || "",
    })) : [],
    otherMembers: Array.isArray(data.otherMembers) ? data.otherMembers.map((member: any) => ({
      id: crypto.randomUUID(),
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      nic: member.nic || "",
      dateOfBirth: member.dateOfBirth || "",
      gender: validateGender(member.gender),
      relationship: member.relationship || "",
    })) : [],
    income: data.income || "",
    landOwnership: validateLandOwnership(data.landOwnership),
  };

  return validatedData;
}

function validateGender(gender: string, defaultGender: "male" | "female" = "male"): "male" | "female" {
  if (gender === "male" || gender === "female") {
    return gender;
  }
  return defaultGender;
}

function validateLandOwnership(landOwnership: string): "owned" | "rented" | "other" {
  if (landOwnership === "owned" || landOwnership === "rented" || landOwnership === "other") {
    return landOwnership;
  }
  return "owned";
}
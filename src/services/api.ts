
import { FormResponse, UserData } from "../types/form";

export const registerUser = async (userData: UserData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch("https://dynamic-form-generator-9rl7.onrender.com/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rollNumber: userData.rollNumber,
        name: userData.name,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to register user");
    }

    return { success: true, message: data.message || "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getFormStructure = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(
      `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch form structure");
    }

    return data;
  } catch (error) {
    console.error("Form fetch error:", error);
    throw error;
  }
};

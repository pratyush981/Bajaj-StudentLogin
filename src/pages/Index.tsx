
import { useState } from "react";
import { FormResponse, UserData } from "@/types/form";
import LoginForm from "@/components/LoginForm";
import DynamicForm from "@/components/DynamicForm";
import { registerUser, getFormStructure } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (data: UserData) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response.success) {
        setUserData(data);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.name}!`,
        });
        
        // Pass the roll number when fetching form data
        fetchFormData(data.rollNumber);
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchFormData = async (rollNumber: string) => {
    try {
      const response = await getFormStructure(rollNumber);
      setFormData(response);
    } catch (error) {
      toast({
        title: "Error Fetching Form",
        description: "There was an error loading the registration form.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-2">Student Registration System</h1>
          <p className="text-muted-foreground">Complete your registration in multiple sections</p>
        </header>

        {isLoading && !formData && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        )}

        {!isLoading && !isLoggedIn && (
          <LoginForm onLoginSuccess={handleLogin} isLoading={isLoading} />
        )}

        {isLoggedIn && formData && (
          <div className="mt-8">
            <div className="mb-6 bg-blue-50 p-4 rounded-md shadow-sm">
              <p className="font-medium">
                Logged in as: <span className="text-primary">{userData?.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Roll Number: {userData?.rollNumber}
              </p>
            </div>
            <DynamicForm formData={formData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

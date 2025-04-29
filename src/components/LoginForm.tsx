
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserData } from "@/types/form";

interface LoginFormProps {
  onLoginSuccess: (userData: UserData) => void;
  isLoading: boolean;
}

const LoginForm = ({ onLoginSuccess, isLoading }: LoginFormProps) => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ rollNumber: "", name: "" });
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = { rollNumber: "", name: "" };
    let isValid = true;

    if (!rollNumber.trim()) {
      newErrors.rollNumber = "Roll Number is required";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLoginSuccess({ rollNumber, name });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Student Login</CardTitle>
        <CardDescription>Enter your details to continue to registration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              type="text"
              placeholder="Enter your roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className={errors.rollNumber ? "border-destructive" : ""}
              data-testid="roll-number-input"
            />
            {errors.rollNumber && (
              <p className="text-sm text-destructive">{errors.rollNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
              data-testid="name-input"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <CardFooter className="px-0 pt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
              data-testid="login-button"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

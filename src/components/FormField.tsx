
import { useState, useEffect } from "react";
import { FormField as FormFieldType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (id: string, value: any) => void;
  onValidityChange: (id: string, isValid: boolean) => void;
}

const FormField = ({ field, value, onChange, onValidityChange }: FormFieldProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  const validateField = (value: any) => {
    if (field.required && !value) {
      return field.validation?.message || "This field is required";
    }

    if (field.minLength && typeof value === "string" && value.length > 0 && value.length < field.minLength) {
      return `Must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && typeof value === "string" && value.length > field.maxLength) {
      return `Must be no more than ${field.maxLength} characters`;
    }

    if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      return "Please enter a valid email address";
    }

    if (field.type === "checkbox" && field.required && Array.isArray(value) && value.length === 0) {
      return "Please select at least one option";
    }

    return null;
  };

  useEffect(() => {
    if (isTouched) {
      const validationError = validateField(value);
      setError(validationError);
      onValidityChange(field.fieldId, validationError === null);
    }
  }, [value, isTouched, field]);

  const handleChange = (val: any) => {
    if (!isTouched) setIsTouched(true);
    onChange(field.fieldId, val);
  };

  const handleBlur = () => {
    if (!isTouched) setIsTouched(true);
    const validationError = validateField(value);
    setError(validationError);
    onValidityChange(field.fieldId, validationError === null);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            id={field.fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={error ? "border-destructive" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={error ? "border-destructive" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "date":
        return (
          <Input
            id={field.fieldId}
            type="date"
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className={error ? "border-destructive" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "dropdown":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleChange(val)}
            onOpenChange={(open) => !open && handleBlur()}
          >
            <SelectTrigger 
              className={error ? "border-destructive" : ""} 
              data-testid={field.dataTestId}
            >
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(val) => {
              handleChange(val);
              handleBlur();
            }}
            className="space-y-2"
            data-testid={field.dataTestId}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2" data-testid={field.dataTestId}>
            {field.options?.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.fieldId}-${option.value}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValue = Array.isArray(value) ? [...value] : [];
                      if (checked) {
                        if (!newValue.includes(option.value)) {
                          newValue.push(option.value);
                        }
                      } else {
                        const index = newValue.indexOf(option.value);
                        if (index !== -1) {
                          newValue.splice(index, 1);
                        }
                      }
                      handleChange(newValue);
                      handleBlur();
                    }}
                    data-testid={option.dataTestId}
                  />
                  <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
                </div>
              );
            })}
          </div>
        );

      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-baseline">
        <Label htmlFor={field.fieldId} className={field.required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
          {field.label}
        </Label>
      </div>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;

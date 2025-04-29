
import { useState, useEffect } from "react";
import { FormSection as FormSectionType } from "@/types/form";
import FormField from "./FormField";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface FormSectionProps {
  section: FormSectionType;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  formData: Record<string, any>;
  updateFormData: (fieldId: string, value: any) => void;
  isFirst: boolean;
  isLast: boolean;
}

const FormSection = ({
  section,
  onNext,
  onPrevious,
  onSubmit,
  formData,
  updateFormData,
  isFirst,
  isLast,
}: FormSectionProps) => {
  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>({});
  const [isSectionValid, setIsSectionValid] = useState(false);

  // Initialize field validity
  useEffect(() => {
    const initialValidity: Record<string, boolean> = {};
    section.fields.forEach((field) => {
      const value = formData[field.fieldId];
      const isValid = !field.required || (value !== undefined && value !== "" && value !== null);
      if (field.type === "checkbox" && field.required) {
        initialValidity[field.fieldId] = Array.isArray(value) && value.length > 0;
      } else {
        initialValidity[field.fieldId] = isValid;
      }
    });
    setFieldValidity(initialValidity);
  }, [section, formData]);

  // Update section validity whenever field validity changes
  useEffect(() => {
    const allFieldsValid = section.fields.every(
      (field) => fieldValidity[field.fieldId] === true
    );
    setIsSectionValid(allFieldsValid);
  }, [fieldValidity, section]);

  const handleFieldValidityChange = (fieldId: string, isValid: boolean) => {
    setFieldValidity((prev) => ({
      ...prev,
      [fieldId]: isValid,
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={formData[field.fieldId]}
            onChange={updateFormData}
            onValidityChange={handleFieldValidityChange}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className={isFirst ? "invisible" : ""}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {isLast ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isSectionValid}
            className="ml-auto"
            data-testid="form-submit-button"
          >
            <Check className="mr-2 h-4 w-4" />
            Submit
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!isSectionValid}
            className="ml-auto"
            data-testid="form-next-button"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormSection;


import { useState, useEffect } from "react";
import { FormResponse } from "@/types/form";
import FormSection from "./FormSection";
import ProgressBar from "./ProgressBar";
import { useToast } from "@/hooks/use-toast";

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm = ({ formData }: DynamicFormProps) => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  const { sections } = formData.form;

  // Initialize form values with empty values for checkboxes
  useEffect(() => {
    const initialValues: Record<string, any> = { ...formValues };
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === "checkbox" && initialValues[field.fieldId] === undefined) {
          initialValues[field.fieldId] = [];
        }
      });
    });
    setFormValues(initialValues);
  }, [formData]);

  const handleUpdateFormData = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      toast({
        title: "Section Complete",
        description: `${sections[currentSection].title} information saved.`,
      });
      setCurrentSection((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Your registration has been submitted successfully.",
    });
    console.log("Form submitted with data:", formValues);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">{formData.form.formTitle}</h1>
        <p className="text-muted-foreground">Form ID: {formData.form.formId} | Version: {formData.form.version}</p>
      </div>

      <ProgressBar
        currentSection={currentSection}
        totalSections={sections.length}
      />

      {sections[currentSection] && (
        <FormSection
          section={sections[currentSection]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          formData={formValues}
          updateFormData={handleUpdateFormData}
          isFirst={currentSection === 0}
          isLast={currentSection === sections.length - 1}
        />
      )}
    </div>
  );
};

export default DynamicForm;

import React, { useState } from "react";
import StepOneCreatePage from "./StepsToCreatePage/StepOneCreatePage";
import StepTwoCreatePage from "./StepsToCreatePage/StepTwoCreatePage";
import StepThreeCreatePage from "./StepsToCreatePage/StepThreeCreatePage";
import StepFourCreatePage from "./StepsToCreatePage/StepFourCreatePage";
import StepFiveCreatePage from "./StepsToCreatePage/StepFiveCreatePage";
import { createCompany } from "../../../services/api";

const CreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    industry: "",
    employees: "",
    businessEmail: "",
    businessPhone: "",
    headquarters: "",
    yearEstablished: "",
    pageName: "",
    description: "",
    category: "",
    tags: "",
    email: "",
    phoneNumber: "",
    address: "",
    websiteURL: "",
    socialMediaProfiles: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    businessHours: {
      openingTime: "",
      closingTime: "",
    },
    servicesOffered: "",
  });

  const [stepTwoData, setStepTwoData] = useState({
    category: "",
    tags: "",
  });

  const handleStepTwoChange = (field: string) => (event: any) => {
    setStepTwoData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const handleChange =
    (input: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      if (input.startsWith("socialMediaProfiles.")) {
        const key = input.split(".")[1];
        setFormData({
          ...formData,
          socialMediaProfiles: {
            ...formData.socialMediaProfiles,
            [key]: e.target.value,
          },
        });
      } else if (input.startsWith("businessHours.")) {
        const key = input.split(".")[1];
        setFormData({
          ...formData,
          businessHours: {
            ...formData.businessHours,
            [key]: e.target.value,
          },
        });
      } else {
        setFormData({ ...formData, [input]: e.target.value });
      }
    };

  const handleSubmit = async () => {
    try {
      const transformedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Ensure tags are an array
      };
      const response = await createCompany(transformedData);
      console.log("Company created successfully:", response);
      alert("Company created successfully!");
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company. Please try again.");
    }
  };

  const steps = [
    <StepOneCreatePage
      formData={formData}
      handleChange={handleChange}
      handleNext={handleNext}
    />,
    <StepTwoCreatePage
      stepTwoData={stepTwoData}
      handleStepTwoChange={handleStepTwoChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />,
    <StepThreeCreatePage
      formData={formData}
      handleChange={handleChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />,
    <StepFourCreatePage
      formData={formData}
      handleChange={handleChange}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />,
    <StepFiveCreatePage
      formData={formData}
      handleSubmit={handleSubmit}
      handlePrevious={handlePrevious}
    />,
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      {steps[currentStep - 1]}
    </div>
  );
};

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex items-center mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`h-2 flex-1 mx-1 rounded-full ${
          i < currentStep ? "bg-blue-600" : "bg-gray-300"
        }`}
      ></div>
    ))}
  </div>
);

export default CreatePage;

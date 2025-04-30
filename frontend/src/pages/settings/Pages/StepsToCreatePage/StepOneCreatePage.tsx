import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countryPhoneFormats from "./CountryPhoneFormats";

const StepOneCreatePage: React.FC<{
  formData: any;
  handleChange: any;
  handleNext: any;
}> = ({ formData, handleChange, handleNext }) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isNextEnabled, setIsNextEnabled] = useState<boolean>(false);

  const validatePhoneNumber = (value: string, countryCode: string) => {
    const format = countryPhoneFormats[countryCode];
    if (value && format) {
      const normalizedValue = value.replace(/[^0-9]/g, "");
      const normalizedFormat = format.replace(/[^0-9X]/g, "");

      const regex = new RegExp(
        "^" +
          format
            .replace(/X/g, "\\d")
            .replace(/ /g, "\\s?")
            .replace(/\+/g, "\\+") +
          "$"
      );

      const matchesFormat = regex.test(value);
      const lengthMatches = normalizedValue.length === normalizedFormat.length;

      return matchesFormat && lengthMatches;
    }
    return false;
  };

  const handlePhoneChange = (
    value: string | undefined,
    countryCode: string
  ) => {
    if (value) {
      const isValid = validatePhoneNumber(value, countryCode);
      if (!isValid) {
        setPhoneError("Invalid phone number format.");
      } else {
        setPhoneError(null);
        handleChange("businessPhone")({ target: { value } });
      }
    } else {
      setPhoneError(null);
      handleChange("businessPhone")({ target: { value: "" } });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    handleChange("businessEmail")(e);
    if (!validateEmail(emailValue) && emailValue.trim() !== "") {
      setEmailError("Invalid email format.");
    } else {
      setEmailError(null);
    }
  };

  useEffect(() => {
    const isFormValid =
      formData.businessName &&
      formData.businessPhone &&
      !phoneError &&
      formData.address &&
      formData.businessEmail &&
      validateEmail(formData.businessEmail) &&
      !emailError &&
      formData.industryType;
    setIsNextEnabled(isFormValid);
  }, [
    formData.businessName,
    formData.businessPhone,
    phoneError,
    formData.address,
    formData.businessEmail,
    emailError,
    formData.industryType,
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 1: Basic Information</h2>
      {/* Business Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Business Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={handleChange("businessName")}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter the name of your business"
          required
        />
      </div>
      {/* Business Phone */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Business Phone <span className="text-red-600">*</span>
        </label>
        <PhoneInput
          international
          defaultCountry="TR"
          value={formData.businessPhone}
          onChange={(value) =>
            handlePhoneChange(value, formData.countryCode || "TR")
          }
          className="w-full p-2 border rounded-lg"
        />
        {phoneError && (
          <span className="text-red-600 text-sm mt-2">{phoneError}</span>
        )}
      </div>
      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Address <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.address}
          onChange={handleChange("address")}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter your business address"
          required
        ></textarea>
      </div>
      {/* Business Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Business Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          value={formData.businessEmail}
          onChange={handleEmailChange}
          className={`w-full p-2 border rounded-lg ${
            emailError ? "border-red-600" : ""
          }`}
          placeholder="Enter your business email"
          required
        />
        {emailError && (
          <span className="text-red-600 text-sm mt-2">{emailError}</span>
        )}
      </div>

      {/* Industry Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Industry Type <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.industryType}
          onChange={handleChange("industryType")}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="" disabled>
            Select your industry
          </option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Retail">Retail</option>
          <option value="Student Club">Student Club</option>
          <option value="Restaurant & Cafe">Restaurant & Cafe</option>
          <option value="Bookstore">Bookstore</option>
          <option value="Gym & Fitness">Gym & Fitness</option>
          <option value="Library Services">Library Services</option>
          <option value="Dormitory Services">Dormitory Services</option>
          <option value="Catering">Catering</option>
          <option value="Recreational Activities">
            Recreational Activities
          </option>
          <option value="Events Management">Events Management</option>
          <option value="Transportation">Transportation</option>
          <option value="Media & Communication">Media & Communication</option>
          <option value="Tutoring & Academic Support">
            Tutoring & Academic Support
          </option>
          <option value="Career Services">Career Services</option>
          <option value="IT Services">IT Services</option>
          <option value="Research Centers">Research Centers</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Full-Width Next Button */}
      <button
        onClick={handleNext}
        disabled={!isNextEnabled} // Enable button only if form is valid
        className={`w-full px-4 py-2 rounded-lg mt-4 ${
          !isNextEnabled
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default StepOneCreatePage;

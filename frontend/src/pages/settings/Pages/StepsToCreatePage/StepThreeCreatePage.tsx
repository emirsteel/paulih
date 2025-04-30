import React from "react";

const StepThreeCreatePage: React.FC<{
  formData: any;
  handleChange: any;
  handleNext: any;
  handlePrevious: any;
}> = ({ formData, handleChange, handleNext, handlePrevious }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">
      Step 3: Additional Information
    </h2>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Company Description
      </label>
      <textarea
        value={formData.mission}
        onChange={handleChange("mission")}
        className="w-full p-2 border rounded-lg"
        placeholder="Describe the company's mission or goals"
      ></textarea>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Primary Services</label>
      <textarea
        value={formData.services}
        onChange={handleChange("services")}
        className="w-full p-2 border rounded-lg"
        placeholder="List the primary services offered by the company"
      ></textarea>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Target Audience</label>
      <input
        type="text"
        value={formData.targetAudience}
        onChange={handleChange("targetAudience")}
        className="w-full p-2 border rounded-lg"
        placeholder="Who is the primary audience for the company?"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Years in Operation
      </label>
      <input
        type="number"
        value={formData.yearsInOperation}
        onChange={handleChange("yearsInOperation")}
        className="w-full p-2 border rounded-lg"
        placeholder="Enter the number of years the company has been operating"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Company Mission</label>
      <textarea
        value={formData.valueProposition}
        onChange={handleChange("valueProposition")}
        className="w-full p-2 border rounded-lg"
        placeholder="What makes the company stand out?"
      ></textarea>
    </div>

    {/* Buttons */}
    <div className="space-y-2">
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Next
      </button>
      <button
        onClick={handlePrevious}
        className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
      >
        Back
      </button>
    </div>
  </div>
);

export default StepThreeCreatePage;

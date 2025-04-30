const StepFiveCreatePage: React.FC<{
  formData: any;
  handleSubmit: any;
  handlePrevious: any;
}> = ({ formData, handleSubmit, handlePrevious }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Step 5: Review and Submit</h2>
    <pre className="bg-gray-100 p-4 rounded-lg">
      {JSON.stringify(formData, null, 2)}
    </pre>

    {/* Buttons */}
    <div className="space-y-2">
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
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

export default StepFiveCreatePage;

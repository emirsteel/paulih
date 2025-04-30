import React from "react";

interface Company {
  id: string;
  name: string;
  logo?: string; // Optional logo URL
  description?: string; // Optional description
}

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (companyId: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onSelectCompany,
}) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Companies</h3>
      <ul className="space-y-4">
        {companies.map((company) => (
          <li
            key={company.id}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition"
            onClick={() => onSelectCompany(company.id)}
          >
            {company.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div>
              <h4 className="text-md font-bold text-gray-800">
                {company.name}
              </h4>
              {company.description && (
                <p className="text-sm text-gray-600">{company.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;

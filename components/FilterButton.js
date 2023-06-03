import { useState } from "react";

export default function FilterButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const [selectedCategory, setSelectedCategory] = useState('Filter');
  const categories = ['Headphones', 'Mouse', 'Alexa']; 


  return (
    <div className="ml-auto my-auto">
      <div className="relative inline-block text-left">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => handleDropdownToggle()}
        >
          {selectedCategory}
        </button>

        {isDropdownOpen && (
          <div className="z-50 absolute right-0 mt-2 w-40 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`block px-4 py-2 text-sm text-gray-700 ${
                  selectedCategory === category ? "bg-gray-100" : ""
                } hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

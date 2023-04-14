import React from 'react';

const LocationModal = ({ isOpen, closeModal, currentLocation, handleInputChange, handleFormSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-dark flex">
      <div className="relative p-6 mx-auto my-32 w-full max-w-md">
        <div className="bg-white rounded shadow-lg">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-semibold">{currentLocation.id ? 'Edit Location' : 'Add Location'}</h2>
          </div>
          <div className="p-4">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentLocation.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-2">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={currentLocation.address || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-2">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={currentLocation.city || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block mb-2">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={currentLocation.state || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="zip" className="block mb-2">Zip</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  value={currentLocation.zip || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {currentLocation.id ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

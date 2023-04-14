import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Layout from '../components/Layout';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editLocation, setEditLocation] = useState(null);
  const [updatedLocation, setUpdatedLocation] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase.from('locations').select('*');
    if (data) {
      setLocations(data);
    } else {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addLocation = async () => {
    const { data, error } = await supabase.from('locations').insert([newLocation]);
    if (data) {
      setLocations([...locations, ...data]);
      setShowAddModal(false);
      setNewLocation({});
    } else {
      console.error(error);
    }
  };

  const updateLocation = async (id, updatedLocation) => {
    const { data, error } = await supabase
      .from('locations')
      .update(updatedLocation)
      .match({ id });

    if (data) {
      setLocations(
        locations.map((location) => (location.id === id ? { ...location, ...updatedLocation } : location))
      );
      setEditLocation(null);
    } else {
      console.error(error);
    }
  };

  const deleteLocation = async (id) => {
    const { data, error } = await supabase.from('locations').delete().match({ id });

    if (data) {
      setLocations(locations.filter((location) => location.id !== id));
    } else {
      console.error(error);
    }
  };

  const handleEditInputChange = (e, key) => {
    setUpdatedLocation({ ...updatedLocation, [key]: e.target.value });
  };

  const handleAddInputChange = (e, key) => {
    setNewLocation({ ...newLocation, [key]: e.target.value });
  };

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLocationFields = (location, handleInputChange) => (
    <>
      {Object.entries(location)
        .filter(([key]) => key !== 'id' && key !== 'geom' && key !== 'created_at')
        .map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              value={location[key]}
              onChange={(e) => handleInputChange(e, key)}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        ))}
    </>
  );

  return (
    <Layout>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-4">Locations</h1>
          <p className="text-lg mb-6">Welcome to the Locations page.</p>
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for a location"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-6"
            onClick={() => setShowAddModal(true)}
          >
            Add Location
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
                <p className="mb-2">
                  {location.address}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>
                <p className="mb-2">Phone: {location.phone}</p>
                <p className="mb-2">Email: {location.email}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setEditLocation(location)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => deleteLocation(location.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white w-96 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Add Location</h2>
                {renderLocationFields(newLocation, handleAddInputChange)}
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={addLocation}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddModal(false)}></div>
            </div>
          )}
          {editLocation && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white w-96 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Edit Location</h2>
                {renderLocationFields(editLocation, handleEditInputChange)}
                <div className="flex justify-end">
                ...
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                    onClick={() => setEditLocation(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => updateLocation(editLocation.id, updatedLocation)}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditLocation(null)}></div>
            </div>
          )}
        </div>
    </Layout>
  );
};

export default Locations;


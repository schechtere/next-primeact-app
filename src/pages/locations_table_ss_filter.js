// components/LocationTable.js
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import Layout from "../components/Layout";
import { useRef } from 'react';
import _ from 'lodash';
import LocationModal from '../components/LocationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from "use-debounce";




const LocationTable = () => {
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [debouncedFilters] = useDebounce(filters, 500);


  useEffect(() => {
    if (Object.values(debouncedFilters).some((filterValue) => filterValue)) {
      fetchLocations();
    }
  }, [debouncedFilters]);



  const fetchLocations_fancy = async () => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .filter(
        (location) =>
          (!filters.name || location.name.ilike(`%${filters.name}%`)) &&
          (!filters.address || location.address.ilike(`%${filters.address}%`)) &&
          (!filters.city || location.city.ilike(`%${filters.city}%`)) &&
          (!filters.state || location.state.ilike(`%${filters.state}%`)) &&
          (!filters.zip || location.zip.ilike(`%${filters.zip}%`))
      );

    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data);
    }
  };

  const fetchLocations = async () => {
    let query = supabase.from("locations").select("*");
  
    if (filters.name) {
      query = query.filter("name", "ilike", `%${filters.name}%`);
    }
    if (filters.address) {
      query = query.filter("address", "ilike", `%${filters.address}%`);
    }
    if (filters.city) {
      query = query.filter("city", "ilike", `%${filters.city}%`);
    }
    if (filters.state) {
      query = query.filter("state", "ilike", `%${filters.state}%`);
    }
    if (filters.zip) {
      query = query.filter("zip", "ilike", `%${filters.zip}%`);
    }
  
    const { data, error } = await query;
  
    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data);
    }
  };
  


  const openModal = (location = {}) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentLocation({});
    setIsModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

    if (Object.values(filters).some((filterValue) => filterValue)) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  };

  const fetchFilteredLocations = async (filterData) => {
    // Construct your query with Supabase query builder using filterData
    // e.g., if filtering by "name" column, you'd use something like this:
    // .ilike('name', `%${filterData.name}%`)

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      // Add your filtering conditions here based on filterData
      .ilike('name', `%${filterData.name}%`)
      .ilike('address', `%${filterData.address}%`)
      .ilike('city', `%${filterData.city}%`)
      .ilike('state', `%${filterData.state}%`)
      .ilike('zip', `%${filterData.zip}%`);

    if (error) {
      console.error('Error fetching filtered locations:', error);
    } else {
      setLocations(data);
    }
  };


  const handleEdit = (location) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentLocation({});
    setIsModalOpen(true);
  };


  const handleDelete = async (locationId) => {
    // Implement the logic for deleting a location
    const { error } = await supabase.from('locations').delete().eq('id', locationId);
    if (error) {
      console.log('Error deleting location:', error);
    } else {
      fetchLocations(); // Refresh the locations after deleting
    }
  };

  const handleInputChange = (e) => {
    setCurrentLocation({ ...currentLocation, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Add/update the location in the database
    if (currentLocation.id) {
      // Update the location
      const { data, error } = await supabase
        .from('locations')
        .update({
          name: currentLocation.name,
          address: currentLocation.address,
          city: currentLocation.city,
          state: currentLocation.state,
          zip: currentLocation.zip,
          geom: currentLocation.geom,
          phone: currentLocation.phone,
          email: currentLocation.email,
        })
        .eq('id', currentLocation.id);

      if (error) {
        console.log('Error updating location:', error);
      } else {
        console.log('Location updated successfully:', data);
      }
    } else {
      // Add the new location
      const { data, error } = await supabase
        .from('locations')
        .insert([
          {
            name: currentLocation.name,
            address: currentLocation.address,
            city: currentLocation.city,
            state: currentLocation.state,
            zip: currentLocation.zip,
            geom: currentLocation.geom,
            phone: currentLocation.phone,
            email: currentLocation.email,
          },
        ]);

      if (error) {
        console.log('Error adding location:', error);
      } else {
        console.log('Location added successfully:', data);
      }
    }

    // Close the modal
    closeModal();

    // Refresh the locations list
    await fetchLocations();
  };

  const handleCancel = () => {
    closeModal();
  };


  return (
    <Layout>
      <div className="overflow-x-auto">
        <table className="w-full min-w-lg whitespace-nowrap divide-y divide-gray-200 bg-white shadow-md rounded-md">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Zip</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
            <tr>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Filter by name"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                  placeholder="Filter by address"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Filter by city"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="Filter by state"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="zip"
                  value={filters.zip}
                  onChange={handleFilterChange}
                  placeholder="Filter by zip"
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {locations.map((location, index) => (
              <tr key={location.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-4 py-2">{location.name}</td>
                <td className="px-4 py-2">{location.address}</td>
                <td className="px-4 py-2">{location.city}</td>
                <td className="px-4 py-2">{location.state}</td>
                <td className="px-4 py-2">{location.zip}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEdit(location)} className='text-green-500'>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(location.id)} className='ml-4 text-red-500'>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add button */}
        <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          Add Location
        </button>

        {/* Modal */}
        <LocationModal
          isOpen={isModalOpen}
          currentLocation={currentLocation}
          onChange={handleInputChange}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />

      </div>
    </Layout>
  );
};

export default LocationTable;

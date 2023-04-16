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
import ReactPaginate from "react-paginate";



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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);



  useEffect(() => {
    if (Object.values(debouncedFilters).some((filterValue) => filterValue)) {
      fetchLocations(page, pageSize);
    }
  }, [debouncedFilters, page]);

 

  const buildLocationsQuery = () => {
    const query = supabase.from("locations").select("*");
  
    if (filters.name) {
      query.ilike("name", `%${filters.name}%`);
    }
    if (filters.address) {
      query.or(`address.ilike.%${filters.address}%`);
    }
    if (filters.city) {
      query.or(`city.ilike.%${filters.city}%`);
    }
    if (filters.state) {
      query.or(`state.ilike.%${filters.state}%`);
    }
    if (filters.zip) {
      query.or(`zip.ilike.%${filters.zip}%`);
    }
  
    return query;
  };
  

  const fetchLocations = async (page, pageSize) => {
    const countQuery =buildLocationsQuery();
    const dataQuery = buildLocationsQuery().range((page - 1) * pageSize, page * pageSize - 1);

    const [{ data, error }, { data: countData, error: countError }] = await Promise.all([
      dataQuery.select("*"),
      countQuery.select("id", { count: "exact", head: true })
    ]);

   console.log("data", data);
   console.log('countData.length', countData.length);
  
    if (error || countError) {
      console.error("Error fetching locations:", error || countError);
    } else {
      setLocations(data);
      setTotalCount(countData.length);
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
      fetchLocations(page, pageSize); // Refresh the locations after deleting
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
    await fetchLocations(page, pageSize);
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

        

        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(totalCount / pageSize)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(selected) => {
            const newPage = selected.selected + 1;
            setPage(newPage);
            fetchLocations(newPage, pageSize);
          }}
          containerClassName={"flex justify-center py-4"}
          pageClassName={"mx-1"}
          activeClassName={"bg-blue-500 border-blue-500 text-white"}
          pageLinkClassName={"px-3 py-1 border border-gray-300 rounded-md"}
          breakLinkClassName={"text-gray-500"}
          previousLinkClassName={"px-3 py-1 cursor-pointer"}
          nextLinkClassName={"px-3 py-1 cursor-pointer"}
        />


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

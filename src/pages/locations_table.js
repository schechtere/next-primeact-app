// components/LocationTable.js
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import Layout from "../components/Layout";

const LocationTable = () => {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase.from("locations").select("*");
    if (data) setLocations(data);
    if (error) console.error("Error fetching locations:", error);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredLocations = locations.filter((location) => {
    return (
      location.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      location.address.toLowerCase().includes(filter.address.toLowerCase()) &&
      location.city.toLowerCase().includes(filter.city.toLowerCase()) &&
      location.state.toLowerCase().includes(filter.state.toLowerCase()) &&
      location.zip.toLowerCase().includes(filter.zip.toLowerCase())
    );
  });

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
            </tr>
            <tr>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="name"
                  value={filter.name}
                  onChange={handleFilterChange}
                  placeholder="Filter by name"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="address"
                  value={filter.address}
                  onChange={handleFilterChange}
                  placeholder="Filter by address"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="city"
                  value={filter.city}
                  onChange={handleFilterChange}
                  placeholder="Filter by city"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="state"
                  value={filter.state}
                  onChange={handleFilterChange}
                  placeholder="Filter by state"
                />
              </th>
              <th className="py-2">
                <input
                  className="w-full px-2 py-1 border rounded-md"
                  name="zip"
                  value={filter.zip}
                  onChange={handleFilterChange}
                  placeholder="Filter by zip"
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLocations.map((location, index) => (
              <tr key={location.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-4 py-2">{location.name}</td>
                <td className="px-4 py-2">{location.address}</td>
                <td className="px-4 py-2">{location.city}</td>
                <td className="px-4 py-2">{location.state}</td>
                <td className="px-4 py-2">{location.zip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default LocationTable;

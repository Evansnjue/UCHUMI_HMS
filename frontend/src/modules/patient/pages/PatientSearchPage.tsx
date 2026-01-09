/**
 * Patient Search Page
 * Search, filter, and browse patients
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientTable } from '../components';
import { usePatientSearch } from '../hooks';
import { PatientSearchQueryDto } from '../types';
import {
  useCanCreatePatient,
  useCanEditPatient,
  useCanDeactivatePatient,
} from '../guards';

export const PatientSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const canCreate = useCanCreatePatient();
  const canEdit = useCanEditPatient();
  const canDeactivate = useCanDeactivatePatient();

  const [searchQuery, setSearchQuery] = useState<PatientSearchQueryDto>({
    q: '',
    page: 1,
    limit: 20,
    sortBy: 'registeredAt',
    sortOrder: 'desc',
  });

  const { data, isLoading } = usePatientSearch(searchQuery);

  const handleSearch = (value: string) => {
    setSearchQuery((prev) => ({
      ...prev,
      q: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">Search and manage patient records</p>
        </div>
        {canCreate && (
          <button
            onClick={() => navigate('/patient/register')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Register Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, phone, or patient number..."
            value={searchQuery.q || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Patient Table */}
        <PatientTable
          patients={data?.data || []}
          isLoading={isLoading}
          total={data?.total || 0}
          page={searchQuery.page || 1}
          limit={searchQuery.limit || 20}
          onPageChange={handlePageChange}
          onRowClick={(patient) => navigate(`/patient/profile/${patient.id}`)}
          onEditClick={(patient) => navigate(`/patient/register/${patient.id}`)}
          onDeactivateClick={(patient) => {
            // TODO: Show deactivation modal
            console.log('Deactivate:', patient.id);
          }}
          canEdit={canEdit}
          canDeactivate={canDeactivate}
        />
      </div>
    </div>
  );
};

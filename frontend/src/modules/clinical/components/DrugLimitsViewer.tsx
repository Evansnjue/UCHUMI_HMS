import React from 'react';
import { useDrugDailyLimits } from '../hooks';

interface Props {
  clinicianId?: string;
  category?: string;
}

export const DrugLimitsViewer: React.FC<Props> = ({ clinicianId, category }) => {
  const { data, isLoading, error } = useDrugDailyLimits({ clinicianId });

  if (isLoading) return <div className="p-4">Loading drug limits...</div>;
  if (error) return <div className="p-4 text-red-600">Failed to load drug limits</div>;

  const limits = data || [];
  const filtered = category ? limits.filter((l) => l.category === category) : limits;

  if (filtered.length === 0) return <div className="p-4 text-sm text-gray-600">No limits configured.</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-semibold">Drug Daily Limits</h3>
      <ul className="mt-2 space-y-2">
        {filtered.map((l) => (
          <li key={l.category} className="flex justify-between">
            <span className="text-sm">{l.category}</span>
            <span className="text-sm font-medium">{l.maxPerDay}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrugLimitsViewer;

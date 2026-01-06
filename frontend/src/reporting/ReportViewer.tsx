import React from 'react';

export default function ReportViewer({ report }: { report: any }) {
  if (!report) return <div>No report</div>;
  const kpis = report.payload?.kpis || {};
  return (
    <div>
      <h3>{report.name}</h3>
      <p>{report.periodStart} — {report.periodEnd}</p>
      <ul>
        {Object.entries(kpis).map(([k, v]: any) => <li key={k}><strong>{k}</strong>: {JSON.stringify(v)}</li>)}
      </ul>
      <button onClick={() => alert('Export to CSV - implement server export endpoint')}>Export CSV</button>
    </div>
  );
}

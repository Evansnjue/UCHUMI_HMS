import React, { useEffect, useState } from 'react';
import { getQueue, nextInQueue, completeVisit } from './api';

export const QueueDashboard: React.FC<{ department: string }> = ({ department }) => {
  const [queue, setQueue] = useState<any[]>([]);

  const load = async () => {
    const q = await getQueue(department);
    setQueue(q);
  };

  useEffect(() => { load(); }, [department]);

  const onNext = async () => {
    await nextInQueue(department);
    load();
  };

  const onComplete = async (id: string) => {
    await completeVisit(id);
    load();
  };

  return (
    <div>
      <h3>Queue — {department}</h3>
      <button onClick={onNext}>Call Next</button>
      <table>
        <thead>
          <tr><th>Visit#</th><th>Patient</th><th>Enqueued</th><th>Action</th></tr>
        </thead>
        <tbody>
          {queue.map((e) => (
            <tr key={e.id}>
              <td>{e.visit.visitNumber}</td>
              <td>{e.visit.patient.firstName} {e.visit.patient.lastName}</td>
              <td>{new Date(e.enqueuedAt).toLocaleString()}</td>
              <td><button onClick={() => onComplete(e.visit.id)}>Complete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

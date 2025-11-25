'use client';

export default function SpeakerListTable() {
  const speakers = [
    { id: '1', name: 'David Sawyer', expertise: 'Credit Analysis', trainings: 5 },
    { id: '2', name: 'Stacy Glass', expertise: 'HR & Payroll', trainings: 2 },
  ];
  return (
    <table className="min-w-full border divide-y">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left">Name</th>
          <th className="px-3 py-2 text-left">Area of Expertise</th>
          <th className="px-3 py-2 text-left">Trainings Count</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {speakers.map(s => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-3 py-2">{s.name}</td>
            <td className="px-3 py-2">{s.expertise}</td>
            <td className="px-3 py-2">{s.trainings}</td>
            <td className="px-3 py-2">
              <a href={`/admin/speakers/${s.id}`}>View</a> | 
              <a href={`/admin/speakers/${s.id}/edit`}>Edit</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

'use client';

export default function TrainingListTable() {
  // Fetch trainings data via server or dummy for demo
  const trainings = [
    {
      id: '1',
      title: 'UCA Cash Flow Analysis',
      speaker: 'David Sawyer',
      type: 'Live Webinar',
      level: 'Intermediate',
      date: '27/10/2025',
      price: 189,
      status: 'Draft',
    },
    // ...more trainings
  ];

  return (
    <table className="min-w-full border divide-y">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left">Title</th>
          <th className="px-3 py-2 text-left">Speaker</th>
          <th className="px-3 py-2 text-left">Type</th>
          <th className="px-3 py-2 text-left">Level</th>
          <th className="px-3 py-2 text-left">Date</th>
          <th className="px-3 py-2 text-left">Status</th>
          <th className="px-3 py-2 text-left">Price</th>
          <th className="px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {trainings.map(training => (
          <tr key={training.id} className="hover:bg-gray-50">
            <td className="px-3 py-2">{training.title}</td>
            <td className="px-3 py-2">{training.speaker}</td>
            <td className="px-3 py-2">{training.type}</td>
            <td className="px-3 py-2">{training.level}</td>
            <td className="px-3 py-2">{training.date}</td>
            <td className="px-3 py-2">{training.status}</td>
            <td className="px-3 py-2">${training.price}</td>
            <td className="px-3 py-2">
              <a href={`/admin/trainings/${training.id}`}>View</a> | 
              <a href={`/admin/trainings/${training.id}/edit`}>Edit</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

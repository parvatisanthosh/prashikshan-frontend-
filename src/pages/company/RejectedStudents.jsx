import React from "react";

export default function RejectedStudents() {
  // Later you can fetch real data here
  const rejected = [
    { id: 1, name: "Rohan Roy", email: "rohan@example.com", roll: "CS201" },
    { id: 2, name: "Megha Singh", email: "megha@example.com", roll: "CS178" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Rejected Students</h2>
      <p className="muted text-sm">
        These students were not selected for the internship opportunity.
      </p>

      <div className="card p-6 rounded-xl">
        <table className="w-full text-left">
          <thead className="text-sm muted border-b">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Roll No</th>
            </tr>
          </thead>

          <tbody>
            {rejected.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="py-3">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.roll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

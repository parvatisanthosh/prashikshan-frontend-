import React from "react";

export default function SelectedStudents() {
  // Later you can fetch real data here
  const selected = [
    { id: 1, name: "Aditi Verma", email: "aditi@example.com", roll: "CS101" },
    { id: 2, name: "Rahul Singh", email: "rahul@example.com", roll: "CS102" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Selected Students</h2>
      <p className="muted text-sm">
        These students have successfully been selected for the internship.
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
            {selected.map((s) => (
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

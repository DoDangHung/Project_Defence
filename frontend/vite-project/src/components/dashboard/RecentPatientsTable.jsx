import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const RecentPatientsTable = () => {
  const sampleRows = [
    {
      name: 'Edward Parker, 32 Y, M',
      id: '25698',
      ward: 'ICU - 11',
      doctor: 'Dr. ChrisGeller',
      nurse: 'Kip Andrews',
      division: 'Surgery',
    },
    {
      name: 'Maria Dorothy, 35 Y, F',
      id: '56985',
      ward: 'Ge. Ward - 9',
      doctor: 'Dr. Dorene Thirlaway',
      nurse: 'Kevin Burrow',
      division: 'Gynecology',
    },
    {
      name: 'Alasteir Swinglehurst, 54 Y, M',
      id: '68956',
      ward: 'Private A - 5',
      doctor: 'Dr. Elmo Canedo',
      nurse: 'Stacey Izzatt',
      division: 'Dermatology',
    },
    {
      name: 'Broddie Philpon, 29 Y, M',
      id: '10023',
      ward: 'Covid - 10',
      doctor: 'Dr. Emilio Grabiec',
      nurse: 'Stefanie Heamus',
      division: 'COVID-19',
    },
    {
      name: 'Edena Smorthwaite, 41 Y, F',
      id: '23056',
      ward: 'Ge. Ward - 15',
      doctor: 'Dr. Lara Eagger',
      nurse: 'Toinette Antonsen',
      division: 'Neurology',
    },
  ];

  return (
    <CardFull title="Recently Admitted Patients">
      <div className="overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-400 text-xs uppercase">
            <tr>
              <th className="py-2">Patient Name</th>
              <th className="py-2">Patient ID</th>
              <th className="py-2">Ward-Room No.</th>
              <th className="py-2">Assigned Doctor</th>
              <th className="py-2">Division</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {sampleRows.map((r, idx) => (
              <tr
                key={idx}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="py-3">{r.name}</td>
                <td className="py-3">{r.id}</td>
                <td className="py-3">{r.ward}</td>
                <td className="py-3">{r.doctor}</td>
                <td className="py-3 text-indigo-600 font-medium">
                  {r.division}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardFull>
  );
};

export default RecentPatientsTable;

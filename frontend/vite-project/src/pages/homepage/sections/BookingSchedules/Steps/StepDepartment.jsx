import React from 'react';

const departments = [
  { id: 1, name: 'Nội tiết', icon: '🧬' },
  { id: 2, name: 'Da liễu', icon: '🧴' },
  { id: 3, name: 'Tai mũi họng', icon: '👂' },
  { id: 4, name: 'Tim mạch', icon: '❤️' },
  { id: 5, name: 'Nha khoa', icon: '🦷' },
  { id: 6, name: 'Sản phụ khoa', icon: '🤰' },
];

const StepDepartment = ({ onNext }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Chọn chuyên khoa</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={onNext}
            className="bg-white p-6 rounded-xl border hover:border-blue-600 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-3">{dept.icon}</div>
            <h3 className="font-semibold">{dept.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default StepDepartment;

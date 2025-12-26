import React from 'react';

const StepSelectDoctor = ({ target, onSelect, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Quay lại
      </button>

      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            onClick={() => onSelect({ id: item, name: 'Demo' })}
            className="p-4 border rounded-lg cursor-pointer hover:border-blue-600"
          >
            {target === 'doctor' ? 'BS. Nguyễn Văn A' : 'Chuyên khoa Tim mạch'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSelectDoctor;

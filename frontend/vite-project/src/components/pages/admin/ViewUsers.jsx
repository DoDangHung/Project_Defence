import React from 'react';
import { useParams } from 'react-router-dom';

export default function ViewUsers() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-xl font-bold">View User #{id}</h1>
      {/* Hiển thị thông tin */}
    </div>
  );
}

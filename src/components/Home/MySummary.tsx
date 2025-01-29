import React from 'react';

function MySummary() {
  return (
    <div className="container mx-auto  mt-10">
      <p className="text-2xl font-bold">My Summary</p>
      <div className="grid grid-cols-3 gap-4 mt-4 ">
        <div className="bg-red-500">Total Buku</div>
        <div className="bg-blue-500">Sedang di baca </div>
        <div className="bg-blue-500">Selesai Buku</div>
      </div>
    </div>
  );
}

export default MySummary;

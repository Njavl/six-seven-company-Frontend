'use client';

import { useState } from 'react';
import Pagination from '../components/Pagination/Pagination';

export default function ClientTestWrapper() {
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 mb-3">
        Поточна сторінка:{' '}
        <span className="font-bold text-green-600">{page}</span>
      </p>
      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={newPage => setPage(newPage)}
      />
    </div>
  );
}

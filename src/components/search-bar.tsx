'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export function SearchBar({ placeholder = '输入区域或服务类型，如"长宁区 护工"' }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=shanghai`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto">
      <div className="flex flex-1 items-center bg-white border border-zinc-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
        <Search className="w-5 h-5 text-zinc-400 ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-emerald-600 text-white text-sm font-medium rounded-r-lg hover:bg-emerald-700 transition-colors"
        >
          搜索
        </button>
      </div>
    </form>
  );
}

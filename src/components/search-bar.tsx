'use client';

import { Search, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, type FormEvent } from 'react';

const POPULAR_SEARCHES = ['护工', '陪诊', '术后康复', '养老院', '居家护理', '日间照料'];

const HISTORY_KEY = 'search_history';

function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(query: string) {
  const history = getHistory().filter(h => h !== query);
  history.unshift(query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 6)));
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function SearchBar({
  placeholder = '输入区域或服务类型，如"长宁区 护工"',
  citySlug = '',
}: {
  placeholder?: string;
  citySlug?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      saveHistory(trimmed);
      setHistory(getHistory());
      router.push(`/search?q=${encodeURIComponent(trimmed)}&city=${encodeURIComponent(citySlug)}`);
      setOpen(false);
    }
  }

  function handleSuggestionClick(s: string) {
    setQuery(s);
    saveHistory(s);
    setHistory(getHistory());
    router.push(`/search?q=${encodeURIComponent(s)}&city=${encodeURIComponent(citySlug)}`);
    setOpen(false);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div ref={ref} className="relative flex w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-1">
        <div className="flex flex-1 items-center bg-white border border-zinc-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Search className="w-5 h-5 text-zinc-400 ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setHistory(getHistory()); setOpen(true); }}
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

      {open && (history.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-2" role="listbox">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />最近搜索
            </span>
            <button
              onClick={handleClearHistory}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              清除
            </button>
          </div>
          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(h)}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              role="option"
            >
              <Clock className="w-3 h-3 text-zinc-300" />
              {h}
            </button>
          ))}
        </div>
      )}

      {open && history.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-2" role="listbox">
          <div className="px-3 py-1 text-xs text-zinc-400">热门搜索</div>
          {POPULAR_SEARCHES.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              role="option"
            >
              <Search className="w-3 h-3 text-zinc-300" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

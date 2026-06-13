import { Search } from 'lucide-react'

export default function FilterBar({ filters, onChange }) {
  const handle = (key, val) => onChange({ ...filters, [key]: val })

  const btnCls = (active) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
    ${active
      ? 'bg-violet-600 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={filters.search}
          onChange={(e) => handle('search', e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-gray-50 dark:bg-gray-700
            border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all','work','personal','study'].map(cat => (
          <button key={cat} onClick={() => handle('category', cat)}
            className={btnCls(filters.category === cat)}>
            {cat === 'all' ? '🗂 All' : cat === 'work' ? '💼 Work' : cat === 'personal' ? '👤 Personal' : '📚 Study'}
          </button>
        ))}

        <div className="w-px bg-gray-200 dark:bg-gray-600 self-stretch mx-1" />

        {['all','high','medium','low'].map(pri => (
          <button key={pri} onClick={() => handle('priority', pri)}
            className={btnCls(filters.priority === pri)}>
            {pri === 'all' ? 'Any Priority' : pri === 'high' ? '🔴 High' : pri === 'medium' ? '🟡 Medium' : '🟢 Low'}
          </button>
        ))}

        <div className="w-px bg-gray-200 dark:bg-gray-600 self-stretch mx-1" />

        <button onClick={() => handle('completed', undefined)} className={btnCls(filters.completed === undefined)}>All Status</button>
        <button onClick={() => handle('completed', false)} className={btnCls(filters.completed === false)}>⏳ Pending</button>
        <button onClick={() => handle('completed', true)} className={btnCls(filters.completed === true)}>✅ Done</button>
      </div>
    </div>
  )
}
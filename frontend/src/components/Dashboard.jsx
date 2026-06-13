import { motion } from 'framer-motion'
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react'

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-2xl p-4 ${color} flex items-center gap-3`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-75 font-medium">{label}</p>
      </div>
    </div>
  )
}

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400 capitalize font-medium">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{value} tasks</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export default function Dashboard({ stats }) {
  if (!stats) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-5">
      <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <TrendingUp size={18} className="text-violet-500" /> Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<ListTodo size={20} />} label="Total Tasks" value={stats.total}
          color="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={stats.completed}
          color="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" />
        <StatCard icon={<Clock size={20} />} label="Pending" value={stats.pending}
          color="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" />
        <StatCard icon="🎯" label="Completion" value={`${stats.completion_rate}%`}
          color="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-violet-600 dark:text-violet-400 font-bold">{stats.completion_rate}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completion_rate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">By Category</p>
        <ProgressBar label="💼 Work" value={stats.by_category.work} max={stats.total} color="bg-blue-400" />
        <ProgressBar label="👤 Personal" value={stats.by_category.personal} max={stats.total} color="bg-purple-400" />
        <ProgressBar label="📚 Study" value={stats.by_category.study} max={stats.total} color="bg-teal-400" />
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">By Priority</p>
        <ProgressBar label="🔴 High" value={stats.by_priority.high} max={stats.total} color="bg-red-400" />
        <ProgressBar label="🟡 Medium" value={stats.by_priority.medium} max={stats.total} color="bg-amber-400" />
        <ProgressBar label="🟢 Low" value={stats.by_priority.low} max={stats.total} color="bg-emerald-400" />
      </div>
    </div>
  )
}
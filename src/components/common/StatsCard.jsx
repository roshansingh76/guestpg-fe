export default function StatsCard({ icon: Icon, label, value, change, color = 'blue' }) {
    const colors = {
        blue: 'from-blue-600 to-indigo-600',
        green: 'from-emerald-600 to-teal-600',
        red: 'from-rose-600 to-red-600',
        purple: 'from-violet-600 to-fuchsia-600',
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 hover:shadow-[0_14px_44px_rgba(15,23,42,0.12)] transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">{label}</p>
                    <h3 className="text-3xl font-semibold text-slate-900 mt-2 leading-8">{value}</h3>
                    {change && (
                        <p className={`text-sm mt-2 ${change.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {change.positive ? '+' : ''}{change.value}% from last month
                        </p>
                    )}
                </div>
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} text-white flex items-center justify-center shadow-sm`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    )
}

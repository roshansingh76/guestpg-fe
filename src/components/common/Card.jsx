export default function Card({ children, className = '' }) {
    return (
        <div
            className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 hover:shadow-[0_14px_44px_rgba(15,23,42,0.12)] transition-shadow ${className}`}
        >
            {children}
        </div>
    )
}

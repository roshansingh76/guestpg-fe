import clsx from 'clsx'
import { Link } from 'react-router-dom'

const variants = {
  primary: 'rounded-2xl bg-blue-600 text-white border border-transparent hover:bg-blue-700',
  secondary: 'rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  outline: 'rounded-2xl border border-blue-100 bg-white text-blue-700 hover:bg-blue-50',
  danger: 'rounded-2xl border border-red-100 bg-red-50 text-red-700 hover:bg-red-100',
  ghost: 'rounded-2xl bg-transparent text-gray-700 hover:bg-slate-100',
  pill: 'rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100',
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  icon: Icon,
  iconPosition = 'start',
  variant = 'secondary',
  size = 'md',
  className,
  to,
  type,
  ...props
}) {
  const content = (
    <>
      {Icon && iconPosition === 'start' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'end' && <Icon size={16} />}
    </>
  )

  const classes = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500',
    variants[variant],
    sizes[size],
    className
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type || 'button'}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
}

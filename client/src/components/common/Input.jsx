import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-shadow ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
            : 'border-gray-300 focus:ring-primary focus:border-primary bg-white'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableMultiSelect({
    options,
    value = [],
    onChange,
    placeholder = 'Search and select...',
    emptyLabel = 'No options found',
    error,
}) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const containerRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOptions = useMemo(
        () => options.filter((o) => value.includes(o.value)),
        [options, value]
    )

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter((o) => o.label.toLowerCase().includes(q))
    }, [options, query])

    const toggleOption = (optionValue) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue))
        } else {
            onChange([...value, optionValue])
        }
    }

    const removeOption = (optionValue, e) => {
        e.stopPropagation()
        onChange(value.filter((v) => v !== optionValue))
    }

    return (
        <div ref={containerRef} className="relative">
            <div
                onClick={() => {
                    setOpen(true)
                    inputRef.current?.focus()
                }}
                className={`min-h-[3rem] w-full cursor-text rounded-2xl border bg-white px-3 py-2 flex flex-wrap items-center gap-2 transition ${error ? 'border-red-300' : 'border-gray-200'
                    } ${open ? 'ring-2 ring-blue-500' : ''}`}
            >
                {selectedOptions.map((option) => (
                    <span
                        key={option.value}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 text-sm px-3 py-1"
                    >
                        {option.label}
                        <button
                            type="button"
                            onClick={(e) => removeOption(option.value, e)}
                            className="text-blue-500 hover:text-blue-800"
                            aria-label={`Remove ${option.label}`}
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <div className="flex-1 flex items-center gap-2 min-w-[8rem]">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setOpen(true)
                        }}
                        onFocus={() => setOpen(true)}
                        placeholder={selectedOptions.length === 0 ? placeholder : 'Search more...'}
                        className="flex-1 min-w-0 border-none outline-none text-sm py-1 bg-transparent"
                    />
                </div>
                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                    {filteredOptions.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-400">{emptyLabel}</p>
                    ) : (
                        filteredOptions.map((option) => {
                            const checked = value.includes(option.value)
                            return (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleOption(option.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {option.label}
                                </label>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}

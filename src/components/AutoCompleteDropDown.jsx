  import { useEffect, useRef, useState } from "react"

  export function AutoCompleteDropDown({ value, onChange, options, placeholder, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = [...new Set(options)].filter((option) =>
      String(option).toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
      function handleClickOutside(ev) {
        if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div className='dropdown-container' ref={dropdownRef}>
        <div className='input-container'>
          <input
            value={value}
            onChange={(ev) => {
              setSearchTerm(ev.target.value)
              onChange(ev.target.value)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder=' '
          />
          <label>{label}</label>
        </div>

        {isOpen && (
          <ul className='options-list'>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
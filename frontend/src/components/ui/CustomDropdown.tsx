import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  id?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  error,
  label,
  id,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected option label
  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label
          className="font-semibold text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
      )}

      <div className="custom-dropdown" id={id}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        >
          <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transition: 'transform 0.25s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="custom-dropdown-menu">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`custom-dropdown-item ${opt.value === value ? 'selected' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {opt.icon && opt.icon}
                    <span>{opt.label}</span>
                  </div>
                  {opt.value === value && (
                    <Check size={14} style={{ color: 'var(--accent-primary-light)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--accent-rose)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

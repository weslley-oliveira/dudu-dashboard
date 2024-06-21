// app/ui/motos/form/TextInput.tsx
import React from 'react';

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  type = 'text',
  error,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          onChange={onChange}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby={`${id}-error`}
        />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextInput;

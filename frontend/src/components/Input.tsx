import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={`
                        block w-full rounded-lg border
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
                        ${leftIcon ? 'pl-10' : 'pl-3'}
                        ${rightIcon ? 'pr-10' : 'pr-3'}
                        py-2 text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-offset-0
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {!error && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
}

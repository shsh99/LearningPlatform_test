import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, variant = 'default', padding = 'md', className = '', ...props }: CardProps) {
    const variantStyles = {
        default: 'bg-white border border-gray-200',
        bordered: 'bg-white border-2 border-gray-300',
        elevated: 'bg-white shadow-lg',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}

export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
    return (
        <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
            {children}
        </h3>
    );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
}

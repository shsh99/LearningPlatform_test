import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    description?: string;
    showBackButton?: boolean;
    backTo?: string;
}

export function PageHeader({ title, description, showBackButton = true, backTo }: PageHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="뒤로가기"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1>Learning Platform</h1>
                <p>로그인이 필요합니다.</p>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    로그인
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    회원가입
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Learning Platform</h1>
            <p>환영합니다, {user?.name}님!</p>
            <p>이메일: {user?.email}</p>
            <button
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                로그아웃
            </button>
        </div>
    );
}

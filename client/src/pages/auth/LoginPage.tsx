import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowLeft } from 'lucide-react';

const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" aria-hidden="true">
		<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
		<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
		<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
		<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
	</svg>
);
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login, loginWithGoogle, currentUser, backendError } = useAuth();
	const { success, error } = useNotification();

	// Redirect if already logged in
	React.useEffect(() => {
		console.log('[LoginPage] Check currentUser:', currentUser ? currentUser.uid : 'null');
		if (currentUser) {
			console.log('[LoginPage] Already logged in, redirecting to /workflows');
			navigate('/workflows');
		}
	}, [currentUser, navigate]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await login(email, password);
			success('Đăng nhập thành công');
			navigate('/workflows');
		} catch (err: any) {
			console.error(err);
			if (err.code === 'auth/invalid-credential') {
				error('Email hoặc mật khẩu không chính xác');
			} else {
				error('Đăng nhập thất bại: ' + err.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
			success('Đăng nhập Google thành công');
			navigate('/workflows');
		} catch (err: any) {
			console.error(err);
			error('Đăng nhập Google thất bại: ' + err.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="p-8">
					<button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm">
						<ArrowLeft className="w-4 h-4" /> Trang chủ
					</button>

					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h2>
						<p className="text-gray-500 mt-2">Đăng nhập để vào bảng điều khiển</p>
					</div>

					{backendError && (
						<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
							Hệ thống đang xử lý: {backendError}. Đang thử lại...
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-1">
							<label className="text-sm font-medium text-gray-700">Email</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="email"
									required
									className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
									placeholder="name@company.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex justify-between">
								<label className="text-sm font-medium text-gray-700">Mật khẩu</label>
								<Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
									Quên mật khẩu?
								</Link>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="password"
									required
									className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
						</button>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
							</div>
						</div>

						<div className="mt-6">
							<button
								onClick={handleGoogleLogin}
								className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all gap-2"
							>
								<GoogleLogo className="w-5 h-5" />
								Google
							</button>
						</div>
					</div>

					<div className="mt-8 text-center text-sm">
						<span className="text-gray-500">Chưa có tài khoản? </span>
						<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
							Đăng ký ngay
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

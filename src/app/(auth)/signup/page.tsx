'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, App as AntApp } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ThemeLangControl } from '@/components/ui/ThemeLangControl';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';

const SignUpPage = () => {
	const { message } = AntApp.useApp();
	const router = useRouter();
	const { signup, isLoading } = useAuth();
	const { t } = useLang();

	const handleSubmit = async (values: {
		name: string;
		email: string;
		password: string;
		confirmPassword: string;
	}) => {
		try {
			await signup(values.name, values.email, values.password);
			message.success(t('Account created successfully!'));
			router.push('/dashboard');
		} catch (error) {
			message.error(t('Failed to create account'));
			console.error(error);
		}
	};

	return (
		<Card
			style={{
				width: '100%',
				maxWidth: 400,
				boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
			}}
		>
			<div style={{ textAlign: 'center', marginBottom: 32 }}>
				<Logo />
				<p style={{ color: '#64748b', marginTop: 8 }}>{t('Create a new account')}</p>
			</div>

			<Form name="signup" onFinish={handleSubmit} layout="vertical" size="large">
				<Form.Item
					label={t('User name')}
					name="name"
					rules={[
						{ required: true, message: t('Please enter your name') },
						{ min: 2, message: t('Name must be at least 2 characters') },
					]}
				>
					<Input prefix={<UserOutlined />} placeholder={t('Enter your name')} />
				</Form.Item>

				<Form.Item
					label={t('Email')}
					name="email"
					rules={[
						{ required: true, message: t('Please enter your email') },
						{ type: 'email', message: t('Please enter a valid email') },
					]}
				>
					<Input prefix={<MailOutlined />} placeholder={t('Enter your email')} />
				</Form.Item>

				<Form.Item
					label={t('Password')}
					name="password"
					rules={[
						{ required: true, message: t('Please enter your password') },
						{ min: 6, message: t('Password must be at least 6 characters') },
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder={t('Enter your password')} />
				</Form.Item>

				<Form.Item
					label={t('Confirm password')}
					name="confirmPassword"
					dependencies={['password']}
					rules={[
						{ required: true, message: t('Please confirm your password') },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error(t('Passwords do not match')));
							},
						}),
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder={t('Confirm your password')} />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading}
						style={{ width: '100%', height: 48 }}
					>
						{t('Sign up')}
					</Button>
				</Form.Item>
			</Form>

			<div style={{ textAlign: 'center' }}>
				<span style={{ color: '#64748b' }}>{t('Have an account?')} </span>
				<Link href="/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
					{t('Login here')}
				</Link>
			</div>
			<div style={{ marginTop: 16 }}>
				<ThemeLangControl />
			</div>
		</Card>
	);
};

export default SignUpPage;

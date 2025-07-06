import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ChillTeacher',
	description:
		'ChillTeacher is a web application that allows you to manage your schools, students, teachers, and classes. It is designed to be user-friendly and easy to use.',
};

import { AppProvider } from '@/contexts/AppContext';
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}

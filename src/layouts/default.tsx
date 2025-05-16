import { Navbar } from '@/components/navbar';

export default function DefaultLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col h-[100vh]">
			<Navbar />
			{children}
			{/* <main className="container mx-auto max-w-7xl">{children}</main> */}
		</div>
	);
}

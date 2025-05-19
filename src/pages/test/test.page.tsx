import DefaultLayout from '@/layouts/default';
import { Spinner } from '@heroui/react';

const TestPage = () => {
	return (
		<DefaultLayout>
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="bg-content1 p-4 rounded-lg border border-default-200/50 shadow-sm dark:border-neutral-800">
					<Spinner />
				</div>
			</div>
		</DefaultLayout>
	);
};

export default TestPage;

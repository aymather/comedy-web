import { hostApiSlice } from '@/flux/api/host';
import DefaultLayout from '@/layouts/default';
import { Link, User } from '@heroui/react';

const DashboardPage = () => {
	const { data } = hostApiSlice.useFindAllHostsQuery();

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="w-full max-w-2xl mx-auto mt-8 grid gap-4">
					<Link
						href="/revise-events"
						className="block rounded-xl shadow-md bg-white dark:bg-neutral-900 hover:bg-violet-50 dark:hover:bg-neutral-800 transition p-4 flex items-center gap-4 border border-gray-200 dark:border-neutral-800"
					>
						<p>Revise Events</p>
					</Link>
				</div>
				{data && (
					<div className="w-full max-w-2xl mx-auto mt-8 grid gap-4">
						{data.map((host) => (
							<Link
								key={host.host_uid}
								href={`/host/${host.host_uid}`}
								className="block rounded-xl shadow-md bg-white dark:bg-neutral-900 hover:bg-violet-50 dark:hover:bg-neutral-800 transition p-4 flex items-center gap-4 border border-gray-200 dark:border-neutral-800"
							>
								<User
									avatarProps={{
										src:
											host.profile_image_url ?? undefined,
										className: 'w-16 h-16'
									}}
									name={host.name}
									description={host.type}
									className="text-default-900 dark:text-white gap-4"
								/>
							</Link>
						))}
					</div>
				)}
			</section>
		</DefaultLayout>
	);
};

export default DashboardPage;

import HostBreadcrumbs from '@/components/HostBreadcrumbs';
import { roomApiSlice } from '@/flux/api/room';
import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import { addToast, Avatar, Button, Input } from '@heroui/react';
import { DeleteDocumentBulkIcon } from '@heroui/shared-icons';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const iconClasses =
	'text-2xl text-default-500 pointer-events-none flex-shrink-0';

const RoomPage = () => {
	const { room_uid, venue_uid, host_uid } = useParams<{
		host_uid: NanoId;
		venue_uid: NanoId;
		room_uid: NanoId;
	}>();

	const [form, setForm] = useState({
		name: '',
		profile_image_url: ''
	});
	const [formError, setFormError] = useState('');
	const [formTouched, setFormTouched] = useState(false);
	const [updateRoomMutation] = roomApiSlice.useUpdateRoomMutation();
	const { data, isLoading, isError } = roomApiSlice.useFindOneRoomQuery(
		{
			params: {
				room_uid: room_uid ?? '',
				venue_uid: venue_uid ?? '',
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !room_uid || !venue_uid || !host_uid
		}
	);

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name ?? '',
				profile_image_url: data.profile_image_url ?? ''
			});
			setFormTouched(false);
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error Page</div>;
	}

	if (!data) {
		return <div>Room not found</div>;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setForm((prev) => ({ ...prev, [name]: value }));
		setFormTouched(true);
	};

	const handleSave = async () => {
		if (!form.name.trim()) {
			setFormError('Name cannot be empty');

			return;
		}

		try {
			if (!host_uid || !venue_uid || !room_uid) {
				throw new Error('Host or venue or room not found');
			}
			await updateRoomMutation({
				params: { host_uid, venue_uid, room_uid },
				body: form
			}).unwrap();

			addToast({
				title: 'Success',
				description: 'Room updated successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to update room',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	return (
		<DefaultLayout>
			<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
				<HostBreadcrumbs
					host_uid={host_uid}
					venue_uid={venue_uid}
					room_uid={room_uid}
				/>
				<section className="flex flex-row items-center justify-between gap-4 py-8 md:py-10 w-full">
					<div className="flex flex-row items-center gap-6">
						<Avatar
							src={data.profile_image_url ?? undefined}
							className="w-24 h-24"
						/>
						<div className="flex flex-col items-start gap-2">
							<h1 className="text-4xl font-bold">{data.name}</h1>
						</div>
					</div>
					<div className="flex flex-row items-center gap-2">
						<Button
							color="danger"
							variant="flat"
							startContent={
								<DeleteDocumentBulkIcon
									className={clsx(
										iconClasses,
										'!text-danger'
									)}
								/>
							}
						>
							Delete Room
						</Button>
					</div>
				</section>
				<div className="flex flex-col items-center mt-8 gap-4">
					{/* Room Info Card */}
					<div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
						{/* Unsaved changes indicator */}
						{formTouched &&
							JSON.stringify(form) !==
								JSON.stringify({
									name: data.name ?? '',
									profile_image_url:
										data.profile_image_url ?? ''
								}) && (
								<div className="mb-2 text-warning-600 dark:text-yellow-400 font-medium text-sm">
									You have unsaved changes
								</div>
							)}
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								await handleSave();
							}}
							className="space-y-3"
						>
							<Input
								name="name"
								label="Name"
								placeholder="Enter name"
								value={form.name}
								onChange={handleInputChange}
								isRequired
								isInvalid={!!formError}
							/>
							<Input
								name="profile_image_url"
								label="Profile Image URL"
								placeholder="Enter image URL"
								value={form.profile_image_url}
								onChange={handleInputChange}
								type="url"
							/>
							{formError && (
								<div className="text-danger text-sm mt-1">
									{formError}
								</div>
							)}
							<div className="flex gap-2 justify-end mt-4">
								<Button
									type="button"
									color="default"
									variant="light"
									onPress={() => {
										setForm({
											name: data.name ?? '',
											profile_image_url:
												data.profile_image_url ?? ''
										});
										setFormError('');
									}}
								>
									Reset
								</Button>
								<Button type="submit" color="primary">
									Save
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default RoomPage;

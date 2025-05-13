import CheckShouldDelete from '@/components/CheckShouldDelete';
import HostBreadcrumbs from '@/components/HostBreadcrumbs';
import SearchAndSelectPlaceId from '@/components/SearchAndSelectPlaceId';
import { roomApiSlice } from '@/flux/api/room';
import { venueApiSlice } from '@/flux/api/venue';
import { venueImageApiSlice } from '@/flux/api/venue-image';
import { VenueImageTag } from '@/flux/api/venue-image/types';
import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import {
	addToast,
	Avatar,
	Button,
	Image,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
	User
} from '@heroui/react';
import { AddNoteBulkIcon } from '@heroui/shared-icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const iconClasses =
	'text-2xl text-default-500 pointer-events-none flex-shrink-0';

const VenuePage = () => {
	const { venue_uid, host_uid } = useParams<{
		host_uid: NanoId;
		venue_uid: NanoId;
	}>();
	const navigate = useNavigate();

	const {
		isOpen: isRoomModalOpen,
		onOpen: openRoomModal,
		onOpenChange: onRoomModalChange
	} = useDisclosure();

	const {
		isOpen: isVenueImageModalOpen,
		onOpen: openVenueImageModal,
		onOpenChange: onVenueImageModalChange
	} = useDisclosure();

	const {
		isOpen: isEditVenueImageModalOpen,
		onOpen: openEditVenueImageModal,
		onOpenChange: onEditVenueImageModalChange
	} = useDisclosure();

	const [form, setForm] = useState({
		name: '',
		profile_image_url: ''
	});
	const [formError, setFormError] = useState('');
	const [roomName, setRoomName] = useState('');
	const [roomError, setRoomError] = useState('');
	const [formTouched, setFormTouched] = useState(false);

	const [venueImageForm, setVenueImageForm] = useState({
		url: '',
		tag: VenueImageTag.OTHER
	});
	const [venueImageError, setVenueImageError] = useState('');

	const [editingVenueImage, setEditingVenueImage] = useState<{
		venue_image_uid: NanoId;
		url: string;
		tag: VenueImageTag;
	} | null>(null);

	const [createRoomMutation] = roomApiSlice.useCreateRoomMutation();
	const [updateVenueMutation] = venueApiSlice.useUpdateVenueMutation();
	const [deleteVenueMutation] = venueApiSlice.useDeleteVenueMutation();
	const [createVenueImageMutation] =
		venueImageApiSlice.useCreateVenueImageMutation();
	const [updateVenueImageMutation] =
		venueImageApiSlice.useUpdateVenueImageMutation();
	const [deleteVenueImageMutation] =
		venueImageApiSlice.useDeleteVenueImageMutation();
	const { data, isLoading, isError } = venueApiSlice.useFindOneVenueQuery(
		{
			params: {
				venue_uid: venue_uid ?? '',
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !venue_uid
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
		return <div>Venue not found</div>;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setForm((prev) => ({ ...prev, [name]: value }));
		setFormTouched(true);
	};

	const handleSave = async () => {
		if (!venue_uid) return;
		if (!form.name.trim()) {
			setFormError('Name cannot be empty');

			return;
		}

		try {
			if (!host_uid || !venue_uid) {
				throw new Error('Host or venue not found');
			}
			await updateVenueMutation({
				params: { host_uid, venue_uid },
				body: form
			}).unwrap();

			addToast({
				title: 'Success',
				description: 'Venue updated successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to update venue',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleCreateRoom = async () => {
		if (!venue_uid) return;
		if (!roomName.trim()) {
			setRoomError('Room name cannot be empty');

			return;
		}

		try {
			if (!host_uid || !venue_uid) {
				throw new Error('Host or venue not found');
			}
			await createRoomMutation({
				params: { host_uid, venue_uid },
				body: { name: roomName.trim() }
			}).unwrap();
			setRoomName('');
			setRoomError('');
			onRoomModalChange();
			addToast({
				title: 'Success',
				description: 'Room created successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to create room',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleDeleteVenue = async () => {
		if (!host_uid || !venue_uid) return;

		try {
			await deleteVenueMutation({
				params: { host_uid, venue_uid }
			}).unwrap();

			addToast({
				title: 'Success',
				description: 'Venue deleted successfully',
				variant: 'solid',
				color: 'success'
			});

			// Navigate back to the host page
			navigate(`/host/${host_uid}`);
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to delete venue',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleCreateVenueImage = async () => {
		if (!venue_uid || !host_uid) return;
		if (!venueImageForm.url.trim()) {
			setVenueImageError('URL cannot be empty');
			return;
		}

		try {
			await createVenueImageMutation({
				params: { host_uid, venue_uid },
				body: venueImageForm
			}).unwrap();

			setVenueImageForm({
				url: '',
				tag: VenueImageTag.OTHER
			});
			setVenueImageError('');
			onVenueImageModalChange();
			addToast({
				title: 'Success',
				description: 'Venue image added successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to add venue image',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleEditVenueImage = async () => {
		if (!venue_uid || !host_uid || !editingVenueImage) return;
		if (!venueImageForm.url.trim()) {
			setVenueImageError('URL cannot be empty');
			return;
		}

		try {
			await updateVenueImageMutation({
				params: {
					host_uid,
					venue_uid,
					venue_image_uid: editingVenueImage.venue_image_uid
				},
				body: venueImageForm
			}).unwrap();

			setVenueImageForm({
				url: '',
				tag: VenueImageTag.OTHER
			});
			setVenueImageError('');
			setEditingVenueImage(null);
			onEditVenueImageModalChange();
			addToast({
				title: 'Success',
				description: 'Venue image updated successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to update venue image',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleDeleteVenueImage = async () => {
		if (!venue_uid || !host_uid || !editingVenueImage) return;

		try {
			await deleteVenueImageMutation({
				params: {
					host_uid,
					venue_uid,
					venue_image_uid: editingVenueImage.venue_image_uid
				}
			}).unwrap();

			setEditingVenueImage(null);
			setVenueImageForm({
				url: '',
				tag: VenueImageTag.OTHER
			});
			onEditVenueImageModalChange();
			addToast({
				title: 'Success',
				description: 'Venue image deleted successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to delete venue image',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleImageClick = (image: {
		venue_image_uid: NanoId;
		url: string;
		tag: VenueImageTag;
	}) => {
		setEditingVenueImage(image);
		setVenueImageForm({
			url: image.url,
			tag: image.tag
		});
		openEditVenueImageModal();
	};

	return (
		<DefaultLayout>
			<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
				<HostBreadcrumbs host_uid={host_uid} venue_uid={venue_uid} />
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
							color="default"
							variant="flat"
							onPress={openRoomModal}
							startContent={
								<AddNoteBulkIcon className={iconClasses} />
							}
						>
							Create Room
						</Button>
						<CheckShouldDelete onConfirm={handleDeleteVenue}>
							Delete Venue
						</CheckShouldDelete>
					</div>
				</section>
				<div className="flex flex-col items-center mt-8 gap-4">
					{/* Place ID Section */}
					<div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-900 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
						<div>
							<div className="text-sm text-default-500">
								Current Place ID:
							</div>
							<div className="font-mono text-default-900 dark:text-white break-all">
								{data.place_id ? (
									data.place_id
								) : (
									<span className="italic text-default-400">
										None selected
									</span>
								)}
							</div>
						</div>
						<SearchAndSelectPlaceId
							buttonText="Select Place ID"
							onSelect={async (place) => {
								if (!host_uid || !venue_uid) return;
								try {
									await updateVenueMutation({
										params: { host_uid, venue_uid },
										body: {
											place_id: place.place_id
										}
									}).unwrap();
									addToast({
										title: 'Success',
										description:
											'Place ID updated successfully',
										variant: 'solid',
										color: 'success'
									});
								} catch (error) {
									addToast({
										title: 'Failed to update Place ID',
										description: 'Please try again',
										variant: 'solid',
										color: 'danger'
									});
								}
							}}
						/>
					</div>
					{/* Rooms List */}
					<div className="w-full max-w-2xl mx-auto grid gap-4">
						{data.rooms && data.rooms.length > 0 ? (
							data.rooms.map((room) => (
								<Link
									key={room.room_uid}
									href={`/host/${host_uid}/venue/${venue_uid}/room/${room.room_uid}`}
									className="block rounded-xl shadow-md bg-white dark:bg-neutral-900 hover:bg-violet-50 dark:hover:bg-neutral-800 transition p-4 flex items-center gap-4 border border-gray-200 dark:border-neutral-800"
								>
									<User
										avatarProps={{
											src:
												room.profile_image_url ??
												undefined
										}}
										name={room.name}
										className="text-default-900 dark:text-white gap-4"
									/>
								</Link>
							))
						) : (
							<div className="text-default-400 dark:text-neutral-400 italic text-center">
								No rooms for this venue.
							</div>
						)}
					</div>
					{/* Venue Images Section */}
					<div className="w-full max-w-2xl mx-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">
								Venue Images
							</h2>
							<Button
								color="primary"
								variant="flat"
								onPress={openVenueImageModal}
								startContent={
									<AddNoteBulkIcon className={iconClasses} />
								}
							>
								Add Image
							</Button>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{data.images && data.images.length > 0 ? (
								data.images.map((image) => (
									<button
										key={image.venue_image_uid}
										className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800 cursor-pointer hover:opacity-90 transition-opacity"
										onClick={() => handleImageClick(image)}
										aria-label={`Edit ${image.tag} image`}
									>
										<Image
											src={image.url}
											alt={`Venue image - ${image.tag}`}
											className="object-cover w-full h-full"
										/>
										<div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
											{image.tag}
										</div>
									</button>
								))
							) : (
								<div className="col-span-full text-default-400 dark:text-neutral-400 italic text-center">
									No images for this venue.
								</div>
							)}
						</div>
					</div>
					{/* Venue Info Card */}
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
			<Modal
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				isOpen={isRoomModalOpen}
				onOpenChange={onRoomModalChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Create New Room
							</ModalHeader>
							<ModalBody>
								<Input
									label="Room Name"
									placeholder="Enter room name"
									value={roomName}
									onChange={(e) => {
										setRoomName(e.target.value);
										setRoomError('');
									}}
									isRequired
									isInvalid={!!roomError}
									errorMessage={roomError}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									onPress={handleCreateRoom}
								>
									Create
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			{/* Venue Image Modal */}
			<Modal
				isOpen={isVenueImageModalOpen}
				onOpenChange={onVenueImageModalChange}
				placement="top-center"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add Venue Image
							</ModalHeader>
							<ModalBody>
								<Input
									label="Image URL"
									placeholder="Enter image URL"
									value={venueImageForm.url}
									onChange={(e) => {
										setVenueImageForm((prev) => ({
											...prev,
											url: e.target.value
										}));
										setVenueImageError('');
									}}
									isRequired
									isInvalid={!!venueImageError}
									errorMessage={venueImageError}
								/>
								<Select
									label="Image Type"
									selectedKeys={[venueImageForm.tag]}
									onChange={(e) => {
										setVenueImageForm((prev) => ({
											...prev,
											tag: e.target.value as VenueImageTag
										}));
									}}
								>
									{Object.values(VenueImageTag).map((tag) => (
										<SelectItem key={tag}>
											{tag.charAt(0).toUpperCase() +
												tag.slice(1)}
										</SelectItem>
									))}
								</Select>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="flat"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									onPress={handleCreateVenueImage}
								>
									Add Image
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			{/* Edit Venue Image Modal */}
			<Modal
				isOpen={isEditVenueImageModalOpen}
				onOpenChange={onEditVenueImageModalChange}
				placement="top-center"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Edit Venue Image
							</ModalHeader>
							<ModalBody>
								<Input
									label="Image URL"
									placeholder="Enter image URL"
									value={venueImageForm.url}
									onChange={(e) => {
										setVenueImageForm((prev) => ({
											...prev,
											url: e.target.value
										}));
										setVenueImageError('');
									}}
									isRequired
									isInvalid={!!venueImageError}
									errorMessage={venueImageError}
								/>
								<Select
									label="Image Type"
									selectedKeys={[venueImageForm.tag]}
									onChange={(e) => {
										setVenueImageForm((prev) => ({
											...prev,
											tag: e.target.value as VenueImageTag
										}));
									}}
								>
									{Object.values(VenueImageTag).map((tag) => (
										<SelectItem key={tag}>
											{tag.charAt(0).toUpperCase() +
												tag.slice(1)}
										</SelectItem>
									))}
								</Select>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="flat"
									onPress={handleDeleteVenueImage}
								>
									Delete
								</Button>
								<div className="flex-1" />
								<Button
									color="default"
									variant="flat"
									onPress={() => {
										setEditingVenueImage(null);
										setVenueImageForm({
											url: '',
											tag: VenueImageTag.OTHER
										});
										onClose();
									}}
								>
									Cancel
								</Button>
								<Button
									color="primary"
									onPress={handleEditVenueImage}
								>
									Save Changes
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</DefaultLayout>
	);
};

export default VenuePage;

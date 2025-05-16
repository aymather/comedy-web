import HostBreadcrumbs from '@/components/HostBreadcrumbs';
import { EventIcon, HostIcon, VenueIcon } from '@/components/icons';
import { eventApiSlice } from '@/flux/api/event';
import { hostApiSlice } from '@/flux/api/host';
import { venueApiSlice } from '@/flux/api/venue';
import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import {
	addToast,
	Avatar,
	Button,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Tabs,
	Textarea,
	useDisclosure,
	User
} from '@heroui/react';
import { AddNoteBulkIcon, DeleteDocumentBulkIcon } from '@heroui/shared-icons';
import clsx from 'clsx';
import { Copy, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const iconClasses =
	'text-2xl text-default-500 pointer-events-none flex-shrink-0';

const HostPage = () => {
	const { host_uid } = useParams<{ host_uid: NanoId }>();
	const { onOpenChange } = useDisclosure();
	const {
		isOpen: isVenueModalOpen,
		onOpen: openVenueModal,
		onOpenChange: onVenueModalChange
	} = useDisclosure();
	const [form, setForm] = useState({
		name: '',
		profile_image_url: '',
		description: '',
		website_url: '',
		instagram_url: '',
		tiktok_url: '',
		facebook_url: '',
		x_url: '',
		youtube_url: '',
		stage_image_url: ''
	});
	const [formError, setFormError] = useState('');
	const [venueName, setVenueName] = useState('');
	const [venueError, setVenueError] = useState('');
	const [formTouched, setFormTouched] = useState(false);

	const [createVenueMutation] = venueApiSlice.useCreateVenueMutation();
	const [updateHostMutation] = hostApiSlice.useUpdateHostMutation();
	const { data, isLoading, isError } = hostApiSlice.useFindOneHostQuery(
		{
			params: {
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !host_uid
		}
	);

	const { data: eventsData } = eventApiSlice.useFindAllEventsQuery(
		{
			params: {
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !host_uid
		}
	);

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name ?? '',
				profile_image_url: data.profile_image_url ?? '',
				description: data.description ?? '',
				website_url: data.website_url ?? '',
				instagram_url: data.instagram_url ?? '',
				tiktok_url: data.tiktok_url ?? '',
				facebook_url: data.facebook_url ?? '',
				x_url: data.x_url ?? '',
				youtube_url: data.youtube_url ?? '',
				stage_image_url: data.stage_image_url ?? ''
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
		return <div>Host not found</div>;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setForm((prev) => ({ ...prev, [name]: value }));
		setFormTouched(true);
	};

	const handleSave = async () => {
		if (!host_uid) return;
		if (!form.name.trim()) {
			setFormError('Name cannot be empty');

			return;
		}
		const body: any = { name: form.name.trim() };

		[
			'profile_image_url',
			'description',
			'website_url',
			'instagram_url',
			'tiktok_url',
			'facebook_url',
			'x_url',
			'youtube_url',
			'stage_image_url'
		].forEach((key) => {
			const val = form[key as keyof typeof form];

			body[key] = val === '' ? null : val;
		});
		try {
			await updateHostMutation({
				params: { host_uid },
				body
			}).unwrap();
			onOpenChange();

			addToast({
				title: 'Success',
				description: 'Host updated successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to update host',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleCreateVenue = async () => {
		if (!host_uid) return;
		if (!venueName.trim()) {
			setVenueError('Venue name cannot be empty');

			return;
		}

		try {
			await createVenueMutation({
				params: { host_uid },
				body: { name: venueName.trim() }
			}).unwrap();
			setVenueName('');
			setVenueError('');
			onVenueModalChange();
			addToast({
				title: 'Success',
				description: 'Venue created successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			console.error(error);
			addToast({
				title: 'Failed to create venue',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		addToast({
			title: 'Copied!',
			description: 'Link copied to clipboard',
			variant: 'solid',
			color: 'success'
		});
	};

	return (
		<DefaultLayout>
			<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
				<HostBreadcrumbs host_uid={host_uid} />
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
							onPress={openVenueModal}
							startContent={
								<AddNoteBulkIcon className={iconClasses} />
							}
						>
							Create Venue
						</Button>
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
							Delete Host
						</Button>
					</div>
				</section>
				<div className="flex flex-col items-center mt-8 gap-4">
					<div className="flex flex-col items-center w-full">
						<Tabs
							aria-label="Host Options"
							variant="bordered"
							className="w-full justify-center max-w-2xl"
						>
							<Tab
								key="profile"
								title={
									<div className="flex items-center space-x-2">
										<HostIcon />
										<span>Host Info</span>
									</div>
								}
							>
								<div className="mt-4">
									{/* Venues List */}
									<h2 className="flex flex-row items-center text-2xl font-semibold mb-2 mt-4">
										<VenueIcon className="w-6 h-6 mr-2" />
										Venues:{' '}
										{data.venues ? data.venues.length : 0}
									</h2>
									<div className="w-full max-w-2xl mx-auto grid gap-4">
										{data.venues &&
										data.venues.length > 0 ? (
											data.venues.map((venue) => (
												<Link
													key={venue.venue_uid}
													href={`/host/${host_uid}/venue/${venue.venue_uid}`}
													className="block rounded-xl shadow-md bg-white dark:bg-neutral-900 hover:bg-violet-50 dark:hover:bg-neutral-800 transition p-4 flex items-center gap-4 border border-gray-200 dark:border-neutral-800"
												>
													<User
														avatarProps={{
															src:
																venue.profile_image_url ??
																undefined
														}}
														name={venue.name}
														description={
															venue.place_id
														}
														className="text-default-900 dark:text-white gap-4"
													/>
												</Link>
											))
										) : (
											<div className="text-default-400 dark:text-neutral-400 italic text-center">
												No venues for this host.
											</div>
										)}
									</div>
									{/* Host Info Card */}
									<h2 className="text-2xl font-semibold mb-2 mt-8">
										Basic Info
									</h2>
									<div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
										{/* Unsaved changes indicator */}
										{formTouched &&
											JSON.stringify(form) !==
												JSON.stringify({
													name: data.name ?? '',
													profile_image_url:
														data.profile_image_url ??
														'',
													description:
														data.description ?? '',
													website_url:
														data.website_url ?? '',
													instagram_url:
														data.instagram_url ??
														'',
													tiktok_url:
														data.tiktok_url ?? '',
													facebook_url:
														data.facebook_url ?? '',
													x_url: data.x_url ?? '',
													youtube_url:
														data.youtube_url ?? '',
													stage_image_url:
														data.stage_image_url ??
														''
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
											<Textarea
												name="description"
												label="Description"
												placeholder="Enter description"
												value={form.description}
												onChange={handleInputChange}
											/>
											<Input
												name="website_url"
												label="Website URL"
												placeholder="Enter website URL"
												value={form.website_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.website_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.website_url &&
																window.open(
																	form.website_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.website_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.website_url &&
																copyToClipboard(
																	form.website_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="instagram_url"
												label="Instagram URL"
												placeholder="Enter Instagram URL"
												value={form.instagram_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.instagram_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.instagram_url &&
																window.open(
																	form.instagram_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.instagram_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.instagram_url &&
																copyToClipboard(
																	form.instagram_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="tiktok_url"
												label="TikTok URL"
												placeholder="Enter TikTok URL"
												value={form.tiktok_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.tiktok_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.tiktok_url &&
																window.open(
																	form.tiktok_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.tiktok_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.tiktok_url &&
																copyToClipboard(
																	form.tiktok_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="facebook_url"
												label="Facebook URL"
												placeholder="Enter Facebook URL"
												value={form.facebook_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.facebook_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.facebook_url &&
																window.open(
																	form.facebook_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.facebook_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.facebook_url &&
																copyToClipboard(
																	form.facebook_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="x_url"
												label="X (Twitter) URL"
												placeholder="Enter X URL"
												value={form.x_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.x_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.x_url &&
																window.open(
																	form.x_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.x_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.x_url &&
																copyToClipboard(
																	form.x_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="youtube_url"
												label="YouTube URL"
												placeholder="Enter YouTube URL"
												value={form.youtube_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.youtube_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.youtube_url &&
																window.open(
																	form.youtube_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.youtube_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.youtube_url &&
																copyToClipboard(
																	form.youtube_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
											/>
											<Input
												name="stage_image_url"
												label="Stage Image URL"
												placeholder="Enter stage image URL"
												value={form.stage_image_url}
												onChange={handleInputChange}
												type="url"
												endContent={
													<div className="flex items-center gap-1">
														<Button
															type="button"
															disabled={
																!form.stage_image_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Open link in new tab"
															onPress={() =>
																form.stage_image_url &&
																window.open(
																	form.stage_image_url,
																	'_blank',
																	'noopener,noreferrer'
																)
															}
														>
															<ExternalLink
																size={18}
															/>
														</Button>
														<Button
															type="button"
															disabled={
																!form.stage_image_url
															}
															className="p-1 rounded hover:bg-default-100 disabled:opacity-50"
															aria-label="Copy link to clipboard"
															onPress={() =>
																form.stage_image_url &&
																copyToClipboard(
																	form.stage_image_url
																)
															}
														>
															<Copy size={18} />
														</Button>
													</div>
												}
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
															name:
																data.name ?? '',
															profile_image_url:
																data.profile_image_url ??
																'',
															description:
																data.description ??
																'',
															website_url:
																data.website_url ??
																'',
															instagram_url:
																data.instagram_url ??
																'',
															tiktok_url:
																data.tiktok_url ??
																'',
															facebook_url:
																data.facebook_url ??
																'',
															x_url:
																data.x_url ??
																'',
															youtube_url:
																data.youtube_url ??
																'',
															stage_image_url:
																data.stage_image_url ??
																''
														});
														setFormError('');
													}}
												>
													Reset
												</Button>
												<Button
													type="submit"
													color="primary"
												>
													Save
												</Button>
											</div>
										</form>
									</div>
								</div>
							</Tab>
							<Tab
								key="events"
								title={
									<div className="flex items-center space-x-2">
										<EventIcon />
										<span>Events</span>
									</div>
								}
							>
								<div className="mt-4">
									<h2 className="text-2xl font-semibold mb-4">
										Events
									</h2>
									{eventsData && eventsData.length > 0 ? (
										<div className="grid gap-4">
											{eventsData.map((event) => (
												<div
													key={event.event_uid}
													className="flex items-center gap-4 p-4 rounded-lg shadow bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
												>
													{event.image_url && (
														<img
															src={
																event.image_url
															}
															alt={event.name}
															className="w-16 h-16 object-cover rounded"
														/>
													)}
													<div>
														<div className="font-semibold text-lg">
															{event.name}
														</div>
														{event.start_time && (
															<div className="text-sm text-default-500 dark:text-neutral-400">
																{new Date(
																	event.start_time
																).toLocaleString()}
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-default-400 dark:text-neutral-400 italic text-center">
											No events for this host.
										</div>
									)}
								</div>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
			<Modal
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				isOpen={isVenueModalOpen}
				onOpenChange={onVenueModalChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Create New Venue
							</ModalHeader>
							<ModalBody>
								<Input
									label="Venue Name"
									placeholder="Enter venue name"
									value={venueName}
									onChange={(e) => {
										setVenueName(e.target.value);
										setVenueError('');
									}}
									isRequired
									isInvalid={!!venueError}
									errorMessage={venueError}
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
									onPress={handleCreateVenue}
								>
									Create
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</DefaultLayout>
	);
};

export default HostPage;

import { useDispatch } from '@/flux';
import { artistApiSlice } from '@/flux/api/artist';
import { Artist } from '@/flux/api/artist/artist.entity';
import { serviceApi } from '@/flux/api/base';
import { eventApiSlice } from '@/flux/api/event';
import { revisionApiSlice } from '@/flux/api/revision';
import DefaultLayout from '@/layouts/default';
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Input,
	Kbd,
	Spinner,
	User,
	addToast,
	useDisclosure
} from '@heroui/react';
import {
	Copy,
	ExternalLink,
	Globe,
	Plus,
	Search,
	SquarePen,
	Trash2,
	X
} from 'lucide-react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useSearchParams } from 'react-router-dom';
import EditArtist from './components/EditArtist';
import SearchAndSelectArtist from './components/SearchAndSelectArtist';

const highlightClass =
	'bg-fuchsia-700 text-white rounded px-1 py-0.5 transition-colors duration-150';

const grayHighlightClass =
	'bg-neutral-700 text-white rounded px-1 py-0.5 transition-colors duration-150';

const cardHighlightClass =
	'ring-2 ring-fuchsia-700 transition-all duration-150';

function highlightArtistsInTitle(
	title: string,
	artistNames: string[],
	onHover: (name: string | null) => void,
	hoveredArtist: string | null
) {
	if (!artistNames || artistNames.length === 0) return title;

	// Create a regex pattern for all artist names
	const regex = new RegExp(
		`\\b(${artistNames
			.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('|')})\\b`,
		'gi'
	);

	// Split the title into parts based on the artist names
	const parts = title.split(regex);

	return parts.map((part, i) => {
		const matchedArtist = artistNames.find((name) =>
			new RegExp(
				`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
				'i'
			).test(part)
		);

		if (matchedArtist) {
			const isActive = hoveredArtist === matchedArtist;

			return (
				<span
					key={i}
					className={isActive ? highlightClass : grayHighlightClass}
					onMouseEnter={() => onHover(matchedArtist)}
					onMouseLeave={() => onHover(null)}
				>
					{part}
				</span>
			);
		}

		return <span key={i}>{part}</span>;
	});
}

const ReviseEventsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [manualEventUid, setManualEventUid] = useState('');
	const [dropArtistMutation] = eventApiSlice.useDropArtistMutation();
	const { data, isLoading } =
		revisionApiSlice.useFindNextEventToReviseQuery();
	const [finishRevisionMutation] =
		revisionApiSlice.useMarkEventAsRevisedMutation();
	const [addArtistMutation] = eventApiSlice.useAddArtistMutation();
	const [undoLastRevisionMutation] =
		revisionApiSlice.useUndoLastEventRevisionMutation();
	const [deleteArtistMutation] = artistApiSlice.useDeleteArtistMutation();
	const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [copySuccess, setCopySuccess] = useState(false);
	const [copyHostSuccess, setCopyHostSuccess] = useState(false);
	const [copyVenueSuccess, setCopyVenueSuccess] = useState(false);
	const [copyRoomSuccess, setCopyRoomSuccess] = useState(false);
	const [copyArtistSuccess, setCopyArtistSuccess] = useState<
		Record<string, boolean>
	>({});
	const [isFinishing, setIsFinishing] = useState(false);
	const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
	const dispatch = useDispatch();

	// Get event_uid from URL params or manual input, fallback to API query
	const eventUid =
		searchParams.get('event_uid') || manualEventUid || data?.event_uid;

	const { data: eventData } = eventApiSlice.useFindOneEventQuery(
		{
			params: {
				event_uid: eventUid ?? ''
			}
		},
		{
			skip: !eventUid
		}
	);

	const handleManualEventUidSubmit = () => {
		if (manualEventUid) {
			setSearchParams({ event_uid: manualEventUid });
		}
	};

	useHotkeys('meta+shift+enter', () => handleFinishRevision());
	useHotkeys('meta+shift+l', () => onOpen());
	useHotkeys('meta+shift+left', () => handleUndoLastRevision());

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!eventData) {
		return (
			<DefaultLayout>
				<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
					<div className="flex flex-col items-center justify-center gap-4 py-8">
						<h1 className="text-2xl font-bold mb-4">
							Revise Events
						</h1>
						<div className="w-full max-w-md">
							<div className="flex gap-2">
								<Input
									placeholder="Enter event UID"
									value={manualEventUid}
									onChange={(e) =>
										setManualEventUid(e.target.value)
									}
									startContent={<Search size={16} />}
								/>
								<Button
									color="primary"
									onPress={handleManualEventUidSubmit}
								>
									Go
								</Button>
							</div>
						</div>
						<div className="text-default-400 dark:text-neutral-400 italic text-center mt-4">
							No events to revise
						</div>
					</div>
				</div>
			</DefaultLayout>
		);
	}

	const eventTitle = eventData.name;
	const artistNames =
		eventData.artists?.map((link) => link.artist.name) || [];

	const handleArtistSelect = (artist: any) => {
		try {
			addArtistMutation({
				params: {
					host_uid: eventData.venue.host.host_uid,
					venue_uid: eventData.venue.venue_uid,
					event_uid: eventData.event_uid,
					artist_uid: artist.artist_uid
				}
			}).unwrap();

			addToast({
				title: 'Success',
				description: 'Artist has been added to the event',
				color: 'success'
			});
		} catch (error) {
			addToast({
				title: 'Error',
				description: 'Failed to add artist to the event',
				color: 'danger'
			});
		}
	};

	const handleCopyEventUid = async () => {
		try {
			await navigator.clipboard.writeText(eventData.event_uid);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleCopyHostUid = async () => {
		try {
			await navigator.clipboard.writeText(eventData.venue.host.host_uid);
			setCopyHostSuccess(true);
			setTimeout(() => setCopyHostSuccess(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleCopyVenueUid = async () => {
		try {
			await navigator.clipboard.writeText(eventData.venue.venue_uid);
			setCopyVenueSuccess(true);
			setTimeout(() => setCopyVenueSuccess(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleCopyRoomUid = async () => {
		try {
			await navigator.clipboard.writeText(eventData.room.room_uid);
			setCopyRoomSuccess(true);
			setTimeout(() => setCopyRoomSuccess(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleCopyArtistUid = async (artistUid: string) => {
		try {
			await navigator.clipboard.writeText(artistUid);
			setCopyArtistSuccess((prev) => ({ ...prev, [artistUid]: true }));
			setTimeout(() => {
				setCopyArtistSuccess((prev) => ({
					...prev,
					[artistUid]: false
				}));
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const handleDropArtist = async (artistUid: string) => {
		try {
			await dropArtistMutation({
				params: {
					host_uid: eventData.venue.host.host_uid,
					venue_uid: eventData.venue.venue_uid,
					event_uid: eventData.event_uid,
					artist_uid: artistUid
				}
			}).unwrap();

			addToast({
				title: 'Success',
				description: 'Artist has been removed from the event',
				color: 'success'
			});
		} catch (error) {
			addToast({
				title: 'Error',
				description: 'Failed to remove artist from the event',
				color: 'danger'
			});
		}
	};

	const handleFinishRevision = async () => {
		setIsFinishing(true);
		try {
			await finishRevisionMutation({
				params: {
					event_uid: data?.event_uid ?? ''
				}
			}).unwrap();

			// Clear the URL query parameter and manual input
			setSearchParams({});
			setManualEventUid('');

			addToast({
				title: 'Success',
				description: 'Event has been marked as revised',
				color: 'success'
			});
		} catch (err) {
			addToast({
				title: 'Error',
				description: 'Failed to finish revision',
				color: 'danger'
			});
		} finally {
			setIsFinishing(false);
		}
	};

	const handleDeleteArtist = async (artistUid: string) => {
		const event_uid = data?.event_uid;

		if (!event_uid) {
			addToast({
				title: 'Error',
				description: 'No event UID found',
				color: 'danger'
			});

			return;
		}

		try {
			await deleteArtistMutation({
				params: {
					artist_uid: artistUid
				}
			}).unwrap();

			// Invalidate the findNextEventToRevise query
			dispatch(
				serviceApi.util.invalidateTags([
					{ type: 'Event', id: event_uid }
				])
			);

			addToast({
				title: 'Success',
				description: 'Artist has been deleted',
				color: 'success'
			});
		} catch (error) {
			addToast({
				title: 'Error',
				description: 'Failed to delete artist',
				color: 'danger'
			});
		}
	};

	const handleUndoLastRevision = async () => {
		try {
			const response = await undoLastRevisionMutation().unwrap();

			const event_uid = response.event_uid;

			// Set the working event to the new event
			setSearchParams({ event_uid });
		} catch (error) {
			addToast({
				title: 'Error',
				description: 'Failed to undo last revision',
				color: 'danger'
			});
		}
	};

	return (
		<DefaultLayout>
			{isFinishing && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<Spinner size="lg" color="primary" />
				</div>
			)}
			<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
				<div className="flex flex-col gap-4">
					{/* Search Input */}
					<div className="w-full max-w-md">
						<div className="flex gap-2">
							<Input
								placeholder="Enter event UID"
								value={manualEventUid}
								onChange={(e) =>
									setManualEventUid(e.target.value)
								}
								startContent={<Search size={16} />}
							/>
							<Button
								color="primary"
								onPress={handleManualEventUidSubmit}
							>
								Go
							</Button>
						</div>
					</div>

					{/* Header with event count */}
					<div className="flex justify-between items-center">
						<div className="py-8">
							<h1 className="text-2xl font-bold mb-2">
								Events to Revise: {data?.numberOfEventsToRevise}
							</h1>
						</div>

						{/* Hotkey Buttons Row */}
						<div className="flex gap-4 items-center justify-end py-4">
							<Button
								color="default"
								className="flex items-center gap-2"
							>
								Undo
								<Kbd keys={['command', 'shift', 'left']} />
							</Button>
							<Button
								color="primary"
								className="flex items-center gap-2"
								onPress={handleFinishRevision}
								isDisabled={isFinishing}
							>
								Finish Revision
								<Kbd keys={['command', 'shift', 'enter']} />
							</Button>
						</div>
					</div>
				</div>

				{/* Host, Venue, and Room Information */}
				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4">
						Location Details
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Host Card */}
						<Card>
							<CardHeader className="flex gap-4">
								{eventData.venue.host.profile_image_url && (
									<Avatar
										src={
											eventData.venue.host
												.profile_image_url
										}
										alt={eventData.venue.host.name}
										className="w-16 h-16 object-cover rounded-lg"
									/>
								)}
								<div className="flex flex-col flex-1 gap-2">
									<h4 className="text-lg font-semibold">
										Host
									</h4>
									<p className="text-default-900 dark:text-white">
										{eventData.venue.host.name}
									</p>
									<div className="flex items-center gap-2">
										<Button
											isIconOnly
											variant="light"
											aria-label="Copy host UID"
											onPress={handleCopyHostUid}
											className={
												copyHostSuccess
													? 'text-success'
													: ''
											}
										>
											<Copy size={16} />
										</Button>
										<Link
											to={`/host/${eventData.venue.host.host_uid}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												isIconOnly
												variant="light"
												aria-label="Go to host page"
											>
												<ExternalLink size={16} />
											</Button>
										</Link>
									</div>
								</div>
							</CardHeader>
						</Card>

						{/* Venue Card */}
						<Card>
							<CardHeader className="flex gap-4">
								{eventData.venue.profile_image_url && (
									<img
										src={eventData.venue.profile_image_url}
										alt={eventData.venue.name}
										className="w-16 h-16 object-cover rounded-lg"
									/>
								)}
								<div className="flex flex-col flex-1 gap-2">
									<h4 className="text-lg font-semibold">
										Venue
									</h4>
									<p className="text-default-900 dark:text-white">
										{eventData.venue.name}
									</p>
									<div className="flex items-center gap-2">
										<Button
											isIconOnly
											variant="light"
											aria-label="Copy venue UID"
											onPress={handleCopyVenueUid}
											className={
												copyVenueSuccess
													? 'text-success'
													: ''
											}
										>
											<Copy size={16} />
										</Button>
										<Link
											to={`/host/${eventData.venue.host.host_uid}/venue/${eventData.venue.venue_uid}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												isIconOnly
												variant="light"
												aria-label="Go to venue page"
											>
												<ExternalLink size={16} />
											</Button>
										</Link>
									</div>
								</div>
							</CardHeader>
						</Card>

						{/* Room Card */}
						{eventData.room && (
							<Card>
								<CardHeader className="flex gap-4">
									{eventData.room.profile_image_url && (
										<img
											src={
												eventData.room.profile_image_url
											}
											alt={eventData.room.name}
											className="w-16 h-16 object-cover rounded-lg"
										/>
									)}
									<div className="flex flex-col flex-1 gap-2">
										<h4 className="text-lg font-semibold">
											Room
										</h4>
										<p className="text-default-900 dark:text-white">
											{eventData.room.name}
										</p>
										<div className="flex items-center gap-2">
											<Button
												isIconOnly
												variant="light"
												aria-label="Copy room UID"
												onPress={handleCopyRoomUid}
												className={
													copyRoomSuccess
														? 'text-success'
														: ''
												}
											>
												<Copy size={16} />
											</Button>
											<Link
												to={`/host/${eventData.venue.host.host_uid}/venue/${eventData.venue.venue_uid}/room/${eventData.room.room_uid}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button
													isIconOnly
													variant="light"
													aria-label="Go to room page"
												>
													<ExternalLink size={16} />
												</Button>
											</Link>
										</div>
									</div>
								</CardHeader>
							</Card>
						)}
					</div>
				</div>

				{/* Event Details */}
				<Card className="mb-8">
					<CardHeader className="flex gap-4">
						{eventData.image_url && (
							<img
								src={eventData.image_url}
								alt={eventData.name}
								className="max-w-xl h-auto max-h-[400px] object-contain rounded-xl shadow-lg border border-neutral-700"
							/>
						)}
						<div className="flex-1">
							<h2 className="text-2xl font-semibold">Event</h2>
							<Divider className="my-4" />
							<h2 className="text-2xl font-semibold">
								{highlightArtistsInTitle(
									eventTitle,
									artistNames,
									setHoveredArtist,
									hoveredArtist
								)}
							</h2>
							{eventData.start_time && (
								<p className="text-default-500">
									{new Date(
										eventData.start_time
									).toLocaleString()}
								</p>
							)}
							<div className="mt-2 flex items-center gap-2">
								<Button
									isIconOnly
									variant="light"
									aria-label="Copy event UID"
									onPress={handleCopyEventUid}
									className={
										copySuccess ? 'text-success' : ''
									}
								>
									<Copy size={16} />
								</Button>
								{eventData.event_link && (
									<Link
										to={eventData.event_link}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button
											isIconOnly
											variant="light"
											aria-label="Go to event website"
										>
											<Globe size={16} />
										</Button>
									</Link>
								)}
								<Link
									to={`/event/${eventData.event_uid}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										isIconOnly
										variant="light"
										aria-label="Go to event page"
									>
										<ExternalLink size={16} />
									</Button>
								</Link>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Artists Grid */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-semibold">Artists</h3>
						<Button
							color="primary"
							startContent={<Plus size={16} />}
							onPress={onOpen}
						>
							Add Artist
							<Kbd keys={['command', 'shift']}>L</Kbd>
						</Button>
					</div>
					{eventData.artists && eventData.artists.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{eventData.artists.map((link) => (
								<Card
									key={link.artist.artist_uid}
									onMouseEnter={() =>
										setHoveredArtist(link.artist.name)
									}
									onMouseLeave={() => setHoveredArtist(null)}
									className={
										hoveredArtist === link.artist.name
											? cardHighlightClass
											: ''
									}
								>
									<CardBody>
										<div className="flex items-center justify-between">
											<User
												name={link.artist.name}
												avatarProps={{
													src:
														link.artist
															.profile_image_url ??
														undefined
												}}
												className="text-default-900 dark:text-white"
											/>
											<div className="flex gap-2">
												<Button
													isIconOnly
													variant="light"
													aria-label="Edit artist"
													onPress={() =>
														setEditingArtist(
															link.artist
														)
													}
												>
													<SquarePen />
												</Button>
												<Button
													isIconOnly
													color="warning"
													variant="light"
													aria-label="Remove from event"
													onPress={() =>
														handleDropArtist(
															link.artist
																.artist_uid
														)
													}
												>
													<X />
												</Button>
												<Button
													isIconOnly
													color="danger"
													variant="light"
													aria-label="Delete artist"
													onPress={() =>
														handleDeleteArtist(
															link.artist
																.artist_uid
														)
													}
												>
													<Trash2 />
												</Button>
											</div>
										</div>
										<div className="mt-2 flex items-center gap-2">
											<Button
												isIconOnly
												variant="light"
												aria-label="Copy artist UID"
												onPress={() =>
													handleCopyArtistUid(
														link.artist.artist_uid
													)
												}
												className={
													copyArtistSuccess[
														link.artist.artist_uid
													]
														? 'text-success'
														: ''
												}
											>
												<Copy size={16} />
											</Button>
											<Link
												to={`/artist/${link.artist.artist_uid}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button
													isIconOnly
													variant="light"
													aria-label="Go to artist page"
												>
													<ExternalLink size={16} />
												</Button>
											</Link>
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					) : (
						<div className="text-default-400 dark:text-neutral-400 italic text-center">
							No artists attached to this event.
						</div>
					)}
				</div>

				<SearchAndSelectArtist
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					onSelect={handleArtistSelect}
					eventName={eventData.name}
					eventImageUrl={eventData.image_url || undefined}
					onEditArtist={setEditingArtist}
				/>

				{editingArtist && (
					<EditArtist
						isOpen={!!editingArtist}
						onOpenChange={(isOpen) =>
							!isOpen && setEditingArtist(null)
						}
						artist={editingArtist}
						onUpdate={() => {
							dispatch(
								serviceApi.util.invalidateTags([
									{ type: 'Event', id: data?.event_uid ?? '' }
								])
							);
						}}
					/>
				)}
			</div>
		</DefaultLayout>
	);
};

export default ReviseEventsPage;

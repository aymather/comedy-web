import { eventApiSlice } from '@/flux/api/event';
import DefaultLayout from '@/layouts/default';
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	User
} from '@heroui/react';
import { ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EventPage = () => {
	const { event_uid } = useParams<{ event_uid: string }>();
	const navigate = useNavigate();

	const { data: eventData, isLoading } = eventApiSlice.useFindOneEventQuery(
		{
			params: {
				event_uid: event_uid ?? ''
			}
		},
		{
			skip: !event_uid
		}
	);

	const handleReviseEvent = () => {
		navigate(`/revise-events?event_uid=${event_uid}`);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!eventData) {
		return <div>Event not found</div>;
	}

	return (
		<DefaultLayout>
			<div className="container mx-auto max-w-7xl px-4 pb-16 dark:bg-black min-h-screen">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl font-bold">Event Details</h1>
					<Button color="primary" onPress={handleReviseEvent}>
						Revise This Event
					</Button>
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
								{eventData.name}
							</h2>
							{eventData.start_time && (
								<p className="text-default-500">
									{new Date(
										eventData.start_time
									).toLocaleString()}
								</p>
							)}
						</div>
					</CardHeader>
				</Card>

				{/* Location Details */}
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
								</CardHeader>
							</Card>
						)}
					</div>
				</div>

				{/* Artists Grid */}
				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4">Artists</h3>
					{eventData.artists && eventData.artists.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{eventData.artists.map((link) => (
								<Card key={link.artist.artist_uid}>
									<CardBody>
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
										<div className="mt-2">
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
			</div>
		</DefaultLayout>
	);
};

export default EventPage;

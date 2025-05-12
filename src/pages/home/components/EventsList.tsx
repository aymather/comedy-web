import { eventApiSlice } from '@/flux/api/event';
import { Link } from '@heroui/link';
import { CalendarDate, Card, CardBody, Image } from '@heroui/react';
import dayjs from 'dayjs';
import { ExternalLink } from 'lucide-react';

interface EventsListProps {
	currentDate: CalendarDate;
	hoveredEventVenueUid: string | null;
	setHoveredEventVenueUid: (uid: string | null) => void;
}

const EventsList: React.FC<EventsListProps> = ({
	currentDate,
	hoveredEventVenueUid,
	setHoveredEventVenueUid
}) => {
	const { data: events } = eventApiSlice.useFindAllEventsQuery({
		params: {
			date: currentDate.toString()
		}
	});

	return (
		<div className="flex flex-col max-w-2xl">
			{events && events.length > 0 ? (
				<div className="flex flex-col gap-4 w-full">
					<span className="text-sm text-default-500">
						Upcoming Events
					</span>
					{events.map((event) => (
						<Card
							key={event.event_uid}
							className="flex flex-row items-start gap-4 p-4 transition-all duration-150 cursor-pointer hover:bg-default-100"
							onMouseEnter={() =>
								setHoveredEventVenueUid(event.venue?.venue_uid)
							}
							onMouseLeave={() => setHoveredEventVenueUid(null)}
						>
							<CardBody className="flex flex-cold gap-4">
								<div className="flex flex-row items-center gap-4">
									{event.image_url && (
										<Image
											src={event.image_url}
											alt={event.name}
											className="w-32 h-32 object-cover flex-shrink-0"
										/>
									)}
									<h3 className="font-semibold text-lg flex-1">
										{event.name}
									</h3>
								</div>
								<div className="flex flex-col flex-1">
									{event.start_time && (
										<p className="text-sm text-center text-default-500">
											{dayjs(event.start_time).format(
												'h:mma'
											)}
										</p>
									)}
									<div className="text-sm text-default-600 mt-1 flex flex-col flex-wrap gap-4">
										<span className="inline-flex items-center gap-1">
											<strong>Host:</strong>
											{event.venue?.host
												?.profile_image_url && (
												<Image
													src={
														event.venue.host
															.profile_image_url
													}
													alt={event.venue.host.name}
													className="h-6 w-6 object-cover rounded-full ml-1"
												/>
											)}
											<span>
												{event.venue?.host?.name ||
													'N/A'}
											</span>
										</span>
										<span className="inline-flex items-center gap-1">
											<strong>Venue:</strong>
											{event.venue?.profile_image_url && (
												<Image
													src={
														event.venue
															.profile_image_url
													}
													alt={event.venue.name}
													className="h-6 w-6 object-cover rounded-full ml-1"
												/>
											)}
											<span>
												{event.venue?.name || 'N/A'}
											</span>
										</span>
										{event.room?.name && (
											<span className="inline-flex items-center gap-1">
												<strong>Room:</strong>
												{event.room
													.profile_image_url && (
													<Image
														src={
															event.room
																.profile_image_url
														}
														alt={event.room.name}
														className="h-6 w-6 object-cover rounded-full ml-1"
													/>
												)}
												<span>{event.room.name}</span>
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center justify-end gap-2">
									{event.event_link && (
										<Link
											href={event.event_link}
											target="_blank"
											rel="noopener noreferrer"
										>
											<ExternalLink size={16} />
										</Link>
									)}
									<Link
										href={event.event_link || ''}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary"
									>
										View Details
									</Link>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			) : (
				<div className="text-default-400 dark:text-neutral-400 italic text-center">
					No upcoming events found.
				</div>
			)}
		</div>
	);
};

export default EventsList;

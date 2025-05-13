import { EventIcon } from '@/components/icons';
import { eventApiSlice } from '@/flux/api/event';
import { Event } from '@/flux/api/event/event.entity';
import { dayjs } from '@/utils/dayjs';
import { CalendarDate, Card, CardBody, Image } from '@heroui/react';
import { ClockIcon } from 'lucide-react';

const EventImageWithDefault = ({ event }: { event: Event }) => {
	if (!event.image_url) {
		return (
			<div className="w-32 h-32 flex items-center justify-center bg-default-100 rounded-large border">
				<EventIcon size={48} className="text-default-500" />
			</div>
		);
	}

	return (
		<Image
			src={event.image_url}
			alt={event.name}
			className="w-32 h-32 object-cover flex-shrink-0"
		/>
	);
};

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
			date: dayjs(currentDate.toString()).utc()
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
							<CardBody className="flex flex-row gap-4 w-full">
								<div className="flex flex-col items-center gap-4">
									<EventImageWithDefault event={event} />
									{event.start_time && (
										<div className="flex text-default-500 items-center gap-2">
											<ClockIcon size={14} />
											<p className="text-sm text-center text-default-500">
												{dayjs(event.start_time).format(
													'h:mma'
												)}
											</p>
										</div>
									)}
								</div>
								<div className="flex flex-col flex-1 justify-center">
									<h3 className="font-semibold text-lg">
										{event.name}
									</h3>
									{event.venue?.host && (
										<span className="inline-flex items-center gap-1 mt-2">
											{event.venue.host
												.profile_image_url && (
												<Image
													src={
														event.venue.host
															.profile_image_url
													}
													alt={event.venue.host.name}
													className="h-6 w-6 object-cover rounded-full"
												/>
											)}
											<span className="text-sm text-default-500">
												{event.venue.host.name}
											</span>
										</span>
									)}
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

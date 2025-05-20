import { Event } from '@/flux/api/event/event.entity';
import useEventImagePriority from '@/hooks/useEventImagePriority';
import { dayjs } from '@/utils/dayjs';
import { Avatar, Card } from '@heroui/react';
import { ClockIcon } from 'lucide-react';
import React from 'react';
import { HoveredEvent, SelectedEvent, SelectedVenue } from '../home.page';
import ImagesSwiper from './ImagesSwiper';

const EventCard: React.FC<{
	event: Event;
	setSelectedEvent: (event: SelectedEvent | null) => void;
	setHoveredEvent: (event: HoveredEvent | null) => void;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
}> = ({ event, setSelectedEvent, setHoveredEvent, setSelectedVenue }) => {
	const { imagePriorityForEvent } = useEventImagePriority();
	const images = imagePriorityForEvent(event);

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() =>
				setSelectedEvent({
					venue_uid: event.venue.venue_uid,
					event_uid: event.event_uid
				})
			}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					setSelectedEvent({
						venue_uid: event.venue.venue_uid,
						event_uid: event.event_uid
					});
				}
			}}
			onMouseEnter={() =>
				setHoveredEvent({
					venue_uid: event.venue.venue_uid,
					event_uid: event.event_uid
				})
			}
			onMouseLeave={() => setHoveredEvent(null)}
			className="cursor-pointer"
		>
			<Card
				key={event.event_uid}
				className="flex md:flex-row md:min-h-[200px] shadow-md bg-white dark:bg-neutral-900 cursor-pointer border border-default-100 dark:border-neutral-800 items-stretch"
			>
				{/* Swiper carousel for event images */}
				<div className="w-full h-[200px] md:h-auto md:w-1/3 flex">
					<ImagesSwiper images={images} />
				</div>
				<div className="w-full md:w-2/3 p-4 flex flex-col gap-2 justify-center">
					{/* Event Name */}
					<div className="text-center md:text-left">
						<h3 className="font-semibold text-lg md:text-2xl text-gray-900 dark:text-white">
							{event.name}
						</h3>
					</div>
					{/* Info Row */}
					<div className="flex flex-row w-full items-center justify-between">
						{/* Host Avatar */}
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<Avatar
									src={
										event.venue?.host?.profile_image_url ||
										''
									}
									name={event.venue?.host?.name || ''}
									size="sm"
								/>
								<span
									className="hidden md:block text-default-500 dark:text-neutral-400 text-sm cursor-pointer hover:underline"
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										setSelectedVenue({
											host_uid: event.venue.host.host_uid,
											venue_uid: event.venue.venue_uid
										});
									}}
									onKeyDown={(e) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											e.stopPropagation();
											setSelectedVenue({
												host_uid:
													event.venue.host.host_uid,
												venue_uid: event.venue.venue_uid
											});
										}
									}}
								>
									{event.venue?.host?.name || ''}
								</span>
							</div>
							{event.room && (
								<div className="hidden md:flex items-center gap-2">
									<Avatar
										src={
											event.room?.profile_image_url || ''
										}
										name={event.room.name || ''}
										size="sm"
									/>
									<span
										className="hidden md:block text-default-500 dark:text-neutral-400 text-sm hover:underline cursor-pointer"
										role="button"
										tabIndex={0}
										onClick={(e) => {
											e.stopPropagation();
											setSelectedVenue({
												host_uid:
													event.venue.host.host_uid,
												venue_uid:
													event.venue.venue_uid,
												room_uid: event.room.room_uid
											});
										}}
										onKeyDown={(e) => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												e.stopPropagation();
												setSelectedVenue({
													host_uid:
														event.venue.host
															.host_uid,
													venue_uid:
														event.venue.venue_uid,
													room_uid:
														event.room.room_uid
												});
											}
										}}
									>
										{event.room.name || ''}
									</span>
								</div>
							)}
						</div>
						{/* Event Time */}
						<div className="flex items-center gap-1 text-default-500 dark:text-neutral-400 text-sm">
							<ClockIcon size={16} className="hidden md:block" />
							<span>
								{event.start_time
									? dayjs(event.start_time).format('h:mma')
									: ''}
							</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default EventCard;

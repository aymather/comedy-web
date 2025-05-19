import { eventApiSlice } from '@/flux/api/event';
import { Event } from '@/flux/api/event/event.entity';
import { venueApiSlice } from '@/flux/api/venue';
import { NanoId } from '@/types';
import { dayjs } from '@/utils/dayjs';
import { Avatar, Button, CalendarDate, Card, Chip, Image } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClockIcon, XIcon } from 'lucide-react';
import React from 'react';
import { HoveredEvent, SelectedEvent, SelectedVenue } from '../home.page';
import ImagesSwiper from './ImagesSwiper';

interface EventsListProps {
	currentDate: CalendarDate;
	setSelectedEvent: (event: SelectedEvent | null) => void;
	setHoveredEvent: (event: HoveredEvent | null) => void;
	selectedVenue: {
		host_uid: NanoId;
		venue_uid: NanoId;
		room_uid?: NanoId;
	} | null;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
	closeSelectedVenue: () => void;
}

const EventCard: React.FC<{
	event: Event;
	setSelectedEvent: (event: SelectedEvent | null) => void;
}> = ({ event, setSelectedEvent }) => {
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
			className="cursor-pointer"
		>
			<Card
				key={event.event_uid}
				className="flex md:flex-row md:min-h-[200px] shadow-md bg-white dark:bg-neutral-900 cursor-pointer border border-default-100 dark:border-neutral-800 items-stretch"
			>
				{/* Swiper carousel for event images */}
				<div className="w-full h-[200px] md:h-auto md:w-1/3 flex">
					<ImagesSwiper
						images={[1, 2, 3].map((i) => event.image_url || '')}
					/>
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
								<span className="hidden md:block text-default-500 dark:text-neutral-400 text-sm">
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
									<span className="hidden md:block text-default-500 dark:text-neutral-400 text-sm">
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

const EventsList: React.FC<EventsListProps> = ({
	currentDate,
	setSelectedEvent,
	setHoveredEvent,
	selectedVenue,
	setSelectedVenue,
	closeSelectedVenue
}) => {
	const { data: events } = eventApiSlice.useFindAllEventsQuery({
		params: {
			host_uid: selectedVenue?.host_uid,
			venue_uid: selectedVenue?.venue_uid,
			room_uid: selectedVenue?.room_uid,
			date: dayjs(currentDate.toString()).utc()
		}
	});

	const { data: venue } = venueApiSlice.useFindOneVenueQuery(
		{
			params: {
				venue_uid: selectedVenue?.venue_uid || '',
				host_uid: selectedVenue?.host_uid || ''
			}
		},
		{
			skip: !selectedVenue?.venue_uid || !selectedVenue?.host_uid
		}
	);

	const images = venue
		? [
				venue.profile_image_url || '',
				...(venue.images.map((image) => image.url || '') || [])
			].filter(Boolean)
		: [];

	return (
		<div className="flex flex-col p-8 bg-white dark:bg-neutral-950">
			<AnimatePresence>
				{selectedVenue && venue && (
					<motion.div
						className="flex flex-col gap-4 mb-8"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
						{/* Swiper header image */}
						<ImagesSwiper images={images} />
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-2">
								{venue.host?.profile_image_url && (
									<Image
										src={venue.host.profile_image_url}
										alt={venue.host.name}
										className="w-10 h-10 rounded-full border border-default-200 dark:border-neutral-700"
									/>
								)}
								<span className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">
									{venue.name}
								</span>
							</div>
							<Button
								isIconOnly
								aria-label="Close venue"
								variant="flat"
								className="rounded-full text-gray-900 dark:text-white"
								onPress={closeSelectedVenue}
							>
								<XIcon size={24} />
							</Button>
						</div>
						{/* Room chips row */}
						{venue.rooms && venue.rooms.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-4">
								{venue.rooms.map((room) => {
									const isSelected =
										selectedVenue?.room_uid ===
										room.room_uid;
									return (
										<Chip
											key={room.room_uid}
											className="cursor-pointer hover:bg-default-100 dark:hover:bg-neutral-800"
											avatar={
												<Avatar
													name={room.name}
													src={
														room.profile_image_url ||
														undefined
													}
													size="sm"
												/>
											}
											variant="bordered"
											color={
												isSelected
													? 'warning'
													: undefined
											}
											onClick={
												isSelected
													? undefined
													: () =>
															setSelectedVenue({
																...selectedVenue!,
																room_uid:
																	room.room_uid
															})
											}
											onClose={
												isSelected
													? () =>
															setSelectedVenue({
																host_uid:
																	selectedVenue!
																		.host_uid,
																venue_uid:
																	selectedVenue!
																		.venue_uid
															})
													: undefined
											}
										>
											{room.name}
										</Chip>
									);
								})}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
			{events && events.length > 0 ? (
				<div className="flex flex-col gap-4 w-full">
					{events.map((event) => (
						<EventCard
							key={event.event_uid}
							event={event}
							setSelectedEvent={setSelectedEvent}
						/>
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

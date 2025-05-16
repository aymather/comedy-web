import { EventIcon } from '@/components/icons';
import { eventApiSlice } from '@/flux/api/event';
import { Event } from '@/flux/api/event/event.entity';
import { venueApiSlice } from '@/flux/api/venue';
import { NanoId } from '@/types';
import { dayjs } from '@/utils/dayjs';
import {
	Avatar,
	Button,
	CalendarDate,
	Card,
	CardBody,
	Chip,
	Image
} from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ClockIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { HoveredEvent, SelectedEvent, SelectedVenue } from '../home.page';

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

const EventsList: React.FC<EventsListProps> = ({
	currentDate,
	setSelectedEvent,
	setHoveredEvent,
	selectedVenue,
	setSelectedVenue,
	closeSelectedVenue
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>();
	const swiperRef = useRef<any>(null);

	useEffect(() => {
		if (selectedVenue === null) {
			setActiveIndex(0);
		}
	}, [selectedVenue]);

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
				venue.profile_image_url,
				...(venue.rooms.map((room) => room.profile_image_url) || []),
				...(venue.images.map((image) => image.url) || [])
			].filter(Boolean)
		: [];

	return (
		<div className="flex flex-col p-8">
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
						<div className="flex w-full justify-center items-center relative h-[30vh] border-1 border-default-100 rounded-2xl overflow-hidden">
							{/* Swiper navigation arrows */}
							<button
								type="button"
								className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
								aria-label="Previous image"
								onClick={() => swiperInstance?.slidePrev()}
							>
								<ChevronLeft size={24} />
							</button>
							<button
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
								aria-label="Next image"
								onClick={() => swiperInstance?.slideNext()}
							>
								<ChevronRight size={24} />
							</button>
							<Swiper
								spaceBetween={1}
								slidesPerView={1}
								onSlideChange={(swiper) =>
									setActiveIndex(swiper.realIndex)
								}
								className="w-full h-full"
								onSwiper={setSwiperInstance}
								ref={swiperRef}
							>
								{images.map((i) => (
									<SwiperSlide
										key={i}
										className="w-full h-full max-w-full relative overflow-hidden"
									>
										{/* Blurred background image */}
										<img
											alt=""
											className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
											src={i || ''}
										/>
										{/* Main image */}
										<div className="relative w-full h-full flex items-center justify-center">
											<img
												alt={venue.name}
												className="max-w-full max-h-full h-full w-full object-contain mx-auto my-auto"
												src={i || ''}
											/>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
							{/* Slide indicator */}
							<div className="absolute bottom-2 right-4 bg-black/50 text-white text-sm rounded-md px-2 py-1 z-10 backdrop-blur-sm">
								{activeIndex + 1} / {images.length}
							</div>
						</div>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-2">
								{venue.host?.profile_image_url && (
									<Image
										src={venue.host.profile_image_url}
										alt={venue.host.name}
										className="w-10 h-10 rounded-full"
									/>
								)}
								<span className="text-2xl font-bold leading-7">
									{venue.name}
								</span>
							</div>
							<Button
								isIconOnly
								aria-label="Close venue"
								variant="flat"
								className="rounded-full"
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
											className="cursor-pointer hover:bg-default-100"
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
						<Card
							key={event.event_uid}
							className="flex flex-row items-start gap-4 p-4 transition-all duration-150 cursor-pointer hover:bg-default-100"
							onMouseEnter={() =>
								setHoveredEvent({
									venue_uid: event.venue.venue_uid,
									event_uid: event.event_uid
								})
							}
							onMouseLeave={() => setHoveredEvent(null)}
						>
							<CardBody
								className="flex flex-row gap-4 w-full"
								onClick={() =>
									setSelectedEvent({
										venue_uid: event.venue.venue_uid,
										event_uid: event.event_uid
									})
								}
							>
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
											<button
												className="text-sm text-default-500 cursor-pointer hover:text-default-700 bg-transparent border-none p-0"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedVenue({
														host_uid:
															event.venue.host
																.host_uid,
														venue_uid:
															event.venue
																.venue_uid
													});
												}}
											>
												{event.venue.name}
											</button>
										</span>
									)}
									{event.room && (
										<span className="inline-flex items-center gap-1 mt-2">
											{event.room.profile_image_url && (
												<Image
													src={
														event.room
															.profile_image_url
													}
													alt={event.room.name}
													className="h-6 w-6 object-cover rounded-full"
												/>
											)}
											<button
												className="text-sm text-default-500 cursor-pointer hover:text-default-700 bg-transparent border-none p-0"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedVenue({
														host_uid:
															event.venue.host
																.host_uid,
														venue_uid:
															event.venue
																.venue_uid,
														room_uid:
															event.room.room_uid
													});
												}}
											>
												{event.room.name}
											</button>
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

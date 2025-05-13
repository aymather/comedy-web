import { eventApiSlice } from '@/flux/api/event';
import { googleMapsApiSlice } from '@/flux/api/google-maps';
import { venueApiSlice } from '@/flux/api/venue';
import { NanoId } from '@/types';
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Image,
	Link,
	Tooltip
} from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventDatePickerControl from './EventDatePickerControl';

interface SelectVenueDrawerProps {
	selectedVenue: {
		host_uid: NanoId;
		venue_uid: NanoId;
	} | null;
	isOpen: boolean;
	onClose: () => void;
}

const SelectVenueDrawer = ({
	selectedVenue,
	isOpen,
	onClose
}: SelectVenueDrawerProps) => {
	const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
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

	const { data: events } = eventApiSlice.useFindAllEventsQuery(
		{
			params: {
				host_uid: selectedVenue?.host_uid || '',
				venue_uid: selectedVenue?.venue_uid || '',
				date: dayjs(selectedDate.toString()).utc()
			}
		},
		{
			skip:
				!selectedVenue?.venue_uid ||
				!selectedVenue?.host_uid ||
				!selectedDate
		}
	);

	const { data: locationDetails } =
		googleMapsApiSlice.useGetLocationDetailsByPlaceIdQuery(
			{
				body: {
					place_id: venue?.place_id || ''
				}
			},
			{
				skip: !venue?.place_id
			}
		);

	const [activeIndex, setActiveIndex] = useState(0);

	const images = [
		venue?.profile_image_url,
		...(venue?.rooms.map((room) => room.profile_image_url) || []),
		...(venue?.images.map((image) => image.url) || [])
	].filter(Boolean);

	if (!venue) return null;

	return (
		<Drawer
			hideCloseButton
			backdrop="blur"
			classNames={{
				base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium'
			}}
			isOpen={isOpen}
			onOpenChange={onClose}
		>
			<DrawerContent>
				{(onClose) => (
					<>
						<DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
							<Tooltip content="Close">
								<Button
									isIconOnly
									className="text-default-400"
									size="sm"
									variant="light"
									onPress={onClose}
								>
									<svg
										fill="none"
										height="20"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
									</svg>
								</Button>
							</Tooltip>
							<div className="w-full flex justify-start gap-2">
								<Button
									className="font-medium text-small text-default-500"
									size="sm"
									startContent={
										<svg
											height="16"
											viewBox="0 0 16 16"
											width="16"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
												fill="currentColor"
												fillRule="evenodd"
											/>
										</svg>
									}
									variant="flat"
								>
									Copy Link
								</Button>
								<Button
									className="font-medium text-small text-default-500"
									endContent={
										<svg
											fill="none"
											height="16"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="16"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M7 17 17 7M7 7h10v10" />
										</svg>
									}
									size="sm"
									variant="flat"
								>
									Venue Page
								</Button>
							</div>
						</DrawerHeader>
						<DrawerBody className="pt-16">
							{/* Swiper header image */}
							<div className="flex w-full justify-center items-center pt-4 relative">
								<Swiper
									spaceBetween={1}
									slidesPerView={1}
									onSlideChange={(swiper) =>
										setActiveIndex(swiper.realIndex)
									}
									className="w-full max-w-md rounded-2xl overflow-hidden h-full"
								>
									{images.map((i) => (
										<SwiperSlide
											key={i}
											className="w-full max-w-full"
										>
											<img
												// isBlurred
												alt={venue.name}
												className="w-full h-full object-cover"
												height={300}
												src={i || ''}
											/>
										</SwiperSlide>
									))}
								</Swiper>
								{/* Slide indicator */}
								<div className="absolute bottom-2 right-4 bg-gray-400/20 text-white text-xs rounded-full px-2 py-1 z-10 backdrop-blur-sm">
									{activeIndex + 1} / {images.length}
								</div>
							</div>
							<div className="flex flex-col gap-2 py-4">
								<h1 className="text-2xl font-bold leading-7">
									{venue.name}
								</h1>
								{locationDetails && (
									<div className="flex items-center gap-2">
										<Image
											src={
												venue.host.profile_image_url ||
												''
											}
											alt={venue.host.name}
											className="w-6 h-6 rounded-full"
										/>
										<p className="text-sm text-default-500">
											{venue.host.name}
										</p>
									</div>
								)}
								<div className="mt-4 flex flex-col gap-3">
									{venue.host.description && (
										<div className="flex flex-col mt-4 gap-3 items-start">
											<span className="text-medium font-medium">
												About the venue
											</span>
											<div className="text-medium text-default-500">
												<p>{venue.host.description}</p>
											</div>
										</div>
									)}
									<EventDatePickerControl
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
										size="sm"
									/>
									{/* Events for the selected day */}
									<div className="mt-2">
										{events && events.length > 0 ? (
											<div className="flex flex-col gap-2">
												{events.map((event) => (
													<div
														key={event.event_uid}
														className="flex flex-row gap-2 p-2 rounded-lg border hover:bg-default-50 transition-colors shadow-sm"
													>
														<Image
															src={
																event.image_url ||
																''
															}
															alt={event.name}
															className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
														/>
														<div className="flex flex-col flex-1 gap-1">
															<span className="font-medium text-default-800">
																{event.name}
															</span>
															{event.start_time && (
																<span className="text-xs text-default-500">
																	{new Date(
																		event.start_time
																	).toLocaleTimeString(
																		[],
																		{
																			hour: '2-digit',
																			minute: '2-digit'
																		}
																	)}
																</span>
															)}
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="text-default-400 italic text-center text-xs py-2">
												No events for this day.
											</div>
										)}
									</div>
								</div>
							</div>
						</DrawerBody>
						<DrawerFooter className="flex flex-col gap-1 border-t border-default-200/50">
							<div className="flex gap-3 items-center">
								<div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
									<svg
										className="text-default-500"
										height="20"
										viewBox="0 0 16 16"
										width="20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g
											fill="none"
											fillRule="evenodd"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
										>
											<path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854" />
											<path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
										</g>
									</svg>
								</div>
								<div className="flex flex-col gap-0.5">
									{locationDetails && (
										<Link
											isExternal
											showAnchorIcon
											anchorIcon={
												<svg
													className="group-hover:text-inherit text-default-400 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
													fill="none"
													height="16"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													width="16"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M7 17 17 7M7 7h10v10" />
												</svg>
											}
											className="group gap-x-0.5 text-medium text-foreground font-medium"
											href={`https://www.google.com/maps/place/${encodeURIComponent(locationDetails.formatted_address)}`}
											rel="noreferrer noopener"
										>
											{locationDetails.formatted_address}
										</Link>
									)}
									{locationDetails?.address_components && (
										<p className="text-small text-default-500">
											{locationDetails.address_components
												.filter(
													(component) =>
														component.types.includes(
															'locality' as any
														) ||
														component.types.includes(
															'administrative_area_level_1' as any
														)
												)
												.map(
													(component) =>
														component.long_name
												)
												.join(', ')}
										</p>
									)}
								</div>
							</div>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
};

export default SelectVenueDrawer;

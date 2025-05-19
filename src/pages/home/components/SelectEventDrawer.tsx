import { Alcohol, Food, PhoneFreeZone, TwoDrinks } from '@/components/icons';
import Map from '@/components/Map';
import { eventApiSlice } from '@/flux/api/event';
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Image,
	Link,
	Skeleton,
	Tooltip
} from '@heroui/react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import dayjs from 'dayjs';
import { SelectedEvent } from '../home.page';
import ImagesSwiper from './ImagesSwiper';

interface SelectEventDrawerProps {
	selectedEvent: SelectedEvent | null;
	isOpen: boolean;
	onClose: () => void;
}

const SelectEventDrawer = ({
	selectedEvent,
	isOpen,
	onClose
}: SelectEventDrawerProps) => {
	const { data: event, isFetching } = eventApiSlice.useFindOneEventQuery(
		{
			params: {
				event_uid: selectedEvent?.event_uid || ''
			}
		},
		{
			skip: !selectedEvent
		}
	);

	const images = [
		event?.image_url,
		event?.venue?.profile_image_url,
		event?.venue?.stage_image_url
	].filter(Boolean) as string[];

	return (
		<Drawer
			hideCloseButton
			backdrop="opaque"
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
								<Skeleton
									className="rounded-lg"
									isLoaded={!isFetching}
								>
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
								</Skeleton>
								<Skeleton
									className="rounded-lg"
									isLoaded={!isFetching}
								>
									{event?.event_link && (
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
											as={Link}
											href={event.event_link}
											isExternal
										>
											Event Page
										</Button>
									)}
								</Skeleton>
							</div>
						</DrawerHeader>
						<DrawerBody className="pt-16 gap-4">
							{/* Swiper header image */}
							<Skeleton
								className="rounded-lg"
								isLoaded={!isFetching}
							>
								<div className="h-[300px] rounded-2xl overflow-hidden">
									<ImagesSwiper images={images} />
								</div>
							</Skeleton>
							<div className="flex flex-col gap-8 py-4">
								<Skeleton
									className="rounded-lg"
									isLoaded={!isFetching}
								>
									<h1 className="text-2xl font-bold leading-7">
										{event?.name}
									</h1>
								</Skeleton>
								<div className="flex flex-col gap-3">
									{/* Date/Time Section */}
									<Skeleton
										className="rounded-lg"
										isLoaded={!isFetching}
									>
										{event?.start_time && (
											<div className="flex gap-3 items-center">
												<div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
													<div className="text-tiny bg-default-100 py-0.5 text-default-500">
														{dayjs(
															event.start_time
														).format('MMM')}
													</div>
													<div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
														{dayjs(
															event.start_time
														).format('D')}
													</div>
												</div>
												<div className="flex flex-col gap-0.5">
													<p className="text-medium text-foreground font-medium">
														{dayjs(
															event.start_time
														).format('dddd')}
													</p>
													<p className="text-small text-default-500">
														{dayjs(
															event.start_time
														).format('h:mm A')}
														{event.end_time &&
															` - ${dayjs(event.end_time).format('h:mm A')}`}{' '}
														{dayjs().format('z')}
													</p>
												</div>
											</div>
										)}
									</Skeleton>
									{/* Location Section */}
									<Skeleton
										className="rounded-lg"
										isLoaded={!isFetching}
									>
										{event?.venue?.location && (
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
														href={`https://www.google.com/maps/place/${encodeURIComponent(event.venue?.location.formatted_address || '')}`}
														rel="noreferrer noopener"
													>
														{event.venue?.name ||
															event.venue
																?.location
																.formatted_address}
													</Link>
													<p className="text-small text-default-500">
														{event.venue?.location.address_components
															?.filter(
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
												</div>
											</div>
										)}
									</Skeleton>
								</div>
								{/* About the event */}
								<Skeleton
									className="rounded-lg"
									isLoaded={!isFetching}
								>
									{event?.description && (
										<div className="flex flex-col gap-3 items-start">
											<span className="text-medium font-medium">
												About the event
											</span>
											<div className="text-medium text-default-500">
												<p>{event.description}</p>
											</div>
										</div>
									)}
								</Skeleton>
								<div className="flex flex-col gap-3">
									<div className="flex flex-col gap-1">
										<span className="text-medium font-medium text-default-500">
											Features
										</span>
									</div>
									<Skeleton
										className="rounded-lg"
										isLoaded={!isFetching}
									>
										<div className="space-y-2">
											{event?.two_drink_minimum && (
												<div className="flex items-center gap-2 text-default-500">
													<TwoDrinks />
													<span>2 Drink Minimum</span>
												</div>
											)}
											{event?.phone_free_zone && (
												<div className="flex items-center gap-2 text-default-500">
													<PhoneFreeZone />
													<span>Phone Free Zone</span>
												</div>
											)}
											{event?.serves_alcohol && (
												<div className="flex items-center gap-2 text-default-500">
													<Alcohol />
													<span>Serves Alcohol</span>
												</div>
											)}
											{event?.serves_food && (
												<div className="flex items-center gap-2 text-default-500">
													<Food />
													<span>Serves Food</span>
												</div>
											)}
										</div>
									</Skeleton>
								</div>
								{/** Mini Map */}
								<Skeleton
									className="w-full h-48 rounded-medium"
									isLoaded={!isFetching}
								>
									{event?.venue?.location && (
										<div className="w-full h-48 border-1 border-default-200/50 rounded-medium overflow-hidden">
											<Map
												center={{
													lat: Number(
														event.venue.location
															.latitude
													),
													lng: Number(
														event.venue.location
															.longitude
													)
												}}
												zoom={10}
												gestureHandling="greedy"
												disableDefaultUI={true}
												minZoom={10}
												maxZoom={10}
												style={{
													width: '100%',
													height: '100%',
													overflow: 'hidden'
												}}
											>
												<AdvancedMarker
													position={{
														lat: Number(
															event.venue.location
																.latitude
														),
														lng: Number(
															event.venue.location
																.longitude
														)
													}}
												>
													<Image
														src={
															event.venue.host
																?.profile_image_url ||
															''
														}
														alt={event.venue?.name}
														className="h-6 w-6 object-cover rounded-full border-1 border-transparent cursor-pointer transition-all"
													/>
												</AdvancedMarker>
											</Map>
										</div>
									)}
								</Skeleton>
							</div>
						</DrawerBody>
						<DrawerFooter className="flex flex-row justify-between items-center border-t border-default-200/50 py-4 px-4">
							<Skeleton
								className="rounded-lg"
								isLoaded={!isFetching}
							>
								{event?.venue?.host && (
									<div className="flex flex-col items-start">
										<span className="text-small font-bold text-default-500 mb-1">
											Host
										</span>
										<div className="flex gap-2 items-center">
											<Image
												src={
													event.venue.host
														.profile_image_url || ''
												}
												alt={event.venue.host.name}
												className="w-7 h-7 rounded-full"
											/>
											<span className="text-small text-default-500">
												{event.venue.host.name}
											</span>
										</div>
									</div>
								)}
							</Skeleton>
							<Skeleton
								className="rounded-lg"
								isLoaded={!isFetching}
							>
								{event?.event_link && (
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
										as={Link}
										href={event.event_link}
										isExternal
									>
										Event Page
									</Button>
								)}
							</Skeleton>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
};

export default SelectEventDrawer;

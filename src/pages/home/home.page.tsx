import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useState } from 'react';
import EventDatePickerControl from './components/EventDatePickerControl';
import EventsList from './components/EventsList';
import HomeMap from './components/HomeMap';
import SelectVenueDrawer from './components/SelectVenueDrawer';

const HomePage = () => {
	const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
	const [hoveredEventVenueUid, setHoveredEventVenueUid] = useState<
		string | null
	>(null);
	const [selectedVenue, setSelectedVenue] = useState<{
		host_uid: NanoId;
		venue_uid: NanoId;
	} | null>(null);

	return (
		<DefaultLayout>
			<section className="container flex flex-row justify-center gap-4 h-[calc(100vh-80px)] max-h-[900px]">
				{/* Left: Map and Date Picker (static) */}
				<div className="flex flex-col gap-8 flex-shrink-0">
					<HomeMap
						hoveredEventVenueUid={hoveredEventVenueUid}
						onVenueSelect={(host, venue) =>
							setSelectedVenue({
								host_uid: host.host_uid,
								venue_uid: venue.venue_uid
							})
						}
					/>
					<EventDatePickerControl
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				</div>
				{/* Right: Events List (scrollable) */}
				<div className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-80px)] px-12">
					<EventsList
						currentDate={selectedDate}
						hoveredEventVenueUid={hoveredEventVenueUid}
						setHoveredEventVenueUid={setHoveredEventVenueUid}
					/>
				</div>
			</section>
			<SelectVenueDrawer
				selectedVenue={selectedVenue}
				isOpen={selectedVenue !== null}
				onClose={() => setSelectedVenue(null)}
			/>
		</DefaultLayout>
	);
};

export default HomePage;

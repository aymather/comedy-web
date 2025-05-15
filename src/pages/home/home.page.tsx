import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import { getLocalTimeZone, today } from '@internationalized/date';
import { useState } from 'react';
import EventDatePickerControl from './components/EventDatePickerControl';
import EventsList from './components/EventsList';
import HomeMap from './components/HomeMap';
import SelectEventDrawer from './components/SelectEventDrawer';

export type SelectedVenue = {
	host_uid: NanoId;
	venue_uid: NanoId;
	room_uid?: NanoId;
};

export type HoveredVenue = {
	host_uid: NanoId;
	venue_uid: NanoId;
};

export type HoveredEvent = {
	venue_uid: NanoId;
	event_uid: NanoId;
};

export type SelectedEvent = {
	venue_uid: NanoId;
	event_uid: NanoId;
};

const HomePage = () => {
	const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
	const [hoveredEvent, setHoveredEvent] = useState<HoveredEvent | null>(null);
	const [hoveredVenue, setHoveredVenue] = useState<HoveredVenue | null>(null);
	const [selectedVenue, setSelectedVenue] = useState<SelectedVenue | null>(
		null
	);
	const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
		null
	);

	const closeSelectedVenue = () => setSelectedVenue(null);

	return (
		<DefaultLayout>
			<section className="container flex flex-row justify-center gap-4 h-[calc(100vh-80px)] max-h-[900px]">
				{/* Left: Map and Date Picker (static) */}
				<div className="flex flex-col gap-8 flex-shrink-0">
					<HomeMap
						hoveredEvent={hoveredEvent}
						selectedVenue={selectedVenue}
						setSelectedVenue={setSelectedVenue}
						hoveredVenue={hoveredVenue}
						setHoveredVenue={setHoveredVenue}
						selectedEvent={selectedEvent}
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
						setSelectedEvent={setSelectedEvent}
						selectedVenue={selectedVenue}
						closeSelectedVenue={closeSelectedVenue}
						setHoveredEvent={setHoveredEvent}
						setSelectedVenue={setSelectedVenue}
					/>
				</div>
			</section>
			<SelectEventDrawer
				selectedEvent={selectedEvent}
				isOpen={selectedEvent !== null}
				onClose={() => setSelectedEvent(null)}
			/>
		</DefaultLayout>
	);
};

export default HomePage;

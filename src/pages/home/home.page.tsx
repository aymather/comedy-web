import { eventApiSlice } from '@/flux/api/event';
import { hostApiSlice } from '@/flux/api/host';
import DefaultLayout from '@/layouts/default';
import { NanoId } from '@/types';
import { dayjs } from '@/utils/dayjs';
import { Button } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { List, Map } from 'lucide-react';
import { useState } from 'react';
import EventDatePickerControl from './components/EventDatePickerControl';
import EventsList from './components/EventsList';
import HomeMap from './components/HomeMap';
import SelectEventDrawer from './components/SelectEventDrawer';
import SelectVenueDrawer from './components/SelectVenueDrawer';

type PageView = 'list' | 'map';

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
	const [view, setView] = useState<PageView>('list');
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

	const { data: hosts } = hostApiSlice.useFindAllHostsQuery();
	const { data: events } = eventApiSlice.useFindAllEventsQuery({
		params: {
			date: dayjs(selectedDate.toString()).utc()
		}
	});

	return (
		<DefaultLayout>
			<div className="flex flex-col h-full overflow-hidden">
				{/* <div className="py-6">Potential Header Content</div> */}
				<div className="flex flex-1 flex-col overflow-hidden h-full relative">
					<div className="flex flex-row h-full">
						<div
							className={`hidden md:flex flex-1 ${view === 'map' ? '!flex' : ''}`}
						>
							<HomeMap
								hosts={hosts}
								hoveredEvent={hoveredEvent}
								selectedVenue={selectedVenue}
								setSelectedVenue={setSelectedVenue}
								hoveredVenue={hoveredVenue}
								setHoveredVenue={setHoveredVenue}
								selectedEvent={selectedEvent}
							/>
						</div>
						<div
							className={`flex flex-1 flex-col overflow-y-auto pb-16 md:pb-0 ${view === 'map' ? 'hidden md:flex' : ''}`}
						>
							<EventsList
								events={events}
								setSelectedEvent={setSelectedEvent}
								setHoveredEvent={setHoveredEvent}
								setSelectedVenue={setSelectedVenue}
							/>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4 md:hidden z-20">
						<Button
							startContent={view === 'list' ? <Map /> : <List />}
							variant="shadow"
							color="default"
							className="text-default-600"
							onPress={() => {
								if (view === 'list') {
									setView('map');
								} else {
									setView('list');
								}
							}}
						>
							View {view === 'list' ? 'Map' : 'List'}
						</Button>
					</div>
				</div>
				<div className="py-6 md:py-12 border-t border-default-200/50">
					<EventDatePickerControl
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				</div>
			</div>
			<SelectEventDrawer
				selectedEvent={selectedEvent}
				isOpen={selectedEvent !== null}
				onClose={() => setSelectedEvent(null)}
			/>
			<SelectVenueDrawer
				selectedVenue={selectedVenue}
				isOpen={selectedVenue !== null}
				onClose={() => setSelectedVenue(null)}
				setSelectedVenue={setSelectedVenue}
				setSelectedEvent={setSelectedEvent}
			/>
		</DefaultLayout>
	);
};

export default HomePage;

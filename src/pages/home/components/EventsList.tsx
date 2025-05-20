import { Event } from '@/flux/api/event';
import React from 'react';
import { HoveredEvent, SelectedEvent, SelectedVenue } from '../home.page';
import EventCard from './EventCard';

interface EventsListProps {
	events?: Event[];
	setSelectedEvent: (event: SelectedEvent | null) => void;
	setHoveredEvent: (event: HoveredEvent | null) => void;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
}

const EventsList: React.FC<EventsListProps> = ({
	setSelectedEvent,
	setHoveredEvent,
	setSelectedVenue,
	events
}) => {
	return (
		<div className="flex flex-col p-8 bg-white dark:bg-neutral-950">
			{events && events.length > 0 ? (
				<div className="flex flex-col gap-4 w-full">
					{events.map((event) => (
						<EventCard
							key={event.event_uid}
							event={event}
							setHoveredEvent={setHoveredEvent}
							setSelectedEvent={setSelectedEvent}
							setSelectedVenue={setSelectedVenue}
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

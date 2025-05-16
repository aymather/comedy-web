import EventPage from '@/pages/event/event.page';
import HostPage from '@/pages/host/host.page';
import RoomPage from '@/pages/room/room.page';
import VenuePage from '@/pages/venue/venue.page';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/dashboard/dashboard.page';
import HomePage from './pages/home/home.page';
import ReviseEventsPage from './pages/revise-events/revise-events.page';
import TestPage from './pages/test/test.page';

function App() {
	return (
		<Routes>
			<Route element={<HomePage />} path="/" />
			<Route element={<HostPage />} path="/host/:host_uid" />
			<Route
				element={<VenuePage />}
				path="/host/:host_uid/venue/:venue_uid"
			/>
			<Route
				element={<RoomPage />}
				path="/host/:host_uid/venue/:venue_uid/room/:room_uid"
			/>
			<Route element={<EventPage />} path="/event/:event_uid" />

			{/* Admin Stuff */}
			<Route element={<ReviseEventsPage />} path="/revise-events" />

			{import.meta.env.VITE_IS_DEV && (
				<>
					<Route element={<DashboardPage />} path="/dashboard" />
					<Route element={<TestPage />} path="/test" />
					<Route
						element={<ReviseEventsPage />}
						path="/revise-events"
					/>
				</>
			)}
		</Routes>
	);
}

export default App;

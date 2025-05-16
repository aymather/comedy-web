import DefaultLayout from '@/layouts/default';
import { Button } from '@heroui/button';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Map } from 'lucide-react';
import { useState } from 'react';
import EventDatePickerControl from '../home/components/EventDatePickerControl';

type PageView = 'list' | 'map';

const TestPage = () => {
	const [view, setView] = useState<PageView>('list');
	const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));

	return (
		<DefaultLayout>
			<div className="flex flex-col h-full overflow-hidden">
				{/* <div className="py-6">Potential Header Content</div> */}
				<div className="flex flex-1 flex-col overflow-hidden h-full relative">
					<div className="flex flex-row h-full">
						<div
							className={`hidden md:flex flex-1 bg-red-500 ${view === 'map' ? '!flex' : ''}`}
						></div>
						<div
							className={`bg-blue-200 flex flex-1 flex-col overflow-y-auto pb-16 md:pb-0 ${view === 'map' ? 'hidden md:flex' : ''}`}
						>
							{Array.from({ length: 100 }).map((i, index) => {
								return (
									<div key={index}>
										<p>Hello World {index}</p>
									</div>
								);
							})}
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4 md:hidden">
						<Button
							startContent={<Map />}
							variant="shadow"
							color="default"
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
				<div className="py-6 md:py-12 border-t">
					<EventDatePickerControl
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default TestPage;

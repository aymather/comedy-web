import {
	Button,
	Calendar,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@heroui/react';
import {
	CalendarDate,
	getLocalTimeZone,
	isEqualDay,
	isToday,
	startOfWeek,
	today
} from '@internationalized/date';
import {
	CalendarDays as CalendarIcon,
	ChevronLeft,
	ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface EventDatePickerControlProps {
	selectedDate: CalendarDate;
	setSelectedDate: (date: CalendarDate) => void;
	forceMobileSize?: boolean;
}

const EventDatePickerControl: React.FC<EventDatePickerControlProps> = ({
	selectedDate,
	setSelectedDate,
	forceMobileSize = false
}) => {
	const tz = getLocalTimeZone();
	const todayDate = today(tz);
	const [weekStartDate, setWeekStartDate] = useState(() =>
		startOfWeek(selectedDate, 'en-US')
	);

	function getWeekDates(date: CalendarDate, locale = 'en-US') {
		const weekStart = startOfWeek(date, locale);
		return Array.from({ length: 7 }, (_, i) => weekStart.add({ days: i }));
	}

	const weekDates = getWeekDates(weekStartDate);

	// Arrow logic
	const canGoLeft = weekStartDate.compare(todayDate) > 0;
	const nextWeekStart = weekStartDate.add({ days: 7 });
	const prevWeekStart = weekStartDate.subtract({ days: 7 });

	return (
		<div className="flex flex-row items-center justify-center gap-1 md:gap-2">
			{/* Left Arrow */}
			<button
				onClick={() => canGoLeft && setWeekStartDate(prevWeekStart)}
				disabled={!canGoLeft}
				className={`${forceMobileSize ? 'w-6 h-6' : 'w-6 h-6 md:w-8 md:h-8'} flex items-center justify-center rounded-full transition-colors mr-2 ${!canGoLeft ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
				aria-label="Previous week"
			>
				<ChevronLeft
					className={`${forceMobileSize ? 'w-4 h-4' : 'w-4 h-4 md:w-6 md:h-6'}`}
				/>
			</button>

			{/* Week Dates */}
			{weekDates.map((date) => {
				const isSelected = isEqualDay(date, selectedDate);
				const isCurrent = isToday(date, tz);
				const isPast = date.compare(todayDate) < 0;
				let btnClass = '';
				let textClass = '';
				let disabled = false;

				if (isPast) {
					disabled = true;
					btnClass = '';
					textClass = 'text-gray-400 cursor-not-allowed';
				} else if (isCurrent) {
					if (isSelected) {
						btnClass = 'bg-red-500';
						textClass = 'text-white';
					} else {
						btnClass = 'hover:bg-red-500/20';
						textClass = 'text-red-500';
					}
				} else {
					if (isSelected) {
						btnClass = 'bg-blue-500';
						textClass = 'text-white';
					} else {
						btnClass = 'hover:bg-blue-500/20';
						textClass = 'text-black dark:text-white';
					}
				}

				const jsDate = date.toDate(tz);
				const weekday = true
					? new Intl.DateTimeFormat('en-US', {
							weekday: 'narrow'
						}).format(jsDate)
					: new Intl.DateTimeFormat('en-US', {
							weekday: 'short'
						})
							.format(jsDate)
							.toLowerCase();

				return (
					<div
						key={date.toString()}
						className="flex flex-col items-center"
					>
						<span className="text-[10px] md:text-xs mb-1 text-gray-400">
							{weekday}
						</span>
						<button
							onClick={() => {
								if (!disabled) setSelectedDate(date);
							}}
							disabled={disabled}
							className={`${forceMobileSize ? 'w-9 h-9 text-sm' : 'w-9 h-9 text-sm md:w-14 md:h-14 md:text-lg'} rounded-full flex items-center justify-center font-medium transition-colors ${btnClass} ${textClass}`}
						>
							{date.day}
						</button>
					</div>
				);
			})}

			{/* Right Arrow */}
			<button
				onClick={() => setWeekStartDate(nextWeekStart)}
				className={`${forceMobileSize ? 'w-6 h-6' : 'w-6 h-6 md:w-8 md:h-8'} flex items-center justify-center rounded-full transition-colors ml-2 hover:bg-gray-200 dark:hover:bg-gray-700`}
				aria-label="Next week"
			>
				<ChevronRight
					className={`${forceMobileSize ? 'w-4 h-4' : 'w-4 h-4 md:w-6 md:h-6'}`}
				/>
			</button>

			{/* Calendar Popover Button */}
			<div
				className={`${forceMobileSize ? 'hidden' : 'hidden md:block'}`}
			>
				<Popover placement="bottom">
					<PopoverTrigger>
						<Button
							isIconOnly
							variant="light"
							className="ml-4"
							aria-label="Open calendar"
						>
							<CalendarIcon
								size={22}
								className="text-default-500"
							/>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="bg-transparent border-none shadow-none">
						<Calendar
							showMonthAndYearPickers
							aria-label="Date (Max Date Value)"
							minValue={todayDate}
							value={selectedDate}
							onChange={(val) => {
								let newDate: CalendarDate | null = null;
								if (val?.constructor?.name === 'CalendarDate') {
									newDate = val;
								} else if (
									val &&
									'year' in val &&
									'month' in val &&
									'day' in val
								) {
									newDate = new CalendarDate(
										val.year,
										val.month,
										val.day
									);
								}
								if (newDate) {
									setSelectedDate(newDate);
									// If newDate is outside the current week, update weekStartDate
									const weekStart = startOfWeek(
										newDate,
										'en-US'
									);
									if (
										weekStartDate.compare(weekStart) !== 0
									) {
										setWeekStartDate(weekStart);
									}
								}
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

export default EventDatePickerControl;

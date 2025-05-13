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
	size?: 'md' | 'sm';
}

const EventDatePickerControl: React.FC<EventDatePickerControlProps> = ({
	selectedDate,
	setSelectedDate,
	size = 'md'
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

	const isThisWeek =
		weekStartDate.compare(startOfWeek(todayDate, 'en-US')) === 0;
	const isNextWeek =
		weekStartDate.compare(
			startOfWeek(todayDate, 'en-US').add({ days: 7 })
		) === 0;

	// Size-based styles
	const sizeStyles = {
		md: {
			dayButton: 'w-14 h-14 text-lg',
			arrowButton: 'w-8 h-8',
			weekday: 'text-xs',
			gap: 'gap-2',
			margin: 'my-2',
			label: 'text-xs'
		},
		sm: {
			dayButton: 'w-9 h-9 text-sm',
			arrowButton: 'w-6 h-6',
			weekday: 'text-[10px]',
			gap: 'gap-1',
			margin: 'my-1',
			label: 'text-xs'
		}
	}[size];

	return (
		<div>
			{/* Week label */}
			<div
				className={`${sizeStyles.label} text-default-400 text-center mb-4 font-medium select-none ${!(isThisWeek || isNextWeek) && 'text-transparent'}`}
			>
				{isThisWeek ? 'This Week' : 'Next Week'}
			</div>
			<div
				className={`flex flex-row items-center justify-center ${sizeStyles.gap} ${sizeStyles.margin}`}
			>
				{/* Left Arrow */}
				<button
					onClick={() => canGoLeft && setWeekStartDate(prevWeekStart)}
					disabled={!canGoLeft}
					className={`${sizeStyles.arrowButton} flex items-center justify-center rounded-full transition-colors mr-2 ${!canGoLeft ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
					aria-label="Previous week"
				>
					<ChevronLeft size={size === 'sm' ? 16 : 20} />
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
					const weekday =
						size === 'sm'
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
							<span
								className={`${sizeStyles.weekday} mb-1 text-gray-400`}
							>
								{weekday}
							</span>
							<button
								onClick={() => {
									if (!disabled) setSelectedDate(date);
								}}
								disabled={disabled}
								className={`${sizeStyles.dayButton} rounded-full flex items-center justify-center font-medium transition-colors ${btnClass} ${textClass}`}
							>
								{date.day}
							</button>
						</div>
					);
				})}

				{/* Right Arrow */}
				<button
					onClick={() => setWeekStartDate(nextWeekStart)}
					className={`${sizeStyles.arrowButton} flex items-center justify-center rounded-full transition-colors ml-2 hover:bg-gray-200 dark:hover:bg-gray-700`}
					aria-label="Next week"
				>
					<ChevronRight size={size === 'sm' ? 16 : 20} />
				</button>

				{/* Calendar Popover Button */}
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

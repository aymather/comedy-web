import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

export interface TimeComponents {
	years: number;
	months: number;
	weeks: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

declare module 'dayjs' {
	interface Dayjs {
		until(from?: dayjs.Dayjs): TimeComponents;
		untilFormatted(from?: dayjs.Dayjs): string;
		utc(): string;
	}
}

const untilPlugin = (_: any, dayjsClass: any) => {
	dayjsClass.prototype.until = function (from = dayjs()) {
		const diff = this.diff(from, 'seconds');
		const duration = dayjs.duration(Math.max(0, diff), 'seconds');

		const years = Math.floor(duration.asYears());
		const months = duration.months();
		const weeks = Math.floor((duration.days() % 30) / 7);
		const days = duration.days() % 7;
		const hours = duration.hours();
		const minutes = duration.minutes();
		const seconds = duration.seconds();

		return {
			years,
			months,
			weeks,
			days,
			hours,
			minutes,
			seconds
		};
	};

	dayjsClass.prototype.untilFormatted = function (from = dayjs()) {
		const timeComponents = this.until(from);
		const formatted = timeComponents
			? `${timeComponents.years ? timeComponents.years + 'y ' : ''}${
					timeComponents.months ? timeComponents.months + 'mo ' : ''
				}${timeComponents.weeks ? timeComponents.weeks + 'w ' : ''}${
					timeComponents.days ? timeComponents.days + 'd ' : ''
				}${timeComponents.hours ? timeComponents.hours + 'h ' : ''}${
					timeComponents.minutes ? timeComponents.minutes + 'm ' : ''
				}${timeComponents.seconds}s`
			: '0s';

		return formatted;
	};
};

const UTCPlugin = (_: any, dayjsClass: any) => {
	dayjsClass.prototype.utc = function () {
		return this.format('YYYY-MM-DDTHH:mm:ss[Z]');
	};
};

dayjs.extend(untilPlugin);
dayjs.extend(UTCPlugin);

export { dayjs };

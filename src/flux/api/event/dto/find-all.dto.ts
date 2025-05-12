import { NanoId } from '@/types';
import { Event } from '../event.entity';

export interface FindAllEventsQueryDto {
	host_uid?: NanoId;
	venue_uid?: NanoId;
	room_uid?: NanoId;
	date?: string;
}

export interface FindAllEventsResponseDto extends Array<Event> {}

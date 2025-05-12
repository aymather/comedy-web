import { NanoId } from '@/types';
import { Event } from '../event.entity';

export interface FindOneEventParamsDto {
	event_uid: NanoId;
}

export interface FindOneEventResponseDto extends Event {}

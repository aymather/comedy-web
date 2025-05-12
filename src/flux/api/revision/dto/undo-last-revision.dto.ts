import { NanoId } from '@/types';
import { Event } from '../../event/event.entity';

export interface UndoLastEventRevisionParamsDto {
	event_uid: NanoId;
}

export interface UndoLastEventRevisionResponseDto extends Event {}

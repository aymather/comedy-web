import { NanoId } from '@/types';

export interface FindNextEventToReviseResponseDto {
	event_uid: NanoId;
	numberOfEventsToRevise: number;
}

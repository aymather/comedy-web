import { NanoId } from '@/types';
import { Room } from '../room.entity';

export interface FindOneRoomParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
	room_uid: NanoId;
}

export interface FindOneRoomResponseDto extends Room {}

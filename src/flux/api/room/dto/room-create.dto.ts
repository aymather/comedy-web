import { NanoId } from '@/types';
import { Room } from '../room.entity';

export interface CreateRoomParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
}

export interface CreateRoomBodyDto {
	name: string;
}

export interface CreateRoomResponseDto extends Room {}

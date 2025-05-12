import { NanoId } from '@/types';
import { Room } from '../room.entity';

export interface UpdateRoomParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
	room_uid: NanoId;
}

export interface UpdateRoomBodyDto {
	name: string;
	description: string;
	profile_image_url: string;
}

export interface UpdateRoomResponseDto extends Room {}

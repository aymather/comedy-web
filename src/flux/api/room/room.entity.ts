import { NanoId } from '@/types';

export interface Room {
	readonly room_uid: NanoId;
	readonly name: string;
	readonly description: string | null;
	readonly profile_image_url: string | null;
}

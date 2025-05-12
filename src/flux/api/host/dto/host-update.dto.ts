import { NanoId } from '@/types';
import { Host } from '../host.entity';

export interface UpdateHostParamsDto {
	host_uid: NanoId;
}

export interface UpdateHostBodyDto {
	name: string;
	profile_image_url?: string;
	description?: string | null;
	website_url?: string | null;
	instagram_url?: string | null;
	tiktok_url?: string | null;
	facebook_url?: string | null;
	x_url?: string | null;
	youtube_url?: string | null;
	stage_image_url?: string | null;
}

export interface UpdateHostResponseDto extends Host {}

import { NanoId } from '@/types';
import { Host } from '../host.entity';

export interface FindOneHostParamsDto {
	host_uid: NanoId;
}

export interface FindOneHostResponseDto extends Host {}

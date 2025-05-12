import { Polygon } from '@react-google-maps/api';

export interface GetPlacePolygonBodyDto {
	readonly place_id: string;
}

export interface PlacePolygonResponseDto extends Polygon {}

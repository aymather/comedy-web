import { serviceApi } from '../base';
import {
	AutocompletePlaceBodyDto,
	AutocompletePlaceResponseDto
} from './dto/autocomplete-place.dto';
import {
	GetLocationDetailsByPlaceIdBodyDto,
	LocationDetailsByPlaceIdResponseDto
} from './dto/location-details-by-place-id.dto';
import {
	GetPlacePolygonBodyDto,
	PlacePolygonResponseDto
} from './dto/polygon.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		autocompletePlace: builder.query<
			AutocompletePlaceResponseDto,
			{
				body: AutocompletePlaceBodyDto;
			}
		>({
			query: ({ body }) => ({
				url: '/google-maps/autocomplete-place',
				method: 'POST',
				body
			})
		}),
		getLocationDetailsByPlaceId: builder.query<
			LocationDetailsByPlaceIdResponseDto,
			{
				body: GetLocationDetailsByPlaceIdBodyDto;
			}
		>({
			query: ({ body }) => ({
				url: '/google-maps/place-details',
				method: 'POST',
				body
			})
		}),
		getPolygonForPlace: builder.query<
			PlacePolygonResponseDto,
			{
				body: GetPlacePolygonBodyDto;
			}
		>({
			query: ({ body }) => ({
				url: '/google-maps/place-polygon',
				method: 'POST',
				body
			})
		})
	})
});

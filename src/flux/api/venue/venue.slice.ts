import { serviceApi } from '../base';
import {
	CreateVenueBodyDto,
	CreateVenueParamsDto,
	CreateVenueResponseDto
} from './dto/venue-create.dto';
import {
	DeleteVenueParamsDto,
	DeleteVenueResponseDto
} from './dto/venue-delete.dto';
import {
	FindOneVenueParamsDto,
	FindOneVenueResponseDto
} from './dto/venue-find-one.dto';
import {
	UpdateVenueBodyDto,
	UpdateVenueParamsDto,
	UpdateVenueResponseDto
} from './dto/venue-update.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		createVenue: builder.mutation<
			CreateVenueResponseDto,
			{
				params: CreateVenueParamsDto;
				body: CreateVenueBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue`,
				method: 'POST',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid }
			]
		}),
		findOneVenue: builder.query<
			FindOneVenueResponseDto,
			{ params: FindOneVenueParamsDto }
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}`
			}),
			providesTags: (result, error, { params }) => [
				{ type: 'Venue', id: params.venue_uid }
			]
		}),
		updateVenue: builder.mutation<
			UpdateVenueResponseDto,
			{ params: UpdateVenueParamsDto; body: UpdateVenueBodyDto }
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}`,
				method: 'PUT',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		}),
		deleteVenue: builder.mutation<
			DeleteVenueResponseDto,
			{ params: DeleteVenueParamsDto }
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid }
			]
		})
	})
});

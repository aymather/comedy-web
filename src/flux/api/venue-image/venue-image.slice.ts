import { serviceApi } from '../base';
import {
	CreateVenueImageBodyDto,
	CreateVenueImageParamsDto,
	CreateVenueImageResponseDto
} from './dto/venue-create.dto';
import {
	DeleteVenueImageParamsDto,
	DeleteVenueImageResponseDto
} from './dto/venue-delete.dto';
import {
	UpdateVenueImageBodyDto,
	UpdateVenueImageParamsDto,
	UpdateVenueImageResponseDto
} from './dto/venue-update.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		createVenueImage: builder.mutation<
			CreateVenueImageResponseDto,
			{
				params: CreateVenueImageParamsDto;
				body: CreateVenueImageBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/venue-image`,
				method: 'POST',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		}),
		updateVenueImage: builder.mutation<
			UpdateVenueImageResponseDto,
			{
				params: UpdateVenueImageParamsDto;
				body: UpdateVenueImageBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/venue-image/${params.venue_image_uid}`,
				method: 'PUT',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		}),
		deleteVenueImage: builder.mutation<
			DeleteVenueImageResponseDto,
			{ params: DeleteVenueImageParamsDto }
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/venue-image/${params.venue_image_uid}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		})
	})
});

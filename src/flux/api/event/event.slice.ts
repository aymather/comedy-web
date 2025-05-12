import { serviceApi } from '../base';
import { AddArtistParamsDto } from './dto/add-artist.dto';
import { DropArtistParamsDto } from './dto/drop-artist.dto';
import {
	FindAllEventsQueryDto,
	FindAllEventsResponseDto
} from './dto/find-all.dto';
import {
	FindOneEventParamsDto,
	FindOneEventResponseDto
} from './dto/find-one.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		findAllEvents: builder.query<
			FindAllEventsResponseDto,
			{
				params: FindAllEventsQueryDto;
			}
		>({
			query: ({ params }) => ({
				url: '/event',
				method: 'GET',
				params
			})
		}),
		findOneEvent: builder.query<
			FindOneEventResponseDto,
			{
				params: FindOneEventParamsDto;
			}
		>({
			query: ({ params }) => ({
				url: `/event/${params.event_uid}`,
				method: 'GET'
			}),
			providesTags: (result, error, { params }) => [
				{ type: 'Event', id: params.event_uid }
			]
		}),
		addArtist: builder.mutation<void, { params: AddArtistParamsDto }>({
			query: ({ params }) => ({
				url: `host/${params.host_uid}/venue/${params.venue_uid}/event/${params.event_uid}/artist/${params.artist_uid}`,
				method: 'POST'
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Event', id: params.event_uid }
			]
		}),
		dropArtist: builder.mutation<void, { params: DropArtistParamsDto }>({
			query: ({ params }) => ({
				url: `host/${params.host_uid}/venue/${params.venue_uid}/event/${params.event_uid}/artist/${params.artist_uid}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Event', id: params.event_uid }
			]
		})
	})
});

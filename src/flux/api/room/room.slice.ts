import { serviceApi } from '../base';
import {
	CreateRoomBodyDto,
	CreateRoomParamsDto,
	CreateRoomResponseDto
} from './dto/room-create.dto';
import {
	DeleteRoomParamsDto,
	DeleteRoomResponseDto
} from './dto/room-delete.dto';
import {
	FindOneRoomParamsDto,
	FindOneRoomResponseDto
} from './dto/room-find-one.dto';
import {
	UpdateRoomBodyDto,
	UpdateRoomParamsDto,
	UpdateRoomResponseDto
} from './dto/room-update.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		createRoom: builder.mutation<
			CreateRoomResponseDto,
			{
				params: CreateRoomParamsDto;
				body: CreateRoomBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/room`,
				method: 'POST',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		}),
		findOneRoom: builder.query<
			FindOneRoomResponseDto,
			{ params: FindOneRoomParamsDto }
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/room/${params.room_uid}`,
				method: 'GET'
			}),
			providesTags: (result, error, { params }) => [
				{ type: 'Room', id: params.room_uid }
			]
		}),
		updateRoom: builder.mutation<
			UpdateRoomResponseDto,
			{ params: UpdateRoomParamsDto; body: UpdateRoomBodyDto }
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/room/${params.room_uid}`,
				method: 'PUT',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid },
				{ type: 'Room', id: params.room_uid }
			]
		}),
		deleteRoom: builder.mutation<
			DeleteRoomResponseDto,
			{ params: DeleteRoomParamsDto }
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}/venue/${params.venue_uid}/room/${params.room_uid}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid },
				{ type: 'Venue', id: params.venue_uid }
			]
		})
	})
});

import { serviceApi } from '../base';
import { FindNextEventToReviseResponseDto } from './dto/find-next-event-to-revise.dto';
import { MarkEventAsRevisedParamsDto } from './dto/mark-event-as-revised.dto';
import { UndoLastEventRevisionResponseDto } from './dto/undo-last-revision.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		findNextEventToRevise: builder.query<
			FindNextEventToReviseResponseDto,
			void
		>({
			query: () => ({
				url: '/revision/event',
				method: 'GET'
			}),
			providesTags: [{ type: 'Revision', id: 'findNextEventToRevise' }]
		}),
		markEventAsRevised: builder.mutation<
			void,
			{ params: MarkEventAsRevisedParamsDto }
		>({
			query: ({ params }) => ({
				url: `/revision/event/${params.event_uid}/mark-as-revised`,
				method: 'PATCH'
			}),
			invalidatesTags: [{ type: 'Revision', id: 'findNextEventToRevise' }]
		}),
		undoLastEventRevision: builder.mutation<
			UndoLastEventRevisionResponseDto,
			void
		>({
			query: () => ({
				url: `/revision/event/undo-last-revision`,
				method: 'PATCH'
			}),
			invalidatesTags: [{ type: 'Revision', id: 'findNextEventToRevise' }]
		})
	})
});

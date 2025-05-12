import { configureStore } from '@reduxjs/toolkit';
import {
	TypedUseSelectorHook,
	useDispatch as useReduxDispatch,
	useSelector as useReduxSelector
} from 'react-redux';

import { serviceApi } from './api/base';

const store = configureStore({
	reducer: {
		[serviceApi.reducerPath]: serviceApi.reducer
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(serviceApi.middleware);
	}
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

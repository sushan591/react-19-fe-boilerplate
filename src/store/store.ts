import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "@/store/slice/auth.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here as needed
});

type RootReducerState = ReturnType<typeof rootReducer>;

const encryptKey = import.meta.env.VITE_PERSIST_ENCRYPT_KEY;

// Fail closed: if no encryption key is configured, do not persist auth
// state. Plaintext tokens in localStorage are worse than no persistence.
const persistConfig: PersistConfig<RootReducerState> = encryptKey
  ? {
      key: "root",
      version: 1,
      storage,
      whitelist: ["auth"],
      transforms: [
        encryptTransform({
          secretKey: encryptKey,
          onError: (error) => {
            // eslint-disable-next-line no-console
            console.error("Persist decrypt failed (key rotated?):", error);
          },
        }),
      ],
    }
  : {
      key: "root",
      version: 1,
      storage,
      whitelist: [],
    };

if (!encryptKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_PERSIST_ENCRYPT_KEY is not set — auth state will not be persisted across reloads.",
  );
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

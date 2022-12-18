import { PiniaPluginContext } from "pinia";
import { Storage } from "@ionic/storage";
import dayjs from "@/utils/dayjs";

export async function ionicStoragePlugin(context: PiniaPluginContext) {
  const { store } = context;

  const storage = new Storage();
  await storage.create();

  const key = `pinia:${store.$id}`;
  const state = await storage.get(key);

  if (state) {
    try {
      store.$patch(
        JSON.parse(state, (k, v) => {
          if (typeof v === "object" && v !== null) {
            if (v.dataType === "Map") {
              return new Map(v.value);
            }
          }

          if (k === "date" && dayjs(v).isValid()) {
            return dayjs(v);
          }

          return v;
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  store.$subscribe(async (_, state) => {
    try {
      const json = JSON.stringify(state, (_, v) => {
        if (v instanceof Map) {
          return {
            dataType: "Map",
            value: Array.from(v.entries()),
          };
        } else {
          return v;
        }
      });

      await storage.set(key, json);
    } catch (e) {
      console.error(e);
    }
  });
}

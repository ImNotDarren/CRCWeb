import BackgroundFetch from "react-native-background-fetch";
import { save } from "../localStorage";


/**
 * 
 * @param {Number} interval minutes
 * @param {Function} func data fetching logic
 */
const configureBackgroundFetch = (interval, fetchFunction) => {
  BackgroundFetch.configure({
    minimumFetchInterval: interval, // <-- minutes, e.g., 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  }, async () => {
    console.log("[BackgroundFetch] task started");
    // Your background task here
    // Fetch your data and save it using the saveData function
    const myData = await fetchFunction();
    await save('crcdata_locations', myData);

    // Call finish to signal completion of your task
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
  }, (error) => {
    console.error('[BackgroundFetch] failed to start', error);
  });
};

export { configureBackgroundFetch };
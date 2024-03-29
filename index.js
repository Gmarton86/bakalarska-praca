import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./src/App";
import PushNotification from "react-native-push-notification";
var SQLite = require("react-native-sqlite-storage");
// PushNotification.configure({
// onNotification: function (notification) {
//   console.log("NOTIFICATION:", notification);
// },
// requestPermissions: true,
// });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
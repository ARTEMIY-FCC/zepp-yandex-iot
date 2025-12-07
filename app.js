import "./shared/device-polyfill";
import { MessageBuilder } from "./shared/message";
import { getPackageInfo } from "@zos/app";
import * as ble from "@zos/ble";
import { log as Logger } from '@zos/utils'
import { LocalStorage } from '@zos/storage'

App({
  globalData: {
    messageBuilder: null,
    logger: null,
    localStorage: null
  },
  onCreate(options) {
    console.log("app on create invoke");

    const { appId } = getPackageInfo();

    const localStorage = new LocalStorage()
    this.globalData.localStorage = localStorage;

    const logger = Logger.getLogger("Yandex home");
    this.globalData.logger = logger;

    const messageBuilder = new MessageBuilder({
      appId,
      appDevicePort: 20,
      appSidePort: 0,
      ble,
    });
    this.globalData.messageBuilder = messageBuilder;
    messageBuilder.connect();

  },
  refreshData(){
    var oauth = this.globalData.localStorage.getItem('oauth');
    this.globalData.messageBuilder.request({
			method: "GET_DATA",
			oauth: oauth
		}).then(data => {
      console.log(data);
      this.globalData.localStorage.setItem('data', data)
		})
  },

  onDestroy(options) {
    console.log("app on destroy invoke");
    this.globalData.messageBuilder &&
      this.globalData.messageBuilder.disConnect();
  },
});

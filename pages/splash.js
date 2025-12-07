import * as hmUI from '@zos/ui'
import { replace } from '@zos/router'


const { localStorage, logger } = getApp()._options.globalData

Page({
    build() {
        hmUI.createWidget(hmUI.widget.IMG, {
            src: "icon.png",
            x: 176,
            y: 176,
        });

        var oauth = localStorage.getItem('oauth');
        if (oauth == null) {
            replace({
                url: 'pages/login'
            })
        } else {
            replace({
                url: 'pages/menu'
            })
        }
    },
    onInit() {
        logger.debug("splash onInit invoked");
    },

    onDestroy() {
        logger.debug("splash onDestroy invoked");
    },
});

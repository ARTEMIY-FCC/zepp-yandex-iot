import * as hmUI from '@zos/ui'
import { DEVICE_WIDTH } from "../utils/config/device"
import { replace } from '@zos/router'

const { logger, localStorage, messageBuilder } = getApp()._options.globalData

Page({
	build() {
		
	},
	onInit(params) {
		logger.debug("page onInit invoked");

		const paramsObj = JSON.parse(params)
		const { id } = paramsObj
        var oauth = localStorage.getItem('oauth');
		messageBuilder.request({
			method: "DEVICE_INFO",
			oauth: oauth,
			id: id

		}).then(data => {
			const jsonRpc = messageBuilder.buf2Json(data)
			
			hmUI.createWidget(hmUI.widget.TEXT, {
				x: 50,
				y: 32,
				w: DEVICE_WIDTH - 100,
				h: 64,
				color: 0xffffff,
				text_size: 36,
				align_h: hmUI.align.CENTER_H,
				align_v: hmUI.align.CENTER_V,
				text_style: hmUI.text_style.NONE,
				text: jsonRpc.name,
				font: 'font/font.ttf'
			}) 
			var vPos = 128;
			jsonRpc.capabilities.forEach(element => {

				if (element.type === "devices.capabilities.on_off") {
				
					hmUI.createWidget(hmUI.widget.TEXT, {
						x: 80,
						y: vPos,
						w: 220,
						h: 56,
						color: 0xffffff,
						text_size: 36,
						align_h: hmUI.align.LEFT,
						align_v: hmUI.align.CENTER_V,
						text_style: hmUI.text_style.NONE,
            font: 'font/font.ttf',
						text: element.state.instance
					})
					hmUI.createWidget(hmUI.widget.SLIDE_SWITCH, {
						x: 300,
						y: vPos,
						w: 96,
						h: 56,
						select_bg: 'switch/on.png',
						un_select_bg: 'switch/off.png',
						slide_src: 'switch/knob.png',
						slide_select_x: 48,
						slide_un_select_x: 8,
						slide_y: 0,
						checked: element.state.value,
						checked_change_func: (slideSwitch, checked) => {
							messageBuilder.request({
								method: "DEVICE_SET_CAPABILITY",
								oauth: oauth,
								id: id,
								type: element.type,
								instance: element.state.instance,
								value: checked
							}).then(data => {
								// replace({ 
								// 	url: 'pages/device_page',
								// 	params: {
								// 		id: id,
								// 	  }
								// })
							})
							
						}
					})
				  	vPos+=96
				}

			});

		})
		
	},

	onDestroy() {
		logger.debug("page onDestroy invoked");
	},
})

import { MessageBuilder } from '../shared/message-side'
import { YANDEX_OAUTH_CONFIG, DEVICE_AUTH_URL, validateConfig } from '../utils/config/yandex'

const messageBuilder = new MessageBuilder()

// Проверяем конфигурацию при инициализации
if (!validateConfig()) {
  throw new Error('Необходимо настроить Яндекс OAuth credentials')
}

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}


const delay = ms => new Promise(res => setTimeout(res, ms));

async function auth(ctx) {
	try {
			var resp = await fetch(YANDEX_OAUTH_CONFIG.ENDPOINTS.DEVICE_CODE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `client_id=${YANDEX_OAUTH_CONFIG.CLIENT_ID}`
	})
		var json = await resp.json()
		ctx.response({
			data: JSON.stringify(json),
		})
	} catch (error) {
	}
}

async function checkAuth(ctx, code) {
	try {
		await delay(2000)
			var resp = await fetch(YANDEX_OAUTH_CONFIG.ENDPOINTS.TOKEN, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `grant_type=device_code&client_id=${YANDEX_OAUTH_CONFIG.CLIENT_ID}&client_secret=${YANDEX_OAUTH_CONFIG.CLIENT_SECRET}&code=${code}`
	})
		var json = await resp.json()
		ctx.response({
			data: JSON.stringify(json),
		})
	} catch (error) {
	}
}

async function fetchData(ctx, oauth) {
	try {
			var resp = await fetch({
		url: YANDEX_OAUTH_CONFIG.ENDPOINTS.USER_INFO,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + oauth,
				'X-Request-Id': uuidv4()
			}
		})
		var json = await resp.json()
		json.devices.forEach(item => {
			delete item.capabilities;
			delete item.properties;
		});
		json.groups.forEach(item => {
			delete item.capabilities;
			delete item.properties;
		});
		delete json.households;
		delete json.rooms;
		ctx.response({
			data: JSON.stringify(json),
		})
	} catch (error) {
		ctx.response({
			data: JSON.stringify(error),
		})
	}
}


async function scenarioRun(ctx, id, oauth) {
	try {
			var resp = await fetch({
		url: `${YANDEX_OAUTH_CONFIG.ENDPOINTS.SCENARIOS}/${id}/actions`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + oauth,
				'X-Request-Id': uuidv4()
			}
		})
		var json = await resp.json()
		ctx.response({
			data: JSON.stringify(json),
		})

	} catch (error) {
		ctx.response({
			data: "Exception:" + JSON.stringify(error),
		})
	}
}

async function deviceInfo(ctx, oauth, id) {
	try {
			var resp = await fetch({
		url: `${YANDEX_OAUTH_CONFIG.ENDPOINTS.DEVICES}/${id}`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + oauth,
				'X-Request-Id': uuidv4()
			}
		})

		var json = await resp.json()
		ctx.response({
			data: JSON.stringify(json),
		})
	} catch (error) {
		ctx.response({
			data: JSON.stringify(error),
		})
	}
}

async function deviceSetCapability(ctx, oauth, id, type, instance, value) {
	try {
		var body = {
			devices: [{
				id: id,
				actions: [{
					type: type,
					state: {
						instance: instance,
						value: value
					}
				}]
			}]
		}
			var resp = await fetch({
		url: YANDEX_OAUTH_CONFIG.ENDPOINTS.DEVICE_ACTIONS,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + oauth,
				'X-Request-Id': uuidv4()
			},
			body: JSON.stringify(body)
		})

		var json = await resp.json()
		ctx.response({
			data: JSON.stringify(json),
		})
	} catch (error) {
		ctx.response({
			data: JSON.stringify(error),
		})
	}
}
	

AppSideService({
	onInit() {
		messageBuilder.listen(() => { })
		messageBuilder.on('request', this.onMessage)
	},
	onMessage(ctx){
		const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
		switch (jsonRpc.method) 
		{
			case "AUTH":
				auth(ctx);				
				break;

			case "CHECK_AUTH":
				checkAuth(ctx, jsonRpc.code);		
				break;

			case "GET_DATA":
				fetchData(ctx, jsonRpc.oauth);			
				break;

			case "SCENARIO_RUN":
				scenarioRun(ctx, jsonRpc.oauth, jsonRpc.id);			
				break;

			case "DEVICE_INFO":
				deviceInfo(ctx, jsonRpc.oauth, jsonRpc.id);			
				break;	

			case "DEVICE_SET_CAPABILITY":
				deviceSetCapability(ctx, jsonRpc.oauth, jsonRpc.id, jsonRpc.type, jsonRpc.instance, jsonRpc.value);			
				break;				
			default:
				break;
		}
	},

	onRun() {
	},

	onDestroy() {
	}
})

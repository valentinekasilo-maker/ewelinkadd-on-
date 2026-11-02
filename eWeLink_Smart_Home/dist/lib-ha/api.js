
function isDeviceOnline(dev) {
    if (!dev) return true;
    var entities = (dev.haDeviceData && dev.haDeviceData.entities) || [];
    if (!Array.isArray(entities) || entities.length === 0) return true;
    var primary = entities.find(function (e) {
        var d = (e.entityId || '').split('.')[0];
        return ['switch', 'light', 'cover', 'fan', 'lock', 'input_boolean'].indexOf(d) !== -1;
    }) || entities[0];
    var state = primary && primary.entityState && primary.entityState.state;
    return state !== 'unavailable' && state !== 'unknown';
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncHaDevice2Ck = exports.getHaDeviceList = exports.addHaGateway = void 0;
var coolkit_api_1 = __importDefault(require("coolkit-api"));
var coolkit_api_device_1 = __importDefault(require("coolkit-api-device"));
var init_1 = require("./init");
var app_1 = require("../config/app");
var lodash_1 = __importDefault(require("lodash"));
var dataUtil_1 = require("../utils/dataUtil");
var utils_1 = require("./utils");
var protocols_1 = require("./protocols");
var coolkit_ws_device_1 = __importDefault(require("coolkit-ws-device"));
var process_1 = __importDefault(require("process"));
var logger_1 = require("../utils/logger");
function addHaGateway(uniqueID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, coolkit_api_1.default.device.addThirdPartyDevice({
                        type: 23,
                        partnerDevice: [{
                                uniqueID: uniqueID
                            }]
                    })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.addHaGateway = addHaGateway;
function regHaGateway() {
    return __awaiter(this, void 0, void 0, function () {
        var res, apikey, deviceid, region, gwData, index, uuid4_fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('start regHaGateway()');
                    uuid4_fn = require('uuid').v4;
                    if (!init_1.curUserGwData.gwuuid) {
                        init_1.curUserGwData.gwuuid = uuid4_fn();
                    }
                    return [4, addHaGateway(init_1.curUserGwData.gwuuid)];
                case 1:
                    res = _a.sent();
                    if (res && res.error === 0) return [3, 3];
                    logger_1.logger.warn('addHaGateway with uuid ' + init_1.curUserGwData.gwuuid + ' failed: ' + (res ? res.msg : '') + '. Retrying with fresh uuid4...');
                    init_1.curUserGwData.gwuuid = uuid4_fn();
                    return [4, addHaGateway(init_1.curUserGwData.gwuuid)];
                case 2:
                    res = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(res && res.error === 0 && res.data && res.data.thingList && res.data.thingList[0])) return [3, 6];
                    apikey = lodash_1.default.get(res.data.thingList[0], 'itemData.devicekey');
                    deviceid = lodash_1.default.get(res.data.thingList[0], 'itemData.deviceid');
                    region = (0, dataUtil_1.getDataSync)('user.json', ['region']);
                    coolkit_api_device_1.default.init({
                        apikey: apikey,
                        appSecret: app_1.appSecret,
                        deviceid: deviceid,
                        region: region,
                        isDevice: true,
                        debug: true,
                        useTestEnv: process_1.default.env.CK_API_ENV === 'test'
                    });
                    init_1.curUserGwData.gwInList = true;
                    init_1.curUserGwData.gwApikey = apikey;
                    init_1.curUserGwData.gwDeviceid = deviceid;
                    logger_1.logger.info('Registered Gateway ' + deviceid + ', connecting WebSocket...');
                    (0, init_1.initWs2Ck)({ apikey: apikey, region: region, deviceid: deviceid }).catch(function(e) { logger_1.logger.error('regHaGateway WS error: ' + e); });
                    return [4, (0, dataUtil_1.getGwData)()];
                case 4:
                    gwData = _a.sent();
                    index = lodash_1.default.findIndex(gwData, { userApiKey: init_1.curUserGwData.userApiKey });
                    if (index !== -1) {
                        gwData[index] = init_1.curUserGwData;
                    } else {
                        gwData.push(init_1.curUserGwData);
                    }
                    return [4, (0, dataUtil_1.setGwData)(gwData)];
                case 5:
                    _a.sent();
                    logger_1.logger.info('end regHaGateway() - success');
                    return [2, 0];
                case 6:
                    logger_1.logger.error('regHaGateway error: addHaGateway failed with ' + JSON.stringify(res));
                    return [2, -1];
            }
        });
    });
}
function getHaDeviceList() {
    return __awaiter(this, void 0, void 0, function () {
        var haDeviceList, subDeviceListRes, subDeviceList, result, i, uiid, data, j, result, i, uiid, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('start getHaDeviceList()');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4, init_1.ws2ha.getHaDeviceEntityMap()];
                case 2:
                    haDeviceList = _a.sent();
                    if (!init_1.curUserGwData.gwInList) return [3, 4];
                    return [4, coolkit_api_device_1.default.getGateWayAndSubDevice()];
                case 3:
                    subDeviceListRes = _a.sent();
                    if (subDeviceListRes.error !== 0) {
                        logger_1.logger.warn('getGatewayAndSubDevice notice: error ' + subDeviceListRes.error + ' (' + (subDeviceListRes.msg || '') + '). Falling back gracefully.');
                        subDeviceList = [];
                    } else {
                        subDeviceList = (subDeviceListRes.data && subDeviceListRes.data.subDevicesInfo) || [];
                    }
                    result = [];
                    for (i = 0; i < haDeviceList.length; i++) {
                        uiid = (0, utils_1.getHaDeviceUiid)(haDeviceList[i]);
                        if (uiid === -1) {
                            continue;
                        }
                        else {
                            data = {
                                deviceUiid: uiid,
                                deviceNameHa: haDeviceList[i].deviceData.name,
                                deviceNameCk: '',
                                haDeviceId: haDeviceList[i].deviceId,
                                syncState: false,
                                haDeviceData: haDeviceList[i],
                                ckDeviceData: null
                            };
                            var prevSynced = (init_1.curUserGwData.syncDeviceData || []).find(function(s) {
                                return s && s.syncState && (s.haDeviceId === haDeviceList[i].deviceId || (s.haDeviceData && s.haDeviceData.deviceId === haDeviceList[i].deviceId));
                            });
                            if (prevSynced && prevSynced.ckDeviceData) {
                                data.deviceNameCk = prevSynced.deviceNameCk || prevSynced.deviceNameHa;
                                data.ckDeviceData = prevSynced.ckDeviceData;
                                data.syncState = true;
                            } else {
                                for (j = 0; j < subDeviceList.length; j++) {
                                    var subItem = subDeviceList[j].itemData || subDeviceList[j];
                                    if (!subItem) continue;
                                    var subUniqueId = (subItem.params && (subItem.params.uniqueID || (subItem.params.partnerDevice && subItem.params.partnerDevice.uniqueID))) || subItem.uniqueID;
                                    if (subUniqueId && subUniqueId === haDeviceList[i].deviceId) {
                                        data.deviceNameCk = subItem.name;
                                        data.ckDeviceData = subItem;
                                        data.syncState = true;
                                        break;
                                    }
                                }
                            }
                            result.push(data);
                        }
                    }
                    if (result.length !== 0) {
                        init_1.curUserGwData.syncDeviceData = result;
                    }
                    return [2, result];
                case 4:
                    result = [];
                    for (i = 0; i < haDeviceList.length; i++) {
                        uiid = (0, utils_1.getHaDeviceUiid)(haDeviceList[i]);
                        if (uiid === -1) {
                            continue;
                        }
                        else {
                            result.push({
                                deviceUiid: uiid,
                                deviceNameHa: haDeviceList[i].deviceData.name,
                                deviceNameCk: '',
                                haDeviceId: haDeviceList[i].deviceId,
                                syncState: false,
                                haDeviceData: haDeviceList[i],
                                ckDeviceData: null
                            });
                        }
                    }
                    if (result.length !== 0) {
                        init_1.curUserGwData.syncDeviceData = result;
                    }
                    logger_1.logger.info('end getHaDeviceList()');
                    return [2, result];
                case 5: return [3, 7];
                case 6:
                    err_1 = _a.sent();
                    logger_1.logger.error("getHaDeviceList error: ".concat(err_1));
                    return [2, []];
                case 7: return [2];
            }
        });
    });
}
exports.getHaDeviceList = getHaDeviceList;
function syncHaDevice2Ck(states) {
    return __awaiter(this, void 0, void 0, function () {
        var res, i, found, modelId, res, entities, online, params, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('start syncHaDevice2Ck()');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, , 14]);
                    if (!!init_1.curUserGwData.gwInList) return [3, 3];
                    return [4, regHaGateway()];
                case 2:
                    res = _a.sent();
                    if (res === -1) {
                        return [2, res];
                    }
                    _a.label = 3;
                case 3:
                    if (!(lodash_1.default.get(init_1.ws2ckRes, 'error') !== 0)) return [3, 5];
                    return [4, (0, init_1.initWs2Ck)({
                            apikey: init_1.curUserGwData.gwApikey,
                            region: (0, dataUtil_1.getDataSync)('user.json', ['region']),
                            deviceid: init_1.curUserGwData.gwDeviceid
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < states.length)) return [3, 12];
                    found = lodash_1.default.find(init_1.curUserGwData.syncDeviceData, { haDeviceId: states[i].haDeviceId });
                    modelId = (0, utils_1.getCkDeviceModelIdByUiid)(states[i].deviceUiid);
                    if (!states[i].state) return [3, 9];
                    if (!!found.ckDeviceData) {
                        var isOnlineNow = isDeviceOnline(found);
                        (0, init_1.setCkDeviceOnlineState)({
                            subDevId: found.haDeviceData.deviceId,
                            uiid: found.deviceUiid,
                            deviceid: found.ckDeviceData.deviceid,
                            online: isOnlineNow
                        });
                        var currentParams = (0, protocols_1.initDeviceParams)(found);
                        if (currentParams) {
                            coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                                action: 'update',
                                apikey: init_1.curUserGwData.userApiKey,
                                deviceid: found.ckDeviceData.deviceid,
                                userAgent: 'device',
                                sequence: Date.now().toString(),
                                params: currentParams
                            }));
                            coolkit_api_device_1.default.updateSubDevice({
                                deviceid: found.ckDeviceData.deviceid,
                                params: Object.assign({}, currentParams, { online: isOnlineNow })
                            }).catch(function() {});
                        }
                        return [3, 8];
                    }
                    return [4, coolkit_api_device_1.default.addSubDevice({
                            type: 2,
                            subDevices: [
                                {
                                    name: (found.deviceNameHa || (found.haDeviceData && found.haDeviceData.deviceData && found.haDeviceData.deviceData.name) || 'HA Device'),
                                    productModelId: modelId,
                                    deviceParams: {
                                        uniqueID: found.haDeviceData.deviceId
                                    }
                                }
                            ]
                        })];
                case 7:
                    res = _a.sent();
                    var syncThing = (res && res.data && res.data.thingList && res.data.thingList[0])
                        || (res && res.data && res.data.subDevices && res.data.subDevices[0])
                        || (res && res.data && res.data.subDevicesInfo && res.data.subDevicesInfo[0])
                        || (res && res.data && Array.isArray(res.data) && res.data[0]);
                    var syncItemData = (syncThing && syncThing.itemData) || syncThing;
                    var createdDevId = (syncItemData && (syncItemData.deviceid || syncItemData.id)) || (res && res.data && res.data.deviceid);
                    if (res.error !== 0 || !createdDevId) {
                        states[i].state = false;
                    }
                    else {
                        found.ckDeviceData = syncItemData || { deviceid: createdDevId };
                        if (!found.ckDeviceData.deviceid) found.ckDeviceData.deviceid = createdDevId;
                        found.syncState = true;
                        online = isDeviceOnline(found);
                        params = (0, protocols_1.initDeviceParams)(found);
                        (0, init_1.setCkDeviceOnlineState)({
                            subDevId: found.haDeviceData ? found.haDeviceData.deviceId : createdDevId,
                            uiid: found.deviceUiid,
                            deviceid: createdDevId,
                            online: online,
                            params: params
                        });
                        coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                            action: 'update',
                            apikey: init_1.curUserGwData.userApiKey,
                            deviceid: createdDevId,
                            userAgent: 'device',
                            params: Object.assign({}, params, { online: online })
                        }));
                    }
                    return [3, 8];
                case 8: return [3, 11];
                case 9: return [4, coolkit_api_device_1.default.deleteSubDevice(found.ckDeviceData.deviceid)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    i++;
                    return [3, 6];
                case 12:
                    logger_1.logger.info('end syncHaDevice2Ck()');
                    return [2, states];
                case 13:
                    err_2 = _a.sent();
                    logger_1.logger.error("syncHaDevice2Ck error: ".concat(err_2));
                    return [2, -1];
                case 14: return [2];
            }
        });
    });
}
exports.syncHaDevice2Ck = syncHaDevice2Ck;


function ensureGatewayReady() {
    return __awaiter(this, void 0, void 0, function () {
        var region, gwKey, pingRes, devListRes, devList, i, it, isGw, devKey, devId, regRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!init_1.curUserGwData) return [2, false];
                    region = (0, dataUtil_1.getDataSync)('user.json', ['region']);
                    gwKey = init_1.curUserGwData.gwApikey || init_1.curUserGwData.userApiKey || (0, dataUtil_1.getDataSync)('user.json', ['user', 'apikey']);
                    if (init_1.curUserGwData.gwDeviceid && gwKey) {
                        coolkit_api_device_1.default.init({
                            apikey: gwKey,
                            appSecret: app_1.appSecret,
                            deviceid: init_1.curUserGwData.gwDeviceid,
                            region: region,
                            isDevice: true,
                            debug: true,
                            useTestEnv: process_1.default.env.CK_API_ENV === 'test'
                        });
                        return [4, coolkit_api_device_1.default.getGateWayAndSubDevice()];
                    }
                    return [3, 2];
                case 1:
                    pingRes = _a.sent();
                    if (pingRes && pingRes.error === 0) {
                        init_1.curUserGwData.gwInList = true;
                        logger_1.logger.info('Verified existing Virtual Gateway ' + init_1.curUserGwData.gwDeviceid + ' in CoolKit');
                        return [3, 5];
                    }
                    logger_1.logger.warn('Gateway test failed (' + (pingRes ? pingRes.error : '') + '), searching account for active gateway...');
                    _a.label = 2;
                case 2:
                    return [4, coolkit_api_1.default.device.getThingList({ num: 0 })];
                case 3:
                    devListRes = _a.sent();
                    if (devListRes && devListRes.error === 0 && devListRes.data && devListRes.data.thingList) {
                        devList = devListRes.data.thingList;
                        for (i = 0; i < devList.length; i++) {
                            it = devList[i].itemData;
                            if (!it) continue;
                            isGw = (it.extra && it.extra.uiid === 23) || it.uiid === 23 || (it.params && it.params.partnerDevice) || ((it.name || '').toLowerCase().includes('gateway'));
                            if (isGw) {
                                devKey = it.devicekey;
                                devId = it.deviceid;
                                if (devKey && devId) {
                                    logger_1.logger.info('Adopting account Virtual Gateway: ' + devId + ' (' + it.name + ')');
                                    init_1.curUserGwData.gwDeviceid = devId;
                                    init_1.curUserGwData.gwApikey = devKey;
                                    init_1.curUserGwData.gwInList = true;
                                    coolkit_api_device_1.default.init({
                                        apikey: devKey,
                                        appSecret: app_1.appSecret,
                                        deviceid: devId,
                                        region: region,
                                        isDevice: true,
                                        debug: true,
                                        useTestEnv: process_1.default.env.CK_API_ENV === 'test'
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    if (init_1.curUserGwData.gwInList && init_1.curUserGwData.gwDeviceid) return [3, 5];
                    logger_1.logger.info('No gateway found. Calling regHaGateway...');
                    return [4, regHaGateway()];
                case 4:
                    regRes = _a.sent();
                    if (regRes === -1) {
                        logger_1.logger.error('ensureGatewayReady: regHaGateway failed');
                        return [2, false];
                    }
                    _a.label = 5;
                case 5:
                    region = (0, dataUtil_1.getDataSync)('user.json', ['region']);
                    gwKey = init_1.curUserGwData.gwApikey || init_1.curUserGwData.userApiKey;
                    if (coolkit_ws_device_1.default.isWsExist() && lodash_1.default.get(init_1.ws2ckRes, 'error') === 0) return [2, true];
                    try {
                        coolkit_ws_device_1.default.close();
                    } catch(e) {}
                    logger_1.logger.info('Connecting WS for Gateway deviceid=' + init_1.curUserGwData.gwDeviceid);
                    return [4, (0, init_1.initWs2Ck)({
                        apikey: gwKey,
                        region: region,
                        deviceid: init_1.curUserGwData.gwDeviceid
                    })];
                case 6:
                    _a.sent();
                    return [2, true];
            }
        });
    });
}

function syncAllHaDevices() {
    return __awaiter(this, void 0, void 0, function () {
        var gwOk, list, toSync, i, dev, res, online, params, refreshedCount, err_syncAll;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4, ensureGatewayReady()];
                case 1:
                    gwOk = _a.sent();
                    if (!gwOk) logger_1.logger.warn('ensureGatewayReady returned false, proceeding with device discovery');
                    return [4, getHaDeviceList()];
                case 2:
                    list = _a.sent();
                    if (!Array.isArray(list)) list = [];
                    toSync = [];
                    refreshedCount = 0;
                    for (i = 0; i < list.length; i++) {
                        dev = list[i];
                        if (!dev.syncState && dev.deviceUiid !== -1) {
                            toSync.push({
                                haDeviceId: dev.haDeviceId,
                                deviceUiid: dev.deviceUiid,
                                state: true
                            });
                        } else if (dev.syncState && dev.ckDeviceData) {
                            online = isDeviceOnline(dev);
                            (0, init_1.setCkDeviceOnlineState)({
                                subDevId: dev.haDeviceData.deviceId,
                                uiid: dev.deviceUiid,
                                deviceid: dev.ckDeviceData.deviceid,
                                online: online
                            });
                            params = (0, protocols_1.initDeviceParams)(dev);
                            if (params) {
                                // 1. Send WebSocket update
                                coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                                    action: 'update',
                                    apikey: init_1.curUserGwData.userApiKey,
                                    deviceid: dev.ckDeviceData.deviceid,
                                    userAgent: 'device',
                                    sequence: Date.now().toString(),
                                    params: params
                                }));
                                // 2. Send REST PUT updateSubDevice
                                coolkit_api_device_1.default.updateSubDevice({
                                    deviceid: dev.ckDeviceData.deviceid,
                                    params: Object.assign({}, params, { online: online })
                                }).catch(function() {});
                            }
                            refreshedCount++;
                        }
                    }
                    if (toSync.length > 0) {
                        logger_1.logger.info('Syncing ' + toSync.length + ' HA devices to eWeLink (and refreshed ' + refreshedCount + ' devices online)...');
                        return [4, syncHaDevice2Ck(toSync)];
                    }
                    return [2, { error: 0, msg: 'Refreshed online state for ' + refreshedCount + ' devices', count: refreshedCount }];
                case 3:
                    res = _a.sent();
                    return [2, { error: 0, msg: 'Synced ' + toSync.length + ' devices (and refreshed ' + refreshedCount + ' online)', count: toSync.length + refreshedCount, data: res }];
                case 4:
                    return [3, 6];
                case 5:
                    err_syncAll = _a.sent();
                    logger_1.logger.error('syncAllHaDevices error: ' + err_syncAll);
                    return [2, { error: 500, msg: 'syncAllHaDevices error: ' + (err_syncAll.message || err_syncAll) }];
                case 6:
                    return [2];
            }
        });
    });
}
exports.syncAllHaDevices = syncAllHaDevices;

var autoSyncEnabled = true;
function getAutoSyncState() {
    return autoSyncEnabled;
}
exports.getAutoSyncState = getAutoSyncState;
function setAutoSyncState(val) {
    autoSyncEnabled = !!val;
    logger_1.logger.info('AutoSync state set to: ' + autoSyncEnabled);
}
exports.setAutoSyncState = setAutoSyncState;

var autoSyncTimer = null;
function startAutoSyncLoop() {
    if (autoSyncTimer) return;
    logger_1.logger.info('eWeLink Auto-Sync service initiated (interval: 60s)');
    autoSyncTimer = setInterval(function () {
        try {
            if (autoSyncEnabled && init_1.curUserGwData && init_1.curUserGwData.gwInList) {
                syncAllHaDevices().catch(function(e) {
                    logger_1.logger.error('autoSync background error: ' + e);
                });
            }
        } catch(e) {
            logger_1.logger.error('autoSync exception: ' + e);
        }
    }, 60000);
}
exports.startAutoSyncLoop = startAutoSyncLoop;

// Automatically start background sync loop
setTimeout(startAutoSyncLoop, 15000);


var syncStatus = {
    inProgress: false,
    current: 0,
    total: 0,
    synced: 0,
    msg: '',
    error: 0
};

function getSyncStatus() {
    return syncStatus;
}
exports.getSyncStatus = getSyncStatus;

function runSyncAllWorker() {
    return __awaiter(this, void 0, void 0, function () {
        var gwOk, list, toSync, i, dev, refreshedCount, k, item, found, modelId, addRes, thing, itemData, newDevId, isOnline, devParams, finalGwData, fIdx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    syncStatus.msg = 'Checking virtual gateway...';
                    return [4, ensureGatewayReady()];
                case 1:
                    gwOk = _a.sent();
                    if (!gwOk) {
                        logger_1.logger.error('Gateway not ready, aborting background sync');
                        syncStatus.inProgress = false;
                        syncStatus.error = 500;
                        syncStatus.msg = 'Gateway connection failed: check eWeLink credentials';
                        return [2];
                    }
                    syncStatus.msg = 'Fetching Home Assistant devices...';
                    return [4, getHaDeviceList()];
                case 2:
                    list = _a.sent();
                    if (!Array.isArray(list)) list = [];
                    toSync = [];
                    refreshedCount = 0;
                    for (i = 0; i < list.length; i++) {
                        dev = list[i];
                        if (!dev.syncState && dev.deviceUiid !== -1) {
                            toSync.push({
                                haDeviceId: dev.haDeviceId,
                                deviceUiid: dev.deviceUiid,
                                state: true
                            });
                        } else if (dev.syncState && dev.ckDeviceData) {
                            isOnline = isDeviceOnline(dev);
                            (0, init_1.setCkDeviceOnlineState)({
                                subDevId: dev.haDeviceData.deviceId,
                                uiid: dev.deviceUiid,
                                deviceid: dev.ckDeviceData.deviceid,
                                online: isOnline
                            });
                            devParams = (0, protocols_1.initDeviceParams)(dev);
                            if (devParams) {
                                coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                                    action: 'update',
                                    apikey: init_1.curUserGwData.userApiKey,
                                    deviceid: dev.ckDeviceData.deviceid,
                                    userAgent: 'device',
                                    sequence: Date.now().toString(),
                                    params: devParams
                                }));
                                coolkit_api_device_1.default.updateSubDevice({
                                    deviceid: dev.ckDeviceData.deviceid,
                                    params: Object.assign({}, devParams, { online: isOnline })
                                }).catch(function() {});
                            }
                            refreshedCount++;
                        }
                    }
                    syncStatus.total = toSync.length;
                    logger_1.logger.info('Background sync: ' + toSync.length + ' new devices to sync (and ' + refreshedCount + ' refreshed)');
                    if (toSync.length === 0) {
                        syncStatus.inProgress = false;
                        syncStatus.msg = 'Refreshed online state for ' + refreshedCount + ' devices';
                        return [2];
                    }
                    k = 0;
                    _a.label = 3;
                case 3:
                    if (!(k < toSync.length)) return [3, 8];
                    syncStatus.current = k + 1;
                    syncStatus.msg = 'Syncing ' + (k + 1) + '/' + toSync.length;
                    item = toSync[k];
                    found = lodash_1.default.find(init_1.curUserGwData.syncDeviceData, { haDeviceId: item.haDeviceId });
                    if (!found) return [3, 7];
                    modelId = (0, utils_1.getCkDeviceModelIdByUiid)(item.deviceUiid);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, coolkit_api_device_1.default.addSubDevice({
                        type: 2,
                        subDevices: [
                            {
                                name: (found.deviceNameHa || (found.haDeviceData && found.haDeviceData.deviceData && found.haDeviceData.deviceData.name) || 'HA Device'),
                                productModelId: modelId,
                                deviceParams: {
                                    uniqueID: found.haDeviceData.deviceId
                                }
                            }
                        ]
                    })];
                case 5:
                    addRes = _a.sent();
                    logger_1.logger.info('addSubDevice raw res for ' + found.haDeviceId + ': ' + JSON.stringify(addRes));
                    thing = (addRes && addRes.data && addRes.data.thingList && addRes.data.thingList[0])
                         || (addRes && addRes.data && addRes.data.subDevices && addRes.data.subDevices[0])
                         || (addRes && addRes.data && addRes.data.subDevicesInfo && addRes.data.subDevicesInfo[0])
                         || (addRes && addRes.data && Array.isArray(addRes.data) && addRes.data[0]);
                    itemData = (thing && thing.itemData) || thing;
                    newDevId = (itemData && (itemData.deviceid || itemData.id)) || (addRes && addRes.data && addRes.data.deviceid);
                    if (addRes && (addRes.error === 0 || !addRes.error) && newDevId) {
                        found.ckDeviceData = itemData || { deviceid: newDevId };
                        if (!found.ckDeviceData.deviceid) found.ckDeviceData.deviceid = newDevId;
                        found.deviceNameCk = found.ckDeviceData.name || found.deviceNameHa;
                        found.syncState = true;
                        syncStatus.synced++;
                        isOnline = isDeviceOnline(found);
                        devParams = (0, protocols_1.initDeviceParams)(found);
                        (0, init_1.setCkDeviceOnlineState)({
                            subDevId: found.haDeviceData ? found.haDeviceData.deviceId : newDevId,
                            uiid: found.deviceUiid,
                            deviceid: newDevId,
                            online: isOnline,
                            params: devParams
                        });
                        devParams = (0, protocols_1.initDeviceParams)(found);
                        if (devParams) {
                            coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                                action: 'update',
                                apikey: init_1.curUserGwData.userApiKey,
                                deviceid: newDevId,
                                userAgent: 'device',
                                sequence: Date.now().toString(),
                                params: devParams
                            }));
                            coolkit_api_device_1.default.updateSubDevice({
                                deviceid: newDevId,
                                params: Object.assign({}, devParams, { online: isOnline })
                            }).catch(function() {});
                        }
                    } else {
                        logger_1.logger.warn('Failed to add sub-device ' + found.haDeviceId + ': ' + JSON.stringify(addRes));
                    }
                    return [3, 7];
                case 6:
                    var errDev = _a.sent();
                    logger_1.logger.error('Error adding device ' + found.haDeviceId + ': ' + errDev);
                    return [3, 7];
                case 7:
                    k++;
                    if (k % 10 === 0 || k === toSync.length) {
                        (0, dataUtil_1.getGwData)().then(function(gd) {
                            var idx = lodash_1.default.findIndex(gd, { userApiKey: init_1.curUserGwData.userApiKey });
                            if (idx !== -1) {
                                gd[idx] = init_1.curUserGwData;
                                (0, dataUtil_1.setGwData)(gd);
                            }
                        }).catch(function() {});
                    }
                    return [3, 3];
                case 8:
                    syncStatus.inProgress = false;
                    syncStatus.msg = 'Successfully synced ' + syncStatus.synced + '/' + toSync.length + ' devices!';
                    logger_1.logger.info(syncStatus.msg);
                    return [4, (0, dataUtil_1.getGwData)()];
                case 9:
                    finalGwData = _a.sent();
                    fIdx = lodash_1.default.findIndex(finalGwData, { userApiKey: init_1.curUserGwData.userApiKey });
                    if (fIdx !== -1) {
                        finalGwData[fIdx] = init_1.curUserGwData;
                        return [4, (0, dataUtil_1.setGwData)(finalGwData)];
                    }
                    return [3, 11];
                case 10:
                    _a.sent();
                    return [3, 11];
                case 11:
                    return [3, 13];
                case 12:
                    var errTotal = _a.sent();
                    logger_1.logger.error('runSyncAllWorker failed: ' + errTotal);
                    syncStatus.inProgress = false;
                    syncStatus.error = 500;
                    syncStatus.msg = 'Sync error: ' + (errTotal.message || errTotal);
                    return [3, 13];
                case 13:
                    return [2];
            }
        });
    });
}

function startBackgroundSyncAll() {
    if (syncStatus.inProgress) {
        return { error: 0, inProgress: true, msg: 'Sync already in progress (' + syncStatus.current + '/' + syncStatus.total + ')', current: syncStatus.current, total: syncStatus.total };
    }
    syncStatus.inProgress = true;
    syncStatus.current = 0;
    syncStatus.total = 0;
    syncStatus.synced = 0;
    syncStatus.msg = 'Starting background sync...';
    syncStatus.error = 0;

    setTimeout(function() {
        runSyncAllWorker().catch(function(e) {
            logger_1.logger.error('runSyncAllWorker error: ' + e);
            syncStatus.inProgress = false;
            syncStatus.error = 500;
            syncStatus.msg = 'Sync error: ' + (e.message || e);
        });
    }, 10);

    return { error: 0, inProgress: true, msg: 'Sync started in background', current: 0, total: 0 };
}
exports.startBackgroundSyncAll = startBackgroundSyncAll;

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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCkDeviceOnlineState = exports.initWs2Ck = exports.ws2ckRes = exports.curUserGwData = exports.ws2ha = exports.init = exports.closeWs2Ck = void 0;
var WebSocket2Ha_1 = require("./WebSocket2Ha");
var dataUtil_1 = require("../utils/dataUtil");
var coolkit_api_1 = __importDefault(require("coolkit-api"));
var coolkit_api_device_1 = __importDefault(require("coolkit-api-device"));
var lodash_1 = __importDefault(require("lodash"));
var app_1 = require("../config/app");
var coolkit_ws_device_1 = __importDefault(require("coolkit-ws-device"));
var protocols_1 = require("./protocols");
var eventBus_1 = __importDefault(require("../utils/eventBus"));
var process_1 = __importDefault(require("process"));
var logger_1 = require("../utils/logger");
var api_1 = require("./api");
var uuid4 = require('uuid').v4;
var WS_ONLINE = 2;
var WS_OFFLINE = 3;
var ws2ha;
exports.ws2ha = ws2ha;
var curUserGwData = null;
exports.curUserGwData = curUserGwData;
var ws2ckRes;
exports.ws2ckRes = ws2ckRes;
function setCkDeviceOnlineState(_a) {
    var subDevId = _a.subDevId, uiid = _a.uiid, deviceid = _a.deviceid, online = _a.online, params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            var gwId = (curUserGwData && curUserGwData.gwDeviceid) || '';
            var uKey = (curUserGwData && curUserGwData.userApiKey) || (0, dataUtil_1.getDataSync)('user.json', ['user', 'apikey']) || '';
            var gKey = (curUserGwData && curUserGwData.gwApikey) || uKey;
            var effectiveSubDevId = subDevId || deviceid;
            var deviceParams = params || { switch: 'on' };
            logger_1.logger.info('setCkDeviceOnlineState: subdevice ' + deviceid + ' -> ' + (online ? 'ONLINE' : 'OFFLINE') + ' (gw: ' + gwId + ')');
            try {
                var cmds = [
                    {
                        uiid: uiid,
                        type: online ? WS_ONLINE : WS_OFFLINE,
                        subDevId: deviceid,
                        subDeviceId: deviceid,
                        deviceid: deviceid
                    },
                    {
                        uiid: uiid,
                        type: online ? WS_ONLINE : WS_OFFLINE,
                        subDevId: effectiveSubDevId,
                        subDeviceId: effectiveSubDevId,
                        deviceid: deviceid
                    }
                ];
                if (online && deviceParams) {
                    cmds.push({
                        uiid: uiid,
                        type: 0,
                        subDevId: deviceid,
                        subDeviceId: deviceid,
                        deviceid: deviceid,
                        params: deviceParams
                    });
                }
                var subDevMsgGw = JSON.stringify({
                    action: 'subDevice',
                    apikey: gKey,
                    deviceid: gwId,
                    userAgent: 'device',
                    sequence: Date.now().toString(),
                    params: { cmds: cmds }
                });
                coolkit_ws_device_1.default.sendMessage(subDevMsgGw);
                if (uKey && uKey !== gKey) {
                    var subDevMsgUser = JSON.stringify({
                        action: 'subDevice',
                        apikey: uKey,
                        deviceid: gwId,
                        userAgent: 'device',
                        sequence: (Date.now() + 1).toString(),
                        params: { cmds: cmds }
                    });
                    coolkit_ws_device_1.default.sendMessage(subDevMsgUser);
                }
                var updatePayload = Object.assign({}, deviceParams, { online: !!online });
                coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                    action: 'update',
                    apikey: uKey,
                    deviceid: deviceid,
                    userAgent: 'device',
                    sequence: (Date.now() + 2).toString(),
                    params: updatePayload
                }));
            } catch(e) {
                logger_1.logger.warn('setCkDeviceOnlineState WS error: ' + e);
            }
            try {
                coolkit_api_device_1.default.updateSubDevice({
                    deviceid: deviceid,
                    params: Object.assign({}, deviceParams, { online: !!online })
                }).catch(function() {});
            } catch(e) {}
            try {
                if (coolkit_api_1.default && coolkit_api_1.default.device && coolkit_api_1.default.device.updateThingStatus) {
                    coolkit_api_1.default.device.updateThingStatus({
                        type: 2,
                        id: deviceid,
                        params: Object.assign({}, deviceParams, { online: !!online })
                    }).catch(function() {});
                }
            } catch(e) {}
            return [2];
        });
    });
}
exports.setCkDeviceOnlineState = setCkDeviceOnlineState;
function handleDeleteGateway() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exports.curUserGwData = curUserGwData = [];
                    return [4, (0, dataUtil_1.setGwData)([])];
                case 1:
                    _a.sent();
                    closeWs2Ck();
                    init();
                    setTimeout(function () {
                        eventBus_1.default.emit('sse-update-ha-device');
                    }, 1000);
                    return [2];
            }
        });
    });
}
function initWs2Ck(_a) {
    var apikey = _a.apikey, region = _a.region, deviceid = _a.deviceid;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info('Init websocket to CK...');
                    logger_1.logger.verbose("apikey: ".concat(apikey));
                    return [4, coolkit_ws_device_1.default.init({
                            userAgent: 'device',
                            apikey: apikey,
                            region: region,
                            deviceid: deviceid,
                            useTestEnv: process_1.default.env.CK_API_ENV === 'test',
                            debug: true
                        })];
                case 1:
                    exports.ws2ckRes = ws2ckRes = _b.sent();
                    coolkit_ws_device_1.default.on('message', function (e) {
                        try {
                            var msg = JSON.parse(e.data);
                            if (msg.action === 'update') {
                                (0, protocols_1.handleCkWsUpdateMessage)(msg);
                            }
                            else if (msg.action === 'notify' && msg.cmd === 'deleteNotify') {
                                handleDeleteGateway();
                            }
                        }
                        catch (err) {
                        }
                    });
                    return [2];
            }
        });
    });
}
exports.initWs2Ck = initWs2Ck;
function closeWs2Ck() {
    if (coolkit_ws_device_1.default.isWsExist()) {
        coolkit_ws_device_1.default.close();
        ws2ckRes.error = -1;
    }
}
exports.closeWs2Ck = closeWs2Ck;
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var userData, userApiKey, gwData, gwuuid, found, data, deviceListRes, deviceList, newGwData, index, i, userGwuuid, apikey, deviceid, region, devList, devList_1, devList_1_1, dev, entities, online, params;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info('Start init lib-ha...');
                    if (!lodash_1.default.get(ws2ha, 'connected')) {
                        exports.ws2ha = ws2ha = new WebSocket2Ha_1.WebSocket2Ha();
                    }
                    return [4, (0, dataUtil_1.initLibHaFiles)()];
                case 1:
                    _b.sent();
                    userData = (0, dataUtil_1.getDataSync)('user.json', ['user']);
                    if (!userData) {
                        return [2];
                    }
                    userApiKey = userData.apikey;
                    return [4, (0, dataUtil_1.getGwData)()];
                case 2:
                    gwData = _b.sent();
                    gwuuid = uuid4();
                    if (!!(found = lodash_1.default.find(gwData, { userApiKey: userApiKey }))) return [3, 4];
                    data = {
                        userApiKey: userData.apikey,
                        gwuuid: gwuuid,
                        gwInList: false,
                    };
                    gwData.push(data);
                    exports.curUserGwData = curUserGwData = data;
                    return [4, (0, dataUtil_1.setGwData)(gwData)];
                case 3:
                    _b.sent();
                    return [3, 5];
                case 4:
                    exports.curUserGwData = curUserGwData = found;
                    _b.label = 5;
                case 5: return [4, coolkit_api_1.default.device.getThingList({ num: 0 })];
                case 6:
                    deviceListRes = _b.sent();
                    if (deviceListRes.error !== 0) {
                        return [2];
                    }
                    deviceList = deviceListRes.data.thingList;
                    return [4, (0, dataUtil_1.getGwData)()];
                case 7:
                    newGwData = _b.sent();
                    index = lodash_1.default.findIndex(newGwData, { userApiKey: userApiKey });
                    var bestGw = null;
                    var bestScore = -1;
                    for (i = 0; i < deviceList.length; i++) {
                        var it = deviceList[i].itemData || deviceList[i];
                        if (!it) continue;
                        var uiid = lodash_1.default.get(it, 'extra.uiid') || lodash_1.default.get(it, 'uiid');
                        var nameLower = (it.name || '').toLowerCase();
                        var model = lodash_1.default.get(it, 'extra.model') || '';
                        var isGw = uiid === 20000 || uiid === 23 || model === 'HA_Gateway' || model === 'NON-OTA-GL' || (it.params && it.params.partnerDevice) || nameLower.includes('device00') || nameLower.includes('gateway');
                        if (isGw) {
                            var score = 0;
                            var devId = lodash_1.default.get(it, 'deviceid') || '';
                            if (devId === 'abf800656b') {
                                score += 100000;
                            }
                            var subCount = (it.subDevices && it.subDevices.length) || (it.params && it.params.subDevices && it.params.subDevices.length) || 0;
                            score += subCount * 10;
                            var currentUuid = lodash_1.default.get(it, 'params.partnerDevice.ezVedioSerial') || lodash_1.default.get(it, 'params.partnerDevice.uniqueID');
                            if (currentUuid && currentUuid === newGwData[index].gwuuid) {
                                score += 500;
                            }
                            if (score > bestScore || !bestGw) {
                                bestScore = score;
                                bestGw = it;
                            }
                        }
                    }
                    if (bestGw) {
                        apikey = lodash_1.default.get(bestGw, 'devicekey');
                        deviceid = lodash_1.default.get(bestGw, 'deviceid');
                        region = (0, dataUtil_1.getDataSync)('user.json', ['region']);
                        userGwuuid = lodash_1.default.get(bestGw, 'params.partnerDevice.ezVedioSerial') || lodash_1.default.get(bestGw, 'params.partnerDevice.uniqueID') || newGwData[index].gwuuid;
                        logger_1.logger.info('Auto-adopted Main Virtual Gateway: ' + deviceid + ' (' + bestGw.name + ') [Score: ' + bestScore + ']');
                        coolkit_api_device_1.default.init({
                            apikey: apikey,
                            appSecret: app_1.appSecret,
                            deviceid: deviceid,
                            region: region,
                            isDevice: true,
                            debug: true,
                            useTestEnv: process_1.default.env.CK_API_ENV === 'test'
                        });
                        newGwData[index].gwuuid = userGwuuid;
                        newGwData[index].gwInList = true;
                        newGwData[index].gwApikey = apikey;
                        newGwData[index].gwDeviceid = deviceid;
                    } else {
                        newGwData[index].gwInList = false;
                    }
                    exports.curUserGwData = curUserGwData = newGwData[index];
                    return [4, (0, dataUtil_1.setGwData)(newGwData)];
                case 8:
                    _b.sent();
                    if (!(curUserGwData.gwInList && (!coolkit_ws_device_1.default.isWsExist() || lodash_1.default.get(ws2ckRes, 'error') !== 0))) return [3, 11];
                    return [4, initWs2Ck({
                            apikey: curUserGwData.gwApikey,
                            region: (0, dataUtil_1.getDataSync)('user.json', ['region']),
                            deviceid: curUserGwData.gwDeviceid
                        })];
                case 9:
                    _b.sent();
                    return [4, (0, api_1.getHaDeviceList)()];
                case 10:
                    devList = _b.sent();
                    if (devList !== -1) {
                        try {
                            for (devList_1 = __values(devList), devList_1_1 = devList_1.next(); !devList_1_1.done; devList_1_1 = devList_1.next()) {
                                dev = devList_1_1.value;
                                if (dev.ckDeviceData) {
                                    entities = dev.haDeviceData.entities;
                                    online = true;
                                    var primary = (entities || []).find(function (e) { var d = (e.entityId || '').split('.')[0]; return ['switch', 'light', 'cover', 'fan', 'lock', 'input_boolean'].indexOf(d) !== -1; }) || (entities && entities[0]);
                                    if (primary && primary.entityState && (primary.entityState.state === 'unavailable' || primary.entityState.state === 'unknown')) {
                                        online = false;
                                    }
                                    setCkDeviceOnlineState({
                                        subDevId: dev.haDeviceData.deviceId,
                                        uiid: dev.deviceUiid,
                                        deviceid: dev.ckDeviceData.deviceid,
                                        online: online
                                    });
                                    params = (0, protocols_1.initDeviceParams)(dev);
                                    coolkit_ws_device_1.default.sendMessage(JSON.stringify({
                                        action: 'update',
                                        apikey: curUserGwData.userApiKey,
                                        deviceid: dev.ckDeviceData.deviceid,
                                        userAgent: 'device',
                                        params: params
                                    }));
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (devList_1_1 && !devList_1_1.done && (_a = devList_1.return)) _a.call(devList_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    _b.label = 11;
                case 11: return [2];
            }
        });
    });
}
exports.init = init;

var gwWatchdogTimer = null;
function broadcastAllSubDevicesOnline() {
    try {
        if (!curUserGwData || !curUserGwData.syncDeviceData || !Array.isArray(curUserGwData.syncDeviceData)) return;
        var syncedList = curUserGwData.syncDeviceData.filter(function(d) { return d.syncState && d.ckDeviceData; });
        if (syncedList.length === 0) return;
        logger_1.logger.info('Broadcasting ONLINE keepalive for ' + syncedList.length + ' synced sub-devices...');
        for (var i = 0; i < syncedList.length; i++) {
            var dev = syncedList[i];
            var devParams = (0, protocols_1.initDeviceParams)(dev);
            var isOnline = (0, api_1.isDeviceOnline)(dev);
            setCkDeviceOnlineState({
                subDevId: dev.haDeviceData ? dev.haDeviceData.deviceId : dev.ckDeviceData.deviceid,
                uiid: dev.deviceUiid,
                deviceid: dev.ckDeviceData.deviceid,
                online: isOnline,
                params: devParams
            });
        }
    } catch(err) {
        logger_1.logger.error('broadcastAllSubDevicesOnline error: ' + err);
    }
}
exports.broadcastAllSubDevicesOnline = broadcastAllSubDevicesOnline;

function startGwWatchdog() {
    if (gwWatchdogTimer) return;
    logger_1.logger.info('eWeLink Virtual Gateway Watchdog started (interval: 25s)');
    gwWatchdogTimer = setInterval(function() {
        try {
            if (!curUserGwData || !curUserGwData.gwInList || !curUserGwData.gwDeviceid) return;
            var isWsAlive = coolkit_ws_device_1.default && coolkit_ws_device_1.default.isWsExist();
            if (!isWsAlive) {
                var region = (0, dataUtil_1.getDataSync)('user.json', ['region']);
                var gwKey = curUserGwData.gwApikey || curUserGwData.userApiKey;
                logger_1.logger.warn('Gateway WS dropped! Reconnecting watchdog for deviceid=' + curUserGwData.gwDeviceid);
                initWs2Ck({ apikey: gwKey, region: region, deviceid: curUserGwData.gwDeviceid })
                    .then(function() {
                        logger_1.logger.info('Gateway WS restored by watchdog!');
                        setTimeout(broadcastAllSubDevicesOnline, 2000);
                    })
                    .catch(function(e) {
                        logger_1.logger.error('Watchdog reconnect error: ' + e);
                    });
            }
        } catch(err) {
            logger_1.logger.error('Watchdog exception: ' + err);
        }
    }, 25000);

    // Also run periodic keepalive every 60s
    setInterval(function() {
        if (coolkit_ws_device_1.default && coolkit_ws_device_1.default.isWsExist()) {
            broadcastAllSubDevicesOnline();
        }
    }, 60000);
}
exports.startGwWatchdog = startGwWatchdog;
setTimeout(startGwWatchdog, 10000);

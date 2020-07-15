// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { apkPath, apkVersionName } = require('accessibility-insights-for-android-service-bin');
const cloneDeep = require('lodash/cloneDeep');
const path = require('path');

const successfulTestServerContentPath = path.join(
    __dirname,
    '../mock-service-for-android/AccessibilityInsights',
);

const devicesCommandMatch = 'devices';
const serviceInfoCommandMatch =
    'shell dumpsys package com.microsoft.accessibilityinsightsforandroidservice';
const serviceIsRunningCommandMatch = 'shell dumpsys accessibility';
const portForwardingCommandMatch = 'forward tcp:';

function addInstallServiceCommands(id, output) {
    // These commands appear in the order that they get called
    output[`-s ${id} shell getprop ro.build.version.sdk`] = {
        stdout: '29',
    };
    output[`-s ${id} shell getprop ro.build.version.release`] = {
        stdout: '10',
    };
    output[`-s ${id} help`] = {
        stdout: '--streaming: force streaming APK directly into Package Manager',
    };
    output[`-s ${id} features`] = {
        stdout:
            'abb_exec\nfixed_push_symlink_timestamp\nabb\nstat_v2\napex\nshell_v2\nfixed_push_mkdir\ncmd',
    };
    output[`-s ${id} shell ls -t -1 /data/local/tmp/appium_cache 2>&1 || echo _ERROR_`] = {
        stdout: '',
    };
    output[`-s ${id} mkdir -p /data/local/tmp/appium_cache`] = {
        stdout: '',
        exitCode: 0,
    };
    const fullLocalPathToApk = path.join(
        __dirname,
        '../../../../drop/electron/unified-dev/product/android-service/android-service.apk', // Future PR: Use regex, especially for hash!
    );
    output[
        `-s ${id} push ${fullLocalPathToApk} /data/local/tmp/appium_cache/b9bb63afe96d3f7ca079fd18a82b1be5e4bb59e1.apk`
    ] = {
        stdout:
            'C:\\Users\\dtryon\\source\\repos\\AIWeb\\MyF...ed. 32.0 MB/s (181531 bytes in 0.005s)',
    };
    output[`-s ${id} install -r ${fullLocalPathToApk}`] = {
        stdout: 'Performing Streamed Install\nSuccess\n',
    };
}

function workingDeviceCommands(deviceIds, port) {
    const output = {
        'start-server': {},
        devices: {
            stdout: 'List of devices attached\n',
        },
    };

    for (const id of deviceIds) {
        const type = id.startsWith('emulator') ? 'emulator' : 'device';
        output.devices.stdout += `${id}\t${type}\n`;
    }

    for (const id of deviceIds) {
        output[`-s ${id} ${devicesCommandMatch}`] = cloneDeep(output.devices);
        output[`-s ${id} shell getprop ro.product.model`] = {
            stdout: `working mock device (${id})`,
        };
        output[`-s ${id} ${serviceInfoCommandMatch}`] = {
            stdout: `    versionCode=102000 minSdk=24 targetSdk=28\n    versionName=${apkVersionName}`,
        };

        addInstallServiceCommands(id, output);

        output[`-s ${id} ${serviceIsRunningCommandMatch}`] = {
            stdout:
                '                     Service[label=Accessibility Insights for…, feedbackType[FEEDBACK_SPOKEN, FEEDBACK_HAPTIC, FEEDBACK_AUDIBLE, FEEDBACK_VISUAL, FEEDBACK_GENERIC, FEEDBACK_BRAILLE], capabilities=1, eventTypes=TYPES_ALL_MASK, notificationTimeout=0]}',
        };
        output[`-s ${id} shell dumpsys media_projection`] = {
            stdout:
                '(com.microsoft.accessibilityinsightsforandroidservice, uid=12354): TYPE_SCREEN_CAPTURE',
        };
        output[`-s ${id} ${portForwardingCommandMatch}${port} tcp:62442`] = {
            startTestServer: {
                port,
                path: successfulTestServerContentPath,
            },
        };
        output[`-s ${id} forward --remove tcp:${port}`] = {
            stopTestServer: { port },
        };
    }

    return output;
}

function delayAllCommands(delayMs, commands) {
    const output = cloneDeep(commands);
    for (const commandConfig of Object.values(output)) {
        commandConfig.delayMs = delayMs;
    }
    return output;
}

function cloneWithDisabledPattern(oldConfig, keyPatternToDisable) {
    const regex = new RegExp(keyPatternToDisable);
    const newConfig = {};

    for (const key in oldConfig) {
        if (regex.test(key)) {
            newConfig[key] = {
                stderr: 'Disabled by test config',
            };
        } else {
            newConfig[key] = oldConfig[key];
        }
    }

    return newConfig;
}

function simulateNoDevices(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, devicesCommandMatch + '$');
}

function simulateServiceNotInstalled(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, serviceInfoCommandMatch + '$');
}

function simulateServiceLacksPermissions(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, serviceIsRunningCommandMatch);
}

function simulatePortForwardingError(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, portForwardingCommandMatch);
}

module.exports = {
    commonAdbConfigs: {
        'single-device': workingDeviceCommands(['device-1'], 62442),
        'multiple-devices': workingDeviceCommands(['device-1', 'device-2', 'emulator-3'], 62442),
        'slow-single-device': delayAllCommands(5000, workingDeviceCommands(['device-1'], 62442)),
    },
    simulateNoDevices,
    simulateServiceNotInstalled,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
};

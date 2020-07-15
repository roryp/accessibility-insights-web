// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata, TargetAppData } from 'common/types/store-data/unified-data-interface';
import { createDeviceNameItemInfo } from 'electron/views/report/unified-details-section';

describe('UnifiedDetailsSection', () => {
    const deviceName = 'connected device';
    const appName = 'app name';

    it('createDeviceNameItemInfo gets correct info', () => {
        const targetAppInfo = {
            name: appName,
        } as TargetAppData;
        const scanMetadata = {
            targetAppInfo,
            deviceName,
        } as ScanMetadata;
        const expectedResult = {
            label: 'connected device name:',
            content: `${deviceName} - ${appName}`,
        };

        const actualResult = createDeviceNameItemInfo(scanMetadata);

        expect(actualResult).toEqual(expectedResult);
    });
});

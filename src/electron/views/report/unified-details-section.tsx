// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import {
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';

export function createDeviceNameItemInfo(scanMetadata: ScanMetadata): ScanDetailInfo {
    return {
        label: 'connected device name:',
        content: `${scanMetadata.deviceName} - ${scanMetadata.targetAppInfo.name}`,
    };
}

export const UnifiedDetailsSection = makeDetailsSectionFC(createDeviceNameItemInfo);

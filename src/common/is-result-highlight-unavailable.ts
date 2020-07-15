// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    PlatformData,
    UnifiedResult,
    ViewPortProperties,
} from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/android-scan-results';

export type IsResultHighlightUnavailable = (
    result: UnifiedResult,
    platformInfo: PlatformData,
) => boolean;

export const isResultHighlightUnavailableUnified: IsResultHighlightUnavailable = (
    result,
    platformInfo,
) => {
    if (
        platformInfo == null ||
        result.descriptors.boundingRectangle == null ||
        !hasValidBoundingRectangle(result.descriptors.boundingRectangle, platformInfo.viewPortInfo)
    ) {
        return true;
    }

    return false;
};

function hasValidBoundingRectangle(
    boundingRectangle: BoundingRectangle,
    viewPort: ViewPortProperties,
): boolean {
    return !(
        boundingRectangle.right <= 0 ||
        boundingRectangle.bottom <= 0 ||
        boundingRectangle.left > viewPort.width ||
        boundingRectangle.top > viewPort.height
    );
}

export const isResultHighlightUnavailableWeb: IsResultHighlightUnavailable = () => false;

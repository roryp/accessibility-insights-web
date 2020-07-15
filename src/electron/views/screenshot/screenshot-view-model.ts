// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';

export type HighlightBoxViewModel = {
    resultUid: string;
    left: string;
    top: string;
    width: string;
    height: string;
};

export type ScreenshotViewModel = {
    // "screenshotData == null" means that the view should show a "screenshot unavailable" message
    screenshotData?: ScreenshotData;
    highlightBoxViewModels: HighlightBoxViewModel[];
};

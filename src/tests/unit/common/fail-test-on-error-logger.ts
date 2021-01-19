// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { inspect } from 'util';
import { Logger } from 'common/logging/logger';

export const failTestOnErrorLogger: Logger = {
    log: () => {
        // intentionally ignored
    },
    error: (message?: string, ...optionalParams: any[]) => {
        expect(
            `FailTestOnErrorLogger.error invoked with "${message}" ${inspect(optionalParams)}`,
        ).toBe('FailTestOnErrorLogger.error never invoked');
    },
};

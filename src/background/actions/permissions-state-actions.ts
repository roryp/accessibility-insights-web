// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { Action } from 'common/flux/action';

export class PermissionsStateActions {
    public readonly getCurrentState = new Action<void>();
    public readonly setPermissionsState = new Action<SetAllUrlsPermissionStatePayload>();
}

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { HeaderIcon, HeaderIconDeps } from 'common/components/header-icon';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
} from 'common/components/telemetry-permission-dialog';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { AndroidSetupStepContainer } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-container';
import * as React from 'react';
import { DeviceStoreData } from '../../../flux/types/device-store-data';
import { WindowTitle, WindowTitleDeps } from '../../common/window-title/window-title';
import { AndroidSetupPageDeps } from './android-setup/android-setup-types';
import { DeviceConnectBody, DeviceConnectBodyDeps } from './device-connect-body';
import * as styles from './device-connect-view-container.scss';

export type DeviceConnectViewContainerDeps = TelemetryPermissionDialogDeps &
    DeviceConnectBodyDeps &
    WindowTitleDeps &
    HeaderIconDeps &
    AndroidSetupPageDeps;

export type DeviceConnectViewContainerProps = {
    deps: DeviceConnectViewContainerDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    deviceStoreData: DeviceStoreData;
    windowStateStoreData: WindowStateStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    androidSetupStoreData: AndroidSetupStoreData;
};

export const DeviceConnectViewContainer = NamedFC<DeviceConnectViewContainerProps>(
    'DeviceConnectViewContainer',
    props => {
        return (
            <div className={styles.windowContainer}>
                <WindowTitle
                    pageTitle={'Connect to your Android device'}
                    deps={props.deps}
                    windowStateStoreData={props.windowStateStoreData}
                >
                    <HeaderIcon invertColors deps={props.deps} />
                </WindowTitle>
                <div className={styles.contentScrollContainer}>
                    <div className={styles.contentContainer}>
                        <FlaggedComponent
                            featureFlagStoreData={props.featureFlagStoreData}
                            deps={props.deps}
                            featureFlag={UnifiedFeatureFlags.adbSetupView}
                            enableJSXElement={<AndroidSetupStepContainer {...props} />}
                            disableJSXElement={productionDeviceConnectBody(props)}
                        ></FlaggedComponent>
                        <TelemetryPermissionDialog
                            deps={props.deps}
                            isFirstTime={props.userConfigurationStoreData.isFirstTime}
                        />
                    </div>
                </div>
            </div>
        );
    },
);

const productionDeviceConnectBody = (props: DeviceConnectViewContainerProps) => {
    return (
        <DeviceConnectBody
            deps={props.deps}
            viewState={{
                deviceConnectState: props.deviceStoreData.deviceConnectState,
                connectedDevice: props.deviceStoreData.connectedDevice,
            }}
        />
    );
};

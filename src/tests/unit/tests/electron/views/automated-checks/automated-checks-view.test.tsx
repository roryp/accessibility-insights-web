// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardSelectionViewData,
    getCardSelectionViewData,
    ResultsHighlightStatus,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    CardRuleResult,
    CardRuleResultsByStatus,
    CardsViewModel,
} from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    PlatformData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import {
    AutomatedChecksView,
    AutomatedChecksViewProps,
} from 'electron/views/automated-checks/automated-checks-view';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { screenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

describe('AutomatedChecksView', () => {
    describe.each`
        adbSetupViewFeatureFlag
        ${true}
        ${false}
    `(
        'renders with adbSetupViewFeatureFlag=$adbSetupViewFeatureFlag',
        ({ adbSetupViewFeatureFlag }) => {
            let bareMinimumProps: AutomatedChecksViewProps;
            let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;

            beforeEach(() => {
                isResultHighlightUnavailableStub = () => null;
                bareMinimumProps = {
                    deps: {
                        windowStateActionCreator: Mock.ofType(WindowStateActionCreator).object,
                        scanActionCreator: Mock.ofType(ScanActionCreator).object,
                        isResultHighlightUnavailable: isResultHighlightUnavailableStub,
                    },
                    scanStoreData: {},
                    deviceStoreData: {
                        port: 62442,
                        connectedDevice: 'Device name from deviceStoreData',
                    },
                    androidSetupStoreData: {
                        scanPort: 63000,
                        selectedDevice: {
                            friendlyName: 'Device name from androidSetupStoreData',
                        },
                    },
                    detailsViewStoreData: {
                        currentPanel: { isSettingsOpen: false },
                    },
                    windowStateStoreData: 'window state store data' as any,
                    featureFlagStoreData: {
                        [UnifiedFeatureFlags.adbSetupView]: adbSetupViewFeatureFlag,
                    } as FeatureFlagStoreData,
                } as AutomatedChecksViewProps;
            });

            const scanStatuses = [
                undefined,
                ScanStatus[ScanStatus.Scanning],
                ScanStatus[ScanStatus.Failed],
            ];

            it.each(scanStatuses)('when status scan <%s>', scanStatusName => {
                bareMinimumProps.scanStoreData.status = ScanStatus[scanStatusName];

                const wrapped = shallow(<AutomatedChecksView {...bareMinimumProps} />);
                expect(wrapped.getElement()).toMatchSnapshot();
            });

            it('when status scan <Completed>', () => {
                const cardSelectionStoreData = {} as CardSelectionStoreData;
                const resultsHighlightStatus = {
                    'highlighted-uid-1': 'visible',
                    'not-highlighted-uid-1': 'hidden',
                } as ResultsHighlightStatus;
                const timeStampStub = 'test timestamp';
                const toolDataStub: ToolData = {
                    applicationProperties: { name: 'some app' },
                } as ToolData;

                const cardSelectionViewDataStub = {
                    resultsHighlightStatus: resultsHighlightStatus,
                } as CardSelectionViewData;
                const rulesStub = [{ description: 'test-rule-description' } as UnifiedRule];
                const resultsStub = [
                    { uid: 'highlighted-uid-1' },
                    { uid: 'not-highlighted-uid-1' },
                ] as UnifiedResult[];
                const unifiedScanResultStoreData: UnifiedScanResultStoreData = {
                    targetAppInfo: {
                        name: 'test-target-app-name',
                    },
                    rules: rulesStub,
                    results: resultsStub,
                    toolInfo: toolDataStub,
                    timestamp: timeStampStub,
                    platformInfo: {
                        deviceName: 'TEST DEVICE',
                    } as PlatformData,
                };

                const ruleResultsByStatusStub = {
                    fail: [{ id: 'test-fail-id' } as CardRuleResult],
                } as CardRuleResultsByStatus;
                const cardsViewData = {
                    cards: ruleResultsByStatusStub,
                } as CardsViewModel;
                const screenshotViewModelStub = {
                    screenshotData: {
                        base64PngData: 'this should appear in snapshotted ScreenshotView props',
                    },
                } as ScreenshotViewModel;
                const screenshotViewModelProviderMock = Mock.ofInstance(
                    screenshotViewModelProvider,
                );
                const getCardSelectionViewDataMock = Mock.ofInstance(getCardSelectionViewData);
                const getUnifiedRuleResultsMock = Mock.ofInstance(getCardViewData);

                const props: AutomatedChecksViewProps = {
                    deps: {
                        scanActionCreator: Mock.ofType(ScanActionCreator).object,
                        getCardsViewData: getUnifiedRuleResultsMock.object,
                        getCardSelectionViewData: getCardSelectionViewDataMock.object,
                        screenshotViewModelProvider: screenshotViewModelProviderMock.object,
                        isResultHighlightUnavailable: isResultHighlightUnavailableStub,
                    },
                    cardSelectionStoreData,
                    deviceStoreData: {},
                    androidSetupStoreData: {},
                    scanStoreData: {
                        status: ScanStatus.Completed,
                    },
                    userConfigurationStoreData: {
                        isFirstTime: false,
                    },
                    detailsViewStoreData: {
                        currentPanel: {},
                    },
                    unifiedScanResultStoreData,
                    featureFlagStoreData: {
                        [UnifiedFeatureFlags.adbSetupView]: adbSetupViewFeatureFlag,
                    } as FeatureFlagStoreData,
                } as AutomatedChecksViewProps;

                getCardSelectionViewDataMock
                    .setup(getData =>
                        getData(
                            cardSelectionStoreData,
                            unifiedScanResultStoreData,
                            isResultHighlightUnavailableStub,
                        ),
                    )
                    .returns(() => cardSelectionViewDataStub)
                    .verifiable(Times.once());

                getUnifiedRuleResultsMock
                    .setup(getter => getter(rulesStub, resultsStub, cardSelectionViewDataStub))
                    .returns(() => cardsViewData)
                    .verifiable(Times.once());

                screenshotViewModelProviderMock
                    .setup(provider => provider(unifiedScanResultStoreData, ['highlighted-uid-1']))
                    .returns(() => screenshotViewModelStub)
                    .verifiable(Times.once());

                const wrapped = shallow(<AutomatedChecksView {...props} />);

                expect(wrapped.getElement()).toMatchSnapshot();

                getCardSelectionViewDataMock.verifyAll();
                getUnifiedRuleResultsMock.verifyAll();
                screenshotViewModelProviderMock.verifyAll();
            });
        },
    );

    it('triggers scan when first mounted (non-adbSetupView)', () => {
        const port = 11111;

        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(port)).verifiable(Times.once());

        const props: AutomatedChecksViewProps = {
            deps: {
                scanActionCreator: scanActionCreatorMock.object,
            },
            scanStoreData: {},
            deviceStoreData: {
                port,
            },
            detailsViewStoreData: {
                currentPanel: {},
            },
            featureFlagStoreData: {
                [UnifiedFeatureFlags.adbSetupView]: false,
            } as FeatureFlagStoreData,
        } as AutomatedChecksViewProps;

        shallow(<AutomatedChecksView {...props} />);

        scanActionCreatorMock.verifyAll();
    });

    it('triggers scan when first mounted (adbSetupView)', () => {
        const scanPort = 11111;

        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(scanPort)).verifiable(Times.once());

        const props: AutomatedChecksViewProps = {
            deps: {
                scanActionCreator: scanActionCreatorMock.object,
            },
            scanStoreData: {},
            androidSetupStoreData: {
                scanPort,
            },
            detailsViewStoreData: {
                currentPanel: {},
            },
            featureFlagStoreData: {
                [UnifiedFeatureFlags.adbSetupView]: true,
            } as FeatureFlagStoreData,
        } as AutomatedChecksViewProps;

        shallow(<AutomatedChecksView {...props} />);

        scanActionCreatorMock.verifyAll();
    });

    describe('DeviceDisconnectedPopup event handlers', () => {
        it('onRescanDevice (non-adbSetupView)', () => {
            const port = 11111;

            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                deviceStoreData: {
                    port,
                },
                detailsViewStoreData: {
                    currentPanel: {},
                },
                featureFlagStoreData: {
                    [UnifiedFeatureFlags.adbSetupView]: false,
                } as FeatureFlagStoreData,
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            scanActionCreatorMock.reset(); // this mock is used on componentDidMount, which is not in the scope of this unit test

            wrapped.find(DeviceDisconnectedPopup).prop('onRescanDevice')();

            scanActionCreatorMock.verify(creator => creator.scan(port), Times.once());
        });

        it('onRescanDevice (adbSetupView)', () => {
            const scanPort = 11111;

            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                androidSetupStoreData: {
                    scanPort,
                },
                detailsViewStoreData: {
                    currentPanel: {},
                },
                featureFlagStoreData: {
                    [UnifiedFeatureFlags.adbSetupView]: true,
                } as FeatureFlagStoreData,
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            scanActionCreatorMock.reset(); // this mock is used on componentDidMount, which is not in the scope of this unit test

            wrapped.find(DeviceDisconnectedPopup).prop('onRescanDevice')();

            scanActionCreatorMock.verify(creator => creator.scan(scanPort), Times.once());
        });

        it('onConnectNewDevice', () => {
            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
            const windowStateActionCreatorMock = Mock.ofType(WindowStateActionCreator);

            const props: AutomatedChecksViewProps = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                    windowStateActionCreator: windowStateActionCreatorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Failed,
                },
                deviceStoreData: {},
                detailsViewStoreData: {
                    currentPanel: {},
                },
                featureFlagStoreData: {
                    [UnifiedFeatureFlags.adbSetupView]: false,
                } as FeatureFlagStoreData,
            } as AutomatedChecksViewProps;

            const wrapped = shallow(<AutomatedChecksView {...props} />);

            wrapped.find(DeviceDisconnectedPopup).prop('onConnectNewDevice')();

            windowStateActionCreatorMock.verify(
                creator => creator.setRoute(It.isValue({ routeId: 'deviceConnectView' })),
                Times.once(),
            );
        });
    });
});

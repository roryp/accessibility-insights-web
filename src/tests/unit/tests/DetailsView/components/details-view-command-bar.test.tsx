// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    CommandBarProps,
    DetailsViewCommandBar,
    DetailsViewCommandBarProps,
    ReportExportDialogFactory,
    SaveAssessmentFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    DetailsViewSwitcherNavConfiguration,
    LeftNavProps,
} from 'DetailsView/components/details-view-switcher-nav';
import {
    LoadAssessmentButton,
    LoadAssessmentButtonDeps,
    LoadAssessmentButtonProps,
} from 'DetailsView/components/load-assessment-button';
import { ReportExportDialogFactoryProps } from 'DetailsView/components/report-export-dialog-factory';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { SaveAssessmentFactoryProps } from 'DetailsView/components/save-assessment-factory';
import {
    StartOverComponentFactory,
    StartOverFactoryProps,
} from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import { isNil } from 'lodash';
import { ActionButton, IButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('DetailsViewCommandBar', () => {
    const thePageTitle = 'command-bar-test-tab-title';
    const thePageUrl = 'command-bar-test-url';
    const reportExportDialogStub = <div>Export dialog</div>;
    const saveAssessmentStub = <div>Save assessment</div>;

    let tabStoreData: TabStoreData;
    let startOverComponent: JSX.Element;
    let SaveAssessmentButtonProps: SaveAssessmentButtonProps;
    let loadAssessmentButton: JSX.Element;
    let LoadAssessmentButtonProps: LoadAssessmentButtonProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let isCommandBarCollapsed: boolean;
    let showReportExportButton: boolean;
    let reportExportDialogFactory: IMock<ReportExportDialogFactory>;
    let saveAssessmentFactory: IMock<SaveAssessmentFactory>;
    let loadAssessmentButtonMock: IMock<(Props: LoadAssessmentButtonProps) => JSX.Element>;
    let getStartOverComponentMock: IMock<(Props: StartOverFactoryProps) => JSX.Element>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            MockBehavior.Loose,
        );
        reportExportDialogFactory = Mock.ofInstance(props => null);
        saveAssessmentFactory = Mock.ofInstance(props => null);
        loadAssessmentButtonMock = Mock.ofInstance(props => null);
        getStartOverComponentMock = Mock.ofInstance(props => null);
        tabStoreData = {
            title: thePageTitle,
            isClosed: false,
        } as TabStoreData;
        startOverComponent = null;
        loadAssessmentButton = null;
        isCommandBarCollapsed = false;
        showReportExportButton = true;
    });

    function getProps(): DetailsViewCommandBarProps {
        const CommandBarStub: ReactFCWithDisplayName<DetailsViewCommandBarProps> = NamedFC<DetailsViewCommandBarProps>(
            'test',
            _ => null,
        );
        const LeftNavStub: ReactFCWithDisplayName<LeftNavProps> = NamedFC<LeftNavProps>(
            'test',
            _ => null,
        );
        const switcherNavConfiguration: DetailsViewSwitcherNavConfiguration = {
            CommandBar: CommandBarStub,
            ReportExportDialogFactory: reportExportDialogFactory.object,
            SaveAssessmentFactory: saveAssessmentFactory.object,
            shouldShowReportExportButton: p => showReportExportButton,
            StartOverComponentFactory: {
                getStartOverComponent: getStartOverComponentMock.object,
            } as StartOverComponentFactory,
            LeftNav: LeftNavStub,
        } as DetailsViewSwitcherNavConfiguration;
        const scanMetadata = {
            targetAppInfo: {
                name: thePageTitle,
                url: thePageUrl,
            },
        } as ScanMetadata;

        return {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            tabStoreData,
            switcherNavConfiguration: switcherNavConfiguration,
            scanMetadata: scanMetadata,
            narrowModeStatus: {
                isCommandBarCollapsed,
            },
            featureFlagStoreData: {} as FeatureFlagStoreData,
        } as DetailsViewCommandBarProps;
    }

    test('renders with export button, save assessment, load, assessment, and start over', () => {
        testOnPivot(true, true, true, true);
    });

    test('renders without export button, save assessment, load assessment, and start over', () => {
        testOnPivot(false, false, false, false);
    });

    test('renders with export button, without save assessment, without load assessment, without start over', () => {
        testOnPivot(true, false, false, false);
    });

    test('renders without export button, without save assessment, without load assessment, with start over', () => {
        testOnPivot(false, false, false, true);
    });

    test('renders null when tab closed', () => {
        tabStoreData.isClosed = true;

        expect(render()).toBeNull();
    });

    test('renders with buttons collapsed into a menu', () => {
        isCommandBarCollapsed = true;
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    test('renders with report export dialog open', () => {
        const props = getProps();
        setupReportExportDialogFactory({ isOpen: true });

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ isReportExportDialogOpen: true });

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with save assessment button', () => {
        const rendered = shallow(<SaveAssessmentButton {...SaveAssessmentButtonProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with load assessment button', () => {
        const rendered = shallow(<LoadAssessmentButton {...LoadAssessmentButtonProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('renders with start test over dialog open', () => {
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ startOverDialogState: 'test' });

        expect(rendered.debug()).toMatchSnapshot();
    });

    test('renders with start assessment over dialog open', () => {
        const props = getProps();

        const rendered = shallow(<DetailsViewCommandBar {...props} />);
        rendered.setState({ startOverDialogState: 'assessment' });

        expect(rendered.debug()).toMatchSnapshot();
    });

    describe('Button focus', () => {
        let focusRef: IButton;
        let focusFunctionMock: IMock<() => void>;

        beforeEach(() => {
            focusFunctionMock = Mock.ofInstance(() => null);
            focusRef = {
                focus: focusFunctionMock.object,
            } as IButton;
        });

        test('set export button ref', () => {
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBeUndefined();

            const exportButton = wrapper.find('ReportExportButton');
            const setRef = exportButton.prop('buttonRef') as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBe(focusRef);
        });

        test('set start over button ref', () => {
            const props = getProps();

            let startOverFactoryProps: StartOverFactoryProps;
            getStartOverComponentMock
                .setup(g => g(It.isAny()))
                .callback(startOverProps => (startOverFactoryProps = startOverProps));

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.startOverDialogCloseFocus).toBeUndefined();

            expect(startOverFactoryProps).toBeDefined();
            const setRef = startOverFactoryProps.buttonRef as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.startOverDialogCloseFocus).toBe(focusRef);
        });

        test('set ... menu button ref', () => {
            isCommandBarCollapsed = true;
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);

            let instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBeUndefined();
            expect(instance.startOverDialogCloseFocus).toBeUndefined();

            const commandBarButtonsMenu = wrapper.find('CommandBarButtonsMenu');
            const setRef = commandBarButtonsMenu.prop('buttonRef') as (ref: IButton) => void;
            setRef(focusRef);

            instance = wrapper.instance() as DetailsViewCommandBar;
            expect(instance.exportDialogCloseFocus).toBe(focusRef);
            expect(instance.startOverDialogCloseFocus).toBe(focusRef);
        });

        test('focus export report button', () => {
            const props = getProps();

            let reportExportDialogFactoryProps: ReportExportDialogFactoryProps;
            reportExportDialogFactory
                .setup(r => r(It.isAny()))
                .callback(p => (reportExportDialogFactoryProps = p));

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);
            wrapper.setState({ isReportExportDialogOpen: true });

            const instance = wrapper.instance() as DetailsViewCommandBar;
            instance.exportDialogCloseFocus = focusRef;

            focusFunctionMock.setup(f => f()).verifiable(Times.once());

            reportExportDialogFactoryProps.afterDialogDismissed();

            focusFunctionMock.verifyAll();
        });

        test('focus start over button', () => {
            const props = getProps();

            const wrapper = shallow(<DetailsViewCommandBar {...props} />);
            wrapper.setState({ startOverDialogState: 'test' });

            const instance = wrapper.instance() as DetailsViewCommandBar;
            instance.startOverDialogCloseFocus = focusRef;

            focusFunctionMock.setup(f => f()).verifiable(Times.once());

            wrapper.setState({ startOverDialogState: 'none' });
            wrapper.update();

            focusFunctionMock.verifyAll();
        });
    });

    function testOnPivot(
        renderExportResults: boolean,
        renderSaveAssessment: boolean,
        renderLoadAssessment: boolean,
        renderStartOver: boolean,
    ): void {
        showReportExportButton = renderExportResults;

        if (renderStartOver) {
            startOverComponent = <ActionButton>Start Over Component</ActionButton>;
        }

        const props = getProps();

        props.featureFlagStoreData = { saveAndLoadAssessment: renderSaveAssessment };

        setupSaveAssessmentFactory(props);
        setupStartOverButtonFactory(props);
        setupReportExportDialogFactory({ isOpen: false });

        const rendered = shallow(<DetailsViewCommandBar {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    }

    function render(): JSX.Element {
        const testSubject = getTestSubject();

        return testSubject.render();
    }

    function getTestSubject(): DetailsViewCommandBar {
        return new DetailsViewCommandBar(getProps());
    }

    function setupReportExportDialogFactory(
        expectedProps?: Partial<ReportExportDialogFactoryProps>,
    ): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        reportExportDialogFactory.setup(r => r(argMatcher)).returns(() => reportExportDialogStub);
    }

    function setupSaveAssessmentFactory(expectedProps?: Partial<SaveAssessmentFactoryProps>): void {
        const argMatcher = isNil(expectedProps) ? It.isAny() : It.isObjectWith(expectedProps);
        saveAssessmentFactory.setup(r => r(argMatcher)).returns(() => saveAssessmentStub);
    }

    function setupStartOverButtonFactory(props: CommandBarProps): void {
        const expectedProps = props as Partial<StartOverFactoryProps>;
        getStartOverComponentMock
            .setup(g => g(It.isObjectWith(expectedProps)))
            .returns(() => startOverComponent);
    }
});

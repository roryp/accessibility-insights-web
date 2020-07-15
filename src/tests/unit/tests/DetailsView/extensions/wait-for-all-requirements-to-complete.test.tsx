// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { WithAssessmentTestResult } from 'DetailsView/components/assessment-view';
import { waitForAllRequirementsToComplete } from 'DetailsView/extensions/wait-for-all-requirements-to-complete';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('WaitForAllRequirementsToComplete', () => {
    const zeroPercent = {
        assessmentTestResult: {
            getOutcomeStats: () => ({ pass: 0, incomplete: 1, fail: 0 }),
        },
    } as WithAssessmentTestResult;

    const fiftyPercent = {
        assessmentTestResult: {
            getOutcomeStats: () => ({ pass: 1, incomplete: 1, fail: 0 }),
        },
    } as WithAssessmentTestResult;

    const oneHundredPercent = {
        assessmentTestResult: {
            getOutcomeStats: () => ({ pass: 1, incomplete: 0, fail: 0 }),
        },
    } as WithAssessmentTestResult;

    const Extension = waitForAllRequirementsToComplete.component;

    it('renders spinner when zeroPercent', () => {
        const rendered = shallow(<Extension {...zeroPercent}>INSIDE</Extension>);
        const spinner = rendered.find(ScanningSpinner);
        expect(spinner.prop('label')).toEqual('Scanning 0%');
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('renders spinner when fiftyPercent', () => {
        const rendered = shallow(<Extension {...fiftyPercent}>INSIDE</Extension>);
        const spinner = rendered.find(ScanningSpinner);
        expect(spinner.prop('label')).toEqual('Scanning 50%');
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('renders children when oneHundredPercent', () => {
        const rendered = shallow(<Extension {...oneHundredPercent}>INSIDE</Extension>);
        const spinner = rendered.find(ScanningSpinner);
        expect(spinner.exists()).toEqual(false);
        expect(rendered.text()).toEqual('INSIDE');
        expect(rendered.debug()).toMatchSnapshot();
    });
});

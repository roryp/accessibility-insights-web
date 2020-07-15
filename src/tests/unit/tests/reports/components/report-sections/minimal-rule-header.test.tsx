// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import {
    MinimalRuleHeader,
    MinimalRuleHeaderProps,
} from 'reports/components/report-sections/minimal-rule-header';

describe('MinimalRuleHeader', () => {
    const rule = {
        id: 'rule id',
        description: 'rule description',
        nodes: [{}],
    };

    it.each(allInstanceOutcomeTypes)('renders, outcomeType = %s', outcomeType => {
        const props: MinimalRuleHeaderProps = {
            rule,
            outcomeType,
        };

        const wrapped = shallow(<MinimalRuleHeader {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});

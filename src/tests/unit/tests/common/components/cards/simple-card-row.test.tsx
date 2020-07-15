// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SimpleCardRow, SimpleCardRowProps } from 'common/components/cards/simple-card-row';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('SimpleCardRow', () => {
    let label: string;
    let content: string | JSX.Element;
    let rowKey: string;
    let props: SimpleCardRowProps;

    beforeEach(() => {
        label = 'test label';
        content = 'test content';
        rowKey = 'test row key';
        props = {
            label,
            content,
            rowKey,
        };
    });

    it('renders', () => {
        const testSubject = shallow(<SimpleCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('renders with correct styling with extra class name', () => {
        props.contentClassName = 'test class name';
        const testSubject = shallow(<SimpleCardRow {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});

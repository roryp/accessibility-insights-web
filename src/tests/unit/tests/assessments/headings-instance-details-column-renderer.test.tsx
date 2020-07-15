// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { headingsAssessmentInstanceDetailsColumnRenderer } from 'assessments/headings/headings-instance-details-column-renderer';
import { HeadingsAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';
import { AssessmentInstanceRowData } from '../../../../DetailsView/components/assessment-instance-table';
import { HeadingFormatter } from '../../../../injected/visualization/heading-formatter';

describe('HeadingsInstanceDetailsColumnRendererTest', () => {
    test('render: propertyBag is null', () => {
        const item = {
            instance: {
                propertyBag: null,
            },
        } as AssessmentInstanceRowData<HeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={'#767676'}
                labelText={'N/A'}
                textContent={null}
                tooltipId={null}
                customClassName="not-applicable"
            />
        );
        expect(headingsAssessmentInstanceDetailsColumnRenderer(item)).toEqual(expected);
    });

    test('render', () => {
        const item = {
            instance: {
                propertyBag: {
                    headingText: 'heading',
                    headingLevel: '3',
                },
            },
        } as AssessmentInstanceRowData<HeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={HeadingFormatter.headingStyles['3'].borderColor}
                labelText={'H3'}
                textContent={'heading'}
                tooltipId={null}
                customClassName={null}
            />
        );
        expect(headingsAssessmentInstanceDetailsColumnRenderer(item)).toEqual(expected);
    });

    test('render out of bounds level', () => {
        const item = {
            instance: {
                propertyBag: {
                    headingText: 'heading',
                    headingLevel: '7',
                },
            },
        } as AssessmentInstanceRowData<HeadingsAssessmentProperties>;
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={'#767676'}
                labelText={'H7'}
                textContent={'heading'}
                tooltipId={null}
                customClassName={null}
            />
        );
        expect(headingsAssessmentInstanceDetailsColumnRenderer(item)).toEqual(expected);
    });
});

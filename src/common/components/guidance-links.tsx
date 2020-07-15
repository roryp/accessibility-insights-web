// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LinkComponentType } from 'common/types/link-component-type';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { HyperlinkDefinition } from 'views/content/content-page';

import { NamedFC } from '../react/named-fc';

export interface GuidanceLinksProps {
    links: HyperlinkDefinition[];
    classNameForDiv?: string;
    LinkComponent: LinkComponentType;
}

export const GuidanceLinks = NamedFC('GuidanceLinks', (props: GuidanceLinksProps) => {
    const { links, classNameForDiv } = props;

    if (isEmpty(links)) {
        return null;
    }

    const renderLinks = (): JSX.Element[] => {
        return links.map((link, index) => {
            return renderLink(link, index, links.length);
        });
    };

    const renderLink = (link: HyperlinkDefinition, index: number, length: number): JSX.Element => {
        const addComma: boolean = index !== length - 1;
        const comma = addComma ? <span>,&nbsp;</span> : null;
        const LinkComponent: LinkComponentType = props.LinkComponent;
        return (
            <React.Fragment key={`guidance-link-${index}`}>
                <LinkComponent href={link.href} onClick={event => event.stopPropagation()}>
                    {link.text.toUpperCase()}
                </LinkComponent>
                {comma}
            </React.Fragment>
        );
    };

    const spanClassName = classNameForDiv || 'guidance-links';
    return <span className={spanClassName}>{renderLinks()}</span>;
});

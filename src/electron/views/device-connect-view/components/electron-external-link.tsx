// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Shell } from 'electron';
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';

export interface ElectronExternalLinkProps {
    href: string;
    shell: Shell;
    children: React.ReactNode;
}

export const ElectronExternalLink = NamedFC<ElectronExternalLinkProps>(
    'ElectronExternalLink',
    (props: ElectronExternalLinkProps) => {
        const onClick = () => props.shell.openExternal(props.href);
        return (
            <Link role="link" onClick={onClick}>
                {props.children}
            </Link>
        );
    },
);

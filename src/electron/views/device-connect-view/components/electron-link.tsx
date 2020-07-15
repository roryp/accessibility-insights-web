// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { shell } from 'electron';
import * as React from 'react';

import { ElectronExternalLink } from './electron-external-link';

export type ElectronLinkProps = {
    href: string;
    children: React.ReactNode;
};

export const ElectronLink = NamedFC<ElectronLinkProps>('ElectronLink', props => {
    return <ElectronExternalLink {...props} shell={shell} />;
});

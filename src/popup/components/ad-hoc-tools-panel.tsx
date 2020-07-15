// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { flatMap } from 'lodash';
import { css, Icon, Link } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './ad-hoc-tools-panel.scss';
import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';

export interface AdHocToolsPanelProps {
    backLinkHandler: () => void;
    diagnosticViewToggleFactory: DiagnosticViewToggleFactory;
}

export const AdHocToolsPanel = NamedFC<AdHocToolsPanelProps>('AdHocToolsPanel', props => {
    const getTogglesWithDividers = () => {
        const toggles = props.diagnosticViewToggleFactory.createTogglesForAdHocToolsPanel();

        let dividerIndex = 0;

        const getDivider = () => (
            <span key={`divider-${dividerIndex++}`} className={styles.divider}></span>
        );

        const totalRows = 3;

        const result = flatMap(toggles, (toggle, index) => {
            if ((index + 1) % totalRows === 0 || index === toggles.length - 1) {
                return [toggle];
            }

            if (index === toggles.length) {
                return [toggles];
            }

            return [toggle, getDivider()];
        });

        return result;
    };

    const togglesWithDividers = getTogglesWithDividers();

    return (
        <div className={css('main-section', styles.adHocToolsPanel)}>
            <main className={styles.adHocToolsGrid}>{togglesWithDividers}</main>
            <div role="navigation" className={styles.adHocToolsPanelFooter}>
                <Link
                    className={styles.link}
                    onClick={props.backLinkHandler}
                    id="back-to-launchpad-link"
                >
                    <Icon className={styles.backToLaunchPadIcon} iconName="back" />
                    Back to launch pad
                </Link>
            </div>
        </div>
    );
});

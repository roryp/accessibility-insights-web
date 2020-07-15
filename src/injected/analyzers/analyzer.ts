// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseActionPayload } from 'background/actions/action-payloads';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { IAnalyzerTelemetryCallback } from '../../common/types/analyzer-telemetry-callbacks';
import { SingleElementSelector } from '../../common/types/store-data/scoping-store-data';
import { TelemetryProcessor } from '../../common/types/telemetry-processor';
import { VisualizationType } from '../../common/types/visualization-type';
import { ScanResults } from '../../scanner/iruleresults';
import { DictionaryStringTo } from '../../types/common-types';
import { HtmlElementAxeResults, ScannerUtils } from '../scanner-utils';
import { TabStopEvent } from '../tab-stops-listener';

export interface AxeAnalyzerResult {
    results: DictionaryStringTo<any>;
    originalResult: ScanResults;
    include?: SingleElementSelector[];
    exclude?: SingleElementSelector[];
}

export interface Analyzer {
    analyze(): void;
    teardown(): void;
}

export interface ScanCompletedPayload<TSelectorValue> extends ScanBasePayload {
    selectorMap: DictionaryStringTo<TSelectorValue>;
    scanResult: ScanResults;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
}

export interface ScanUpdatePayload extends ScanBasePayload {
    results: TabStopEvent[];
}

export interface ScanBasePayload extends BaseActionPayload {
    testType: VisualizationType;
    key: string;
}

export interface AnalyzerConfiguration {
    key: string;
    testType: VisualizationType;
    analyzerMessageType: string;
}

export interface RuleAnalyzerConfiguration extends AnalyzerConfiguration {
    rules: string[];
    resultProcessor: (
        scanner: ScannerUtils,
    ) => (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>;
    telemetryProcessor: TelemetryProcessor<IAnalyzerTelemetryCallback>;
}

export interface FocusAnalyzerConfiguration extends AnalyzerConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}

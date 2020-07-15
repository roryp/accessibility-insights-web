// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallDataGenerator } from '../install-data-generator';

export interface ApplicationTelemetryData {
    applicationVersion: string;
    applicationName: string;
    applicationBuild: string;
    installationId: string;
}

export class ApplicationTelemetryDataFactory {
    constructor(
        private readonly version: string,
        private readonly name: string,
        private readonly build: string,
        private readonly installDataGenerator: InstallDataGenerator,
    ) {}

    public getData(): ApplicationTelemetryData {
        return {
            applicationVersion: this.version,
            applicationName: this.name,
            applicationBuild: this.build,
            installationId: this.installDataGenerator.getInstallationId(),
        };
    }
}

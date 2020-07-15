// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const { downloadArtifact } = require('@electron/get');
const extract = require('extract-zip');
const fs = require('fs');
const path = require('path');

/*
This script replaces existing electron & chromedriver modules
with mirror dependencies specified by `assetNumber` and pipeline
build variables. We use this to avoid bundling non-freely-redistributable 
media codecs in our release builds. The version of Electron published to 
npm includes these as part of Chromium; our release builds use a 
Microsoft-maintained build of Electron that removes those codecs.
*/

if (
    process.env.ELECTRON_MIRROR_BASE_VAR === undefined ||
    process.env.ELECTRON_MIRROR_CUSTOM_DIR_VAR === undefined
) {
    console.error(
        `Mirror variables are not set. Please ensure that
        ELECTRON_MIRROR_BASE_VAR and ELECTRON_MIRROR_CUSTOM_DIR_VAR
        are both set as variables in the pipeline`,
    );
    process.exit(1);
}

const assetNumber = '4658637';

const downloadMirrors = async () => {
    await downloadElectronArtifact('electron', 'node_modules/electron/dist');
    await downloadElectronArtifact('chromedriver', 'node_modules/electron-chromedriver/bin');
};

const downloadElectronArtifact = async (artifactName, destinationPath) => {
    destinationPath = path.resolve(destinationPath);
    console.log(`downloading ${artifactName} at ${pkg.dependencies.electron}`);
    const zipFilePath = await downloadArtifact({
        version: `${pkg.dependencies.electron}`,
        artifactName,
        mirrorOptions: {
            mirror: process.env.ELECTRON_MIRROR_BASE_VAR,
            customDir: process.env.ELECTRON_MIRROR_CUSTOM_DIR_VAR,
            resolveAssetURL: resolveCustomAssetURL,
        },
        force: true,
    });
    console.log(`zip downloaded to dir ${zipFilePath}`);
    console.log(`extracting to ${destinationPath}`);

    fs.rmdirSync(destinationPath, { recursive: true });

    await extract(zipFilePath, { dir: destinationPath });
};

const resolveCustomAssetURL = details => {
    const opts = details.mirrorOptions;
    const file = details.artifactName.startsWith('SHASUMS256')
        ? details.artifactName
        : `${[details.artifactName, details.version, details.platform, details.arch].join(
              '-',
          )}.zip`;
    const strippedVer = details.version.replace(/^v/, '');
    return `${opts.mirror}/${strippedVer}/${opts.customDir}/${assetNumber}/${file}`;
};

downloadMirrors().catch(err => {
    console.error(err);
    process.exit(1);
});

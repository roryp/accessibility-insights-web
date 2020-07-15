// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { Interpreter } from 'background/interpreter';
import { UserConfigurationController } from 'background/user-configuration-controller';
import { Message } from 'common/message';
import { Messages } from 'common/messages';

describe('UserConfigurationController', () => {
    let testSubject: UserConfigurationController;
    let interpreterMock: IMock<Interpreter>;

    beforeEach(() => {
        interpreterMock = Mock.ofType<Interpreter>();
        testSubject = new UserConfigurationController(interpreterMock.object);
    });

    it.each([true, false])(
        'setHighContrastMode(%s) sends the expected interpreter message',
        (enabled: boolean) => {
            const expectedMessage: Message = {
                messageType: Messages.UserConfig.SetHighContrastConfig,
                payload: { enableHighContrast: enabled },
                tabId: null,
            };
            testSubject.setHighContrastMode(enabled);
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );

    it.each([true, false])(
        'setTelemetryState(%s) sends the expected interpreter message',
        (enabled: boolean) => {
            const expectedMessage: Message = {
                messageType: Messages.UserConfig.SetTelemetryConfig,
                payload: { enableTelemetry: enabled },
                tabId: null,
            };
            testSubject.setTelemetryState(enabled);
            interpreterMock.verify(i => i.interpret(expectedMessage), Times.once());
        },
    );
});

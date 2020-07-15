// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

import { BaseStore } from '../base-store';
import { getStoreStateMessage } from '../messages';
import { StoreNames } from '../stores/store-names';
import { StoreActionMessageCreator } from './store-action-message-creator';
import { StoreActionMessageCreatorImpl } from './store-action-message-creator-impl';

export class StoreActionMessageCreatorFactory {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public fromStores(stores: BaseStore<any>[]): StoreActionMessageCreator {
        const messages = stores.map(store => getStoreStateMessage(StoreNames[store.getId()]));

        return new StoreActionMessageCreatorImpl(messages, this.dispatcher);
    }
}

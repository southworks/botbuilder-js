/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Span } from '@opentelemetry/api';
import { LogRecord } from '@opentelemetry/sdk-logs';
import { SemanticResourceAttributes, SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { ATTR_USER_ID, ATTR_SESSION_ID } from '@opentelemetry/semantic-conventions/incubating';
import { createHash } from 'crypto';

/* Define the telemetry initializer function which is responsible for setting the userId. sessionId and some other values
 * so that application insights can correlate related events.
 */
export function addBotIdentifiers(record: LogRecord | Span, context: { [name: string]: any }) {
    const { activity } = context;
    if (activity) {
        const userId: string = activity.from ? activity.from.id : '';
        const channelId: string = activity.channelId || '';
        const conversationId: string = activity.conversation ? activity.conversation.id : '';
        // Hashed ID is used due to max session ID length for App Insights session Id
        const sessionId: string = conversationId ? createHash('sha256').update(conversationId).digest('base64') : '';

        record.setAttributes({
            // Set user id and session id
            // [ATTR_USER_ID]: channelId + userId,
            // [SemanticAttributes.ENDUSER_ID]: channelId + userId,
            // ['ai.user.id']: channelId + userId,
            // ['session/id']: sessionId,
            // [ATTR_SESSION_ID]: sessionId,
            // Add additional properties
            activityId: activity.id,
            channelId: channelId,
            activityType: activity.type,
            conversationId: conversationId,
        });
    }
}

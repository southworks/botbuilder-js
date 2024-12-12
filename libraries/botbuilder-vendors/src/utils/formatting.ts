// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export function plural(n: number, text: string, plural: string = 's') {
    return `${text}${n === 1 ? '' : plural}`;
}

export function padLeft(text: string) {
    return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
}
export module CosmosDBKeyEscape {
    const illegalKeys: Array<string> = ['\\', '?', '/', '#', '\t', '\n', '\r', '*'];
    const illegalKeyCharacterReplacementMap: Map<string, string> = illegalKeys.reduce<Map<string, string>>((map, c) => {
        map.set(c, '*' + c.charCodeAt(0).toString(16));
        return map;
    }, new Map());

    export function escapeKey(key: string): string {
        if (!key) {
            throw new Error('The \'key\' parameter is required.');
        }

        let keySplitted: Array<string> = key.split('');

        let firstIllegalCharIndex: number = keySplitted.findIndex((c => illegalKeys.some(i => i === c)));

        // If there are no illegal characters return immediately and avoid any further processing/allocations
        if (firstIllegalCharIndex === -1) {
            return key;
        }

        return keySplitted.reduce((result, c) => result + (illegalKeyCharacterReplacementMap.has(c) ? illegalKeyCharacterReplacementMap.get(c) : c), '');
    }
}
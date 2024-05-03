import { ParseResult } from "botbuilder-stdlib/vendors/@microsoft/recognizers-text";
import { ICJKNumberParserConfiguration } from "../cjkParsers";
import { CultureInfo } from "../../culture";
export declare class JapaneseNumberParserConfiguration implements ICJKNumberParserConfiguration {
    readonly cardinalNumberMap: ReadonlyMap<string, number>;
    readonly ordinalNumberMap: ReadonlyMap<string, number>;
    readonly roundNumberMap: ReadonlyMap<string, number>;
    readonly cultureInfo: CultureInfo;
    readonly digitalNumberRegex: RegExp;
    readonly fractionMarkerToken: string;
    readonly halfADozenRegex: RegExp;
    readonly halfADozenText: string;
    readonly langMarker: string;
    readonly nonDecimalSeparatorChar: string;
    readonly decimalSeparatorChar: string;
    readonly wordSeparatorToken: string;
    readonly zeroChar: string;
    readonly pairChar: string;
    readonly writtenDecimalSeparatorTexts: readonly string[];
    readonly writtenGroupSeparatorTexts: readonly string[];
    readonly writtenIntegerSeparatorTexts: readonly string[];
    readonly writtenFractionSeparatorTexts: readonly string[];
    readonly zeroToNineMap: ReadonlyMap<string, number>;
    readonly roundNumberMapChar: ReadonlyMap<string, number>;
    readonly fullToHalfMap: ReadonlyMap<string, string>;
    readonly tratoSimMap: ReadonlyMap<string, string>;
    readonly unitMap: ReadonlyMap<string, string>;
    readonly roundDirectList: readonly string[];
    readonly tenChars: readonly string[];
    readonly digitNumRegex: RegExp;
    readonly dozenRegex: RegExp;
    readonly percentageRegex: RegExp;
    readonly percentageNumRegex: RegExp;
    readonly doubleAndRoundRegex: RegExp;
    readonly fracSplitRegex: RegExp;
    readonly negativeNumberSignRegex: RegExp;
    readonly pointRegex: RegExp;
    readonly speGetNumberRegex: RegExp;
    readonly pairRegex: RegExp;
    readonly roundNumberIntegerRegex: RegExp;
    constructor(ci?: CultureInfo);
    normalizeTokenSet(tokens: readonly string[], context: ParseResult): readonly string[];
    resolveCompositeNumber(numberStr: string): number;
}

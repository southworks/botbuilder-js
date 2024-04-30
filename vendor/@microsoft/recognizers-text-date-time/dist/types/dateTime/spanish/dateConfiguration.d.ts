import { BaseNumberExtractor, BaseNumberParser } from "@microsoft/recognizers-text-number";
import { IDateExtractorConfiguration, IDateParserConfiguration } from "../baseDate";
import { BaseDurationParser } from "../baseDuration";
import { IDateTimeUtilityConfiguration } from "../utilities";
import { SpanishCommonDateTimeParserConfiguration } from "./baseConfiguration";
import { IDateTimeExtractor } from "../baseDateTime";
export declare class SpanishDateExtractorConfiguration implements IDateExtractorConfiguration {
    readonly dateRegexList: RegExp[];
    readonly implicitDateList: RegExp[];
    readonly monthEnd: RegExp;
    readonly ofMonth: RegExp;
    readonly dateUnitRegex: RegExp;
    readonly forTheRegex: RegExp;
    readonly weekDayAndDayOfMonthRegex: RegExp;
    readonly relativeMonthRegex: RegExp;
    readonly weekDayRegex: RegExp;
    readonly dayOfWeek: ReadonlyMap<string, number>;
    readonly ordinalExtractor: BaseNumberExtractor;
    readonly integerExtractor: BaseNumberExtractor;
    readonly numberParser: BaseNumberParser;
    readonly durationExtractor: IDateTimeExtractor;
    readonly utilityConfiguration: IDateTimeUtilityConfiguration;
    constructor();
}
export declare class SpanishDateParserConfiguration implements IDateParserConfiguration {
    readonly ordinalExtractor: BaseNumberExtractor;
    readonly integerExtractor: BaseNumberExtractor;
    readonly cardinalExtractor: BaseNumberExtractor;
    readonly durationExtractor: IDateTimeExtractor;
    readonly durationParser: BaseDurationParser;
    readonly numberParser: BaseNumberParser;
    readonly monthOfYear: ReadonlyMap<string, number>;
    readonly dayOfMonth: ReadonlyMap<string, number>;
    readonly dayOfWeek: ReadonlyMap<string, number>;
    readonly unitMap: ReadonlyMap<string, string>;
    readonly cardinalMap: ReadonlyMap<string, number>;
    readonly dateRegex: RegExp[];
    readonly onRegex: RegExp;
    readonly specialDayRegex: RegExp;
    readonly specialDayWithNumRegex: RegExp;
    readonly nextRegex: RegExp;
    readonly unitRegex: RegExp;
    readonly monthRegex: RegExp;
    readonly weekDayRegex: RegExp;
    readonly lastRegex: RegExp;
    readonly thisRegex: RegExp;
    readonly weekDayOfMonthRegex: RegExp;
    readonly forTheRegex: RegExp;
    readonly weekDayAndDayOfMonthRegex: RegExp;
    readonly relativeMonthRegex: RegExp;
    readonly relativeWeekDayRegex: RegExp;
    readonly utilityConfiguration: IDateTimeUtilityConfiguration;
    readonly dateTokenPrefix: string;
    static readonly relativeDayRegex: RegExp;
    static readonly nextPrefixRegex: RegExp;
    static readonly pastPrefixRegex: RegExp;
    constructor(config: SpanishCommonDateTimeParserConfiguration);
    getSwiftDay(source: string): number;
    getSwiftMonth(source: string): number;
    isCardinalLast(source: string): boolean;
    private static normalize(source);
}

import { IDateTimePeriodExtractorConfiguration, IDateTimePeriodParserConfiguration } from "../baseDateTimePeriod";
import { BaseDateParser } from "../baseDate";
import { BaseTimeParser } from "../baseTime";
import { IDateTimeExtractor, BaseDateTimeParser } from "../baseDateTime";
import { BaseDurationParser } from "../baseDuration";
import { EnglishCardinalExtractor } from "@microsoft/recognizers-text-number";
import { EnglishCommonDateTimeParserConfiguration } from "./baseConfiguration";
import { IDateTimeParser } from "../parsers";
export declare class EnglishDateTimePeriodExtractorConfiguration implements IDateTimePeriodExtractorConfiguration {
    readonly cardinalExtractor: EnglishCardinalExtractor;
    readonly singleDateExtractor: IDateTimeExtractor;
    readonly singleTimeExtractor: IDateTimeExtractor;
    readonly singleDateTimeExtractor: IDateTimeExtractor;
    readonly durationExtractor: IDateTimeExtractor;
    readonly timePeriodExtractor: IDateTimeExtractor;
    readonly simpleCasesRegexes: RegExp[];
    readonly prepositionRegex: RegExp;
    readonly tillRegex: RegExp;
    readonly specificTimeOfDayRegex: RegExp;
    readonly timeOfDayRegex: RegExp;
    readonly periodTimeOfDayWithDateRegex: RegExp;
    readonly followedUnit: RegExp;
    readonly numberCombinedWithUnit: RegExp;
    readonly timeUnitRegex: RegExp;
    readonly pastPrefixRegex: RegExp;
    readonly nextPrefixRegex: RegExp;
    readonly rangeConnectorRegex: RegExp;
    readonly relativeTimeUnitRegex: RegExp;
    readonly restOfDateTimeRegex: RegExp;
    readonly generalEndingRegex: RegExp;
    readonly middlePauseRegex: RegExp;
    constructor();
    getFromTokenIndex(source: string): {
        matched: boolean;
        index: number;
    };
    getBetweenTokenIndex(source: string): {
        matched: boolean;
        index: number;
    };
    hasConnectorToken(source: string): boolean;
}
export declare class EnglishDateTimePeriodParserConfiguration implements IDateTimePeriodParserConfiguration {
    readonly pureNumberFromToRegex: RegExp;
    readonly pureNumberBetweenAndRegex: RegExp;
    readonly periodTimeOfDayWithDateRegex: RegExp;
    readonly specificTimeOfDayRegex: RegExp;
    readonly pastRegex: RegExp;
    readonly futureRegex: RegExp;
    readonly relativeTimeUnitRegex: RegExp;
    readonly numbers: ReadonlyMap<string, number>;
    readonly unitMap: ReadonlyMap<string, string>;
    readonly dateExtractor: IDateTimeExtractor;
    readonly timePeriodExtractor: IDateTimeExtractor;
    readonly timeExtractor: IDateTimeExtractor;
    readonly dateTimeExtractor: IDateTimeExtractor;
    readonly durationExtractor: IDateTimeExtractor;
    readonly dateParser: BaseDateParser;
    readonly timeParser: BaseTimeParser;
    readonly dateTimeParser: BaseDateTimeParser;
    readonly timePeriodParser: IDateTimeParser;
    readonly durationParser: BaseDurationParser;
    readonly morningStartEndRegex: RegExp;
    readonly afternoonStartEndRegex: RegExp;
    readonly eveningStartEndRegex: RegExp;
    readonly nightStartEndRegex: RegExp;
    readonly restOfDateTimeRegex: RegExp;
    constructor(config: EnglishCommonDateTimeParserConfiguration);
    getMatchedTimeRange(source: string): {
        timeStr: string;
        beginHour: number;
        endHour: number;
        endMin: number;
        success: boolean;
    };
    getSwiftPrefix(source: string): number;
}
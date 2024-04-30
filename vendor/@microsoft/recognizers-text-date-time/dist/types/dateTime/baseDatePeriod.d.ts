import { ExtractResult, Match } from "@microsoft/recognizers-text";
import { BaseNumberExtractor, BaseNumberParser } from "@microsoft/recognizers-text-number";
import { Token, DateTimeResolutionResult } from "./utilities";
import { BaseDurationParser } from "./baseDuration";
import { IDateTimeParser, DateTimeParseResult } from "./parsers";
import { BaseDateParser } from "./baseDate";
import { IDateTimeExtractor } from "./baseDateTime";
export interface IDatePeriodExtractorConfiguration {
    simpleCasesRegexes: RegExp[];
    illegalYearRegex: RegExp;
    YearRegex: RegExp;
    tillRegex: RegExp;
    followedUnit: RegExp;
    numberCombinedWithUnit: RegExp;
    pastRegex: RegExp;
    futureRegex: RegExp;
    weekOfRegex: RegExp;
    monthOfRegex: RegExp;
    dateUnitRegex: RegExp;
    inConnectorRegex: RegExp;
    rangeUnitRegex: RegExp;
    datePointExtractor: IDateTimeExtractor;
    integerExtractor: BaseNumberExtractor;
    numberParser: BaseNumberParser;
    durationExtractor: IDateTimeExtractor;
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
export declare class BaseDatePeriodExtractor implements IDateTimeExtractor {
    protected readonly extractorName: string;
    protected readonly config: IDatePeriodExtractorConfiguration;
    constructor(config: IDatePeriodExtractorConfiguration);
    extract(source: string, refDate: Date): Array<ExtractResult>;
    protected matchSimpleCases(source: string): Array<Token>;
    private getYearFromText(match);
    protected mergeTwoTimePoints(source: string, refDate: Date): Array<Token>;
    private matchDuration(source, refDate);
    private singleTimePointWithPatterns(source, refDate);
    private getTokenForRegexMatching(source, regexp, er);
    private matchRegexInPrefix(source, match);
    private infixBoundaryCheck(match, source);
}
export interface IDatePeriodParserConfiguration {
    dateExtractor: IDateTimeExtractor;
    dateParser: BaseDateParser;
    durationExtractor: IDateTimeExtractor;
    durationParser: BaseDurationParser;
    monthFrontBetweenRegex: RegExp;
    betweenRegex: RegExp;
    monthFrontSimpleCasesRegex: RegExp;
    simpleCasesRegex: RegExp;
    oneWordPeriodRegex: RegExp;
    monthWithYear: RegExp;
    monthNumWithYear: RegExp;
    yearRegex: RegExp;
    pastRegex: RegExp;
    futureRegex: RegExp;
    inConnectorRegex: RegExp;
    weekOfMonthRegex: RegExp;
    weekOfYearRegex: RegExp;
    quarterRegex: RegExp;
    quarterRegexYearFront: RegExp;
    allHalfYearRegex: RegExp;
    seasonRegex: RegExp;
    weekOfRegex: RegExp;
    monthOfRegex: RegExp;
    whichWeekRegex: RegExp;
    restOfDateRegex: RegExp;
    laterEarlyPeriodRegex: RegExp;
    weekWithWeekDayRangeRegex: RegExp;
    tokenBeforeDate: string;
    dayOfMonth: ReadonlyMap<string, number>;
    monthOfYear: ReadonlyMap<string, number>;
    cardinalMap: ReadonlyMap<string, number>;
    seasonMap: ReadonlyMap<string, string>;
    unitMap: ReadonlyMap<string, string>;
    getSwiftDayOrMonth(source: string): number;
    getSwiftYear(source: string): number;
    isFuture(source: string): boolean;
    isYearToDate(source: string): boolean;
    isMonthToDate(source: string): boolean;
    isWeekOnly(source: string): boolean;
    isWeekend(source: string): boolean;
    isMonthOnly(source: string): boolean;
    isYearOnly(source: string): boolean;
    isLastCardinal(source: string): boolean;
}
export declare class BaseDatePeriodParser implements IDateTimeParser {
    protected readonly parserName: string;
    protected readonly config: IDatePeriodParserConfiguration;
    protected readonly inclusiveEndPeriod: any;
    private readonly weekOfComment;
    private readonly monthOfComment;
    constructor(config: IDatePeriodParserConfiguration, inclusiveEndPeriod?: boolean);
    parse(extractorResult: ExtractResult, referenceDate?: Date): DateTimeParseResult | null;
    private parseMonthWithYear(source, referenceDate);
    protected getMatchSimpleCase(source: string): Match;
    protected parseSimpleCases(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected parseOneWordPeriod(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected mergeTwoTimePoints(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected parseYear(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected parseDuration(source: string, referenceDate: Date): DateTimeResolutionResult;
    private getSwiftDate(date, timex, isPositiveSwift);
    protected parseWeekOfMonth(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected getWeekOfMonth(cardinal: number, month: number, year: number, referenceDate: Date, noYear: boolean): DateTimeResolutionResult;
    private parseWeekOfYear(source, referenceDate);
    protected parseHalfYear(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected parseQuarter(source: string, referenceDate: Date): DateTimeResolutionResult;
    protected parseSeason(source: string, referenceDate: Date): DateTimeResolutionResult;
    private parseWhichWeek(source, referenceDate);
    private parseWeekOfDate(source, referenceDate);
    private parseMonthOfDate(source, referenceDate);
    protected computeDate(cardinal: number, weekday: number, month: number, year: number): Date;
    private getWeekRangeFromDate(seedDate);
    private getMonthRangeFromDate(seedDate);
}

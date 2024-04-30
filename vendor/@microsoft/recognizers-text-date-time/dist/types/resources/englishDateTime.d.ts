export declare namespace EnglishDateTime {
    const TillRegex = "(?<till>\\b(to|till|til|until|thru|through)\\b|(--|-|—|——|~|–))";
    const RangeConnectorRegex = "(?<and>\\b(and|through|to)\\b|(--|-|—|——|~|–))";
    const RelativeRegex = "\\b(?<order>following|next|coming|upcoming|this|last|past|previous|current|the)\\b";
    const StrictRelativeRegex = "\\b(?<order>following|next|coming|upcoming|this|last|past|previous|current)\\b";
    const NextPrefixRegex = "\\b(following|next|upcoming|coming)\\b";
    const AfterNextSuffixRegex = "\\b(after\\s+(the\\s+)?next)\\b";
    const PastPrefixRegex = "(last|past|previous)\\b";
    const ThisPrefixRegex = "(this|current)\\b";
    const CenturySuffixRegex = "(^century)\\b";
    const ReferencePrefixRegex = "(that|same)\\b";
    const FutureSuffixRegex = "\\b(in\\s+the\\s+)?(future|hence)\\b";
    const DayRegex = "(the\\s*)?(?<day>01|02|03|04|05|06|07|08|09|10th|10|11th|11st|11|12nd|12th|12|13rd|13th|13|14th|14|15th|15|16th|16|17th|17|18th|18|19th|19|1st|1|20th|20|21st|21th|21|22nd|22th|22|23rd|23th|23|24th|24|25th|25|26th|26|27th|27|28th|28|29th|29|2nd|2|30th|30|31st|31|3rd|3|4th|4|5th|5|6th|6|7th|7|8th|8|9th|9)(?=\\b|t)";
    const ImplicitDayRegex = "(the\\s*)?(?<day>10th|11th|11st|12nd|12th|13rd|13th|14th|15th|16th|17th|18th|19th|1st|20th|21st|21th|22nd|22th|23rd|23th|24th|25th|26th|27th|28th|29th|2nd|30th|31st|3rd|4th|5th|6th|7th|8th|9th)\\b";
    const MonthNumRegex = "(?<month>01|02|03|04|05|06|07|08|09|10|11|12|1|2|3|4|5|6|7|8|9)\\b";
    const CenturyRegex = "\\b(?<century>((one|two)\\s+thousand(\\s+and)?(\\s+(one|two|three|four|five|six|seven|eight|nine)\\s+hundred(\\s+and)?)?)|((twenty one|twenty two|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)(\\s+hundred)?(\\s+and)?))\\b";
    const WrittenNumRegex = "(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fourty|fifty|sixty|seventy|eighty|ninety)";
    const FullTextYearRegex: string;
    const AmDescRegex = "(am\\b|a\\.m\\.|a m\\b|a\\. m\\.|a\\.m\\b|a\\. m\\b|a m\\b)";
    const PmDescRegex = "(pm\\b|p\\.m\\.|p\\b|p m\\b|p\\. m\\.|p\\.m\\b|p\\. m\\b|p m\\b)";
    const TwoDigitYearRegex: string;
    const YearRegex: string;
    const WeekDayRegex = "\\b(?<weekday>Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Mon|Tues|Tue|Wedn|Weds|Wed|Thurs|Thur|Thu|Fri|Sat|Sun)s?\\b";
    const SingleWeekDayRegex = "\\b(?<weekday>Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Mon|Tue|Tues|Wedn|Weds|Wed|Thurs|Thur|Thu|Fri|((?<=on\\s+)(Sat|Sun)))\\b";
    const RelativeMonthRegex: string;
    const WrittenMonthRegex = "(((the\\s+)?month of\\s+)?(?<month>April|Apr|August|Aug|December|Dec|February|Feb|January|Jan|July|Jul|June|Jun|March|Mar|May|November|Nov|October|Oct|September|Sept|Sep))";
    const MonthSuffixRegex: string;
    const DateUnitRegex = "(?<unit>decades?|years?|months?|weeks?|(?<business>business\\s+)?days?)\\b";
    const DateTokenPrefix = "on ";
    const TimeTokenPrefix = "at ";
    const TokenBeforeDate = "on ";
    const TokenBeforeTime = "at ";
    const SimpleCasesRegex: string;
    const MonthFrontSimpleCasesRegex: string;
    const MonthFrontBetweenRegex: string;
    const BetweenRegex: string;
    const MonthWithYear: string;
    const OneWordPeriodRegex: string;
    const MonthNumWithYear: string;
    const WeekOfMonthRegex: string;
    const WeekOfYearRegex: string;
    const FollowedDateUnit: string;
    const NumberCombinedWithDateUnit: string;
    const QuarterTermRegex = "\\b(((?<cardinal>first|1st|second|2nd|third|3rd|fourth|4th)[ -]+quarter)|(Q(?<number>[1-4])))\\b";
    const QuarterRegex: string;
    const QuarterRegexYearFront: string;
    const HalfYearTermRegex = "(?<cardinal>first|1st|second|2nd)\\s+half";
    const HalfYearFrontRegex = "(?<year>((1[5-9]|20)\\d{2})|2100)\\s*(the\\s+)?H(?<number>[1-2])";
    const HalfYearBackRegex: string;
    const HalfYearRelativeRegex: string;
    const AllHalfYearRegex: string;
    const EarlyPrefixRegex = "\\b(?<EarlyPrefix>early|beginning of|start of|(?<RelEarly>earlier(\\s+in)?))\\b";
    const MidPrefixRegex = "\\b(?<MidPrefix>mid-?|middle of)\\b";
    const LaterPrefixRegex = "\\b(?<LatePrefix>late|end of|(?<RelLate>later(\\s+in)?))\\b";
    const PrefixPeriodRegex: string;
    const PrefixDayRegex = "\\b((?<EarlyPrefix>early)|(?<MidPrefix>mid|middle)|(?<LatePrefix>late|later))(\\s+in)?(\\s+the\\s+day)?$";
    const SeasonDescRegex = "(?<seas>spring|summer|fall|autumn|winter)";
    const SeasonRegex: string;
    const WhichWeekRegex = "(week)(\\s*)(?<number>\\d\\d|\\d|0\\d)";
    const WeekOfRegex = "(the\\s+)?(week)(\\s+of)(\\s+the)?";
    const MonthOfRegex = "(month)(\\s*)(of)";
    const MonthRegex = "(?<month>April|Apr|August|Aug|December|Dec|February|Feb|January|Jan|July|Jul|June|Jun|March|Mar|May|November|Nov|October|Oct|September|Sept|Sep)";
    const AmbiguousMonthP0Regex = "\\b((^may i)|(i|you|he|she|we|they)\\s+may|(may\\s+((((also|not|(also not)|well)\\s+)?(be|contain|constitute|email|e-mail|take|have|result|involve|get|work|reply))|(or may not))))\\b";
    const DateYearRegex: string;
    const YearSuffix: string;
    const OnRegex: string;
    const RelaxedOnRegex = "(?<=\\b(on|at|in)\\s+)((?<day>10th|11th|11st|12nd|12th|13rd|13th|14th|15th|16th|17th|18th|19th|1st|20th|21st|21th|22nd|22th|23rd|23th|24th|25th|26th|27th|28th|29th|2nd|30th|31st|3rd|4th|5th|6th|7th|8th|9th)s?)\\b";
    const ThisRegex: string;
    const LastDateRegex: string;
    const NextDateRegex: string;
    const SpecialDayRegex: string;
    const SpecialDayWithNumRegex: string;
    const RelativeDayRegex: string;
    const SetWeekDayRegex = "\\b(?<prefix>on\\s+)?(?<weekday>morning|afternoon|evening|night|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)s\\b";
    const WeekDayOfMonthRegex: string;
    const RelativeWeekDayRegex: string;
    const SpecialDate: string;
    const DatePreposition = "\\b(on|in)";
    const DateExtractor1: string;
    const DateExtractor2: string;
    const DateExtractor3: string;
    const DateExtractor4: string;
    const DateExtractor5: string;
    const DateExtractor6: string;
    const DateExtractor7: string;
    const DateExtractor8: string;
    const DateExtractor9: string;
    const DateExtractorA: string;
    const OfMonth: string;
    const MonthEnd: string;
    const WeekDayEnd: string;
    const RangeUnitRegex = "\\b(?<unit>years|year|months|month|weeks|week)\\b";
    const OclockRegex = "(?<oclock>o\\s*’\\s*clock|o\\s*‘\\s*clock|o\\s*'\\s*clock|o\\s*clock)";
    const DescRegex: string;
    const HourNumRegex = "\\b(?<hournum>zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\\b";
    const MinuteNumRegex = "(?<minnum>one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)";
    const DeltaMinuteNumRegex = "(?<deltaminnum>one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty)";
    const PmRegex = "(?<pm>(((at|in|around|on|for)\\s+(the\\s+)?)?(afternoon|evening|midnight|lunchtime))|((at|in|around|on|for)\\s+(the\\s+)?night))";
    const PmRegexFull = "(?<pm>((at|in|around|on|for)\\s+(the\\s+)?)?(afternoon|evening|midnight|night|lunchtime))";
    const AmRegex = "(?<am>((at|in|around|on|for)\\s+(the\\s+)?)?(morning))";
    const LunchRegex = "\\b(lunchtime)\\b";
    const NightRegex = "\\b(midnight|night)\\b";
    const CommonDatePrefixRegex = "^[\\.]";
    const LessThanOneHour: string;
    const WrittenTimeRegex: string;
    const TimePrefix: string;
    const TimeSuffix: string;
    const TimeSuffixFull: string;
    const BasicTime: string;
    const MidnightRegex = "(?<midnight>midnight|mid-night|mid night)";
    const MidmorningRegex = "(?<midmorning>midmorning|mid-morning|mid morning)";
    const MidafternoonRegex = "(?<midafternoon>midafternoon|mid-afternoon|mid afternoon)";
    const MiddayRegex = "(?<midday>midday|mid-day|mid day|((12\\s)?noon))";
    const MidTimeRegex: string;
    const AtRegex: string;
    const IshRegex: string;
    const TimeUnitRegex = "([^A-Za-z]{1,}|\\b)(?<unit>hours|hour|hrs|hr|h|minutes|minute|mins|min|seconds|second|secs|sec)\\b";
    const RestrictedTimeUnitRegex = "(?<unit>hour|minute)\\b";
    const FivesRegex = "(?<tens>(fifteen|twenty(\\s*five)?|thirty(\\s*five)?|forty(\\s*five)?|fourty(\\s*five)?|fifty(\\s*five)?|ten|five))\\b";
    const HourRegex: string;
    const PeriodHourNumRegex = "\\b(?<hour>twenty one|twenty two|twenty three|twenty four|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\\b";
    const ConnectNumRegex: string;
    const TimeRegexWithDotConnector: string;
    const TimeRegex1: string;
    const TimeRegex2: string;
    const TimeRegex3: string;
    const TimeRegex4: string;
    const TimeRegex5: string;
    const TimeRegex6: string;
    const TimeRegex7: string;
    const TimeRegex8: string;
    const TimeRegex9: string;
    const TimeRegex10: string;
    const TimeRegex11: string;
    const FirstTimeRegexInTimeRange: string;
    const PureNumFromTo: string;
    const PureNumBetweenAnd: string;
    const SpecificTimeFromTo: string;
    const SpecificTimeBetweenAnd: string;
    const PrepositionRegex = "(?<prep>^(at|on|of)(\\s+the)?$)";
    const TimeOfDayRegex = "\\b(?<timeOfDay>((((in\\s+(the)?\\s+)?((?<early>early(\\s+|-))|(?<late>late(\\s+|-)))?(morning|afternoon|night|evening)))|(((in\\s+(the)?\\s+)?)(daytime|business\\s+hour)))s?)\\b";
    const SpecificTimeOfDayRegex: string;
    const TimeFollowedUnit: string;
    const TimeNumberCombinedWithUnit: string;
    const BusinessHourSplitStrings: string[];
    const NowRegex = "\\b(?<now>(right\\s+)?now|as soon as possible|asap|recently|previously)\\b";
    const SuffixRegex = "^\\s*(in the\\s+)?(morning|afternoon|evening|night)\\b";
    const DateTimeTimeOfDayRegex = "\\b(?<timeOfDay>morning|afternoon|night|evening)\\b";
    const DateTimeSpecificTimeOfDayRegex: string;
    const TimeOfTodayAfterRegex: string;
    const TimeOfTodayBeforeRegex: string;
    const SimpleTimeOfTodayAfterRegex: string;
    const SimpleTimeOfTodayBeforeRegex: string;
    const TheEndOfRegex = "(the\\s+)?end of(\\s+the)?\\s*$";
    const PeriodTimeOfDayRegex = "\\b((in\\s+(the)?\\s+)?((?<early>early(\\s+|-))|(?<late>late(\\s+|-)))?(?<timeOfDay>morning|afternoon|night|evening))\\b";
    const PeriodSpecificTimeOfDayRegex: string;
    const PeriodTimeOfDayWithDateRegex: string;
    const LessThanRegex = "\\b(less\\s+than)\\b";
    const MoreThanRegex = "\\b(more\\s+than)\\b";
    const DurationUnitRegex: string;
    const SuffixAndRegex = "(?<suffix>\\s*(and)\\s+((an|a)\\s+)?(?<suffix_num>half|quarter))";
    const PeriodicRegex = "\\b(?<periodic>daily|monthly|weekly|biweekly|yearly|annually|annual)\\b";
    const EachUnitRegex: string;
    const EachPrefixRegex = "\\b(?<each>(each|(every))\\s*$)";
    const SetEachRegex = "\\b(?<each>(each|(every))\\s*)";
    const SetLastRegex = "(?<last>following|next|upcoming|this|last|past|previous|current)";
    const EachDayRegex = "^\\s*(each|every)\\s*day\\b";
    const DurationFollowedUnit: string;
    const NumberCombinedWithDurationUnit: string;
    const AnUnitRegex: string;
    const DuringRegex = "\\b(for|during)\\s+the\\s+(?<unit>year|month|week|day)\\b";
    const AllRegex = "\\b(?<all>(all|full|whole)(\\s+|-)(?<unit>year|month|week|day))\\b";
    const HalfRegex = "(((a|an)\\s*)|\\b)(?<half>half\\s+(?<unit>year|month|week|day|hour))\\b";
    const ConjunctionRegex = "\\b((and(\\s+for)?)|with)\\b";
    const HolidayRegex1: string;
    const HolidayRegex2: string;
    const HolidayRegex3: string;
    const AMTimeRegex = "(?<am>morning)";
    const PMTimeRegex = "\\b(?<pm>afternoon|evening|night)\\b";
    const InclusiveModPrepositions = "(?<include>((on|in|at)\\s+or\\s+)|(\\s+or\\s+(on|in|at)))";
    const BeforeRegex: string;
    const AfterRegex: string;
    const SinceRegex = "(\\b(since|after\\s+or\\s+equal\\s+to|starting\\s+(from|on|with)|as\\s+early\\s+as|any\\s+time\\s+from)\\b\\s*)|(?<!\\w|<)(>=)";
    const AroundRegex = "(\\b(around|circa)\\s*\\b)";
    const AgoRegex = "\\b(ago|before\\s+(?<day>yesterday|today))\\b";
    const LaterRegex = "\\b(later|from now|(from|after) (?<day>tomorrow|tmr|today))\\b";
    const InConnectorRegex = "\\b(in)\\b";
    const WithinNextPrefixRegex: string;
    const AmPmDescRegex = "(ampm)";
    const MorningStartEndRegex: string;
    const AfternoonStartEndRegex: string;
    const EveningStartEndRegex = "(^(evening))|((evening)$)";
    const NightStartEndRegex = "(^(overnight|tonight|night))|((overnight|tonight|night)$)";
    const InexactNumberRegex = "\\b(a few|few|some|several|(?<NumTwoTerm>(a\\s+)?couple(\\s+of)?))\\b";
    const InexactNumberUnitRegex: string;
    const RelativeTimeUnitRegex: string;
    const RelativeDurationUnitRegex: string;
    const ReferenceDatePeriodRegex: string;
    const ConnectorRegex = "^(-|,|for|t|around|@)$";
    const FromToRegex = "\\b(from).+(to)\\b.+";
    const SingleAmbiguousMonthRegex = "^(the\\s+)?(may|march)$";
    const SingleAmbiguousTermsRegex = "^(the\\s+)?(day|week|month|year)$";
    const UnspecificDatePeriodRegex = "^(week|weekend|month|year)$";
    const PrepositionSuffixRegex = "\\b(on|in|at|around|from|to)$";
    const FlexibleDayRegex = "(?<DayOfMonth>([A-Za-z]+\\s)?[A-Za-z\\d]+)";
    const ForTheRegex: string;
    const WeekDayAndDayOfMonthRegex: string;
    const RestOfDateRegex = "\\bRest\\s+(of\\s+)?((the|my|this|current)\\s+)?(?<duration>week|month|year|decade)\\b";
    const RestOfDateTimeRegex = "\\bRest\\s+(of\\s+)?((the|my|this|current)\\s+)?(?<unit>day)\\b";
    const MealTimeRegex = "\\b(at\\s+)?(?<mealTime>lunchtime)\\b";
    const NumberEndingPattern: string;
    const OneOnOneRegex = "\\b(1\\s*:\\s*1)|(one (on )?one|one\\s*-\\s*one|one\\s*:\\s*one)\\b";
    const LaterEarlyPeriodRegex: string;
    const WeekWithWeekDayRangeRegex: string;
    const GeneralEndingRegex = "^\\s*((\\.,)|\\.|,|!|\\?)?\\s*$";
    const MiddlePauseRegex = "\\s*(,)\\s*";
    const DurationConnectorRegex = "^\\s*(?<connector>\\s+|and|,)\\s*$";
    const PrefixArticleRegex = "\\bthe\\s+";
    const OrRegex = "\\s*((\\b|,\\s*)(or|and)\\b|,)\\s*";
    const YearPlusNumberRegex: string;
    const NumberAsTimeRegex: string;
    const TimeBeforeAfterRegex: string;
    const DateNumberConnectorRegex = "^\\s*(?<connector>\\s+at)\\s*$";
    const DecadeRegex = "(?<decade>noughties|twenties|thirties|forties|fifties|sixties|seventies|eighties|nineties|two thousands)";
    const DecadeWithCenturyRegex: string;
    const RelativeDecadeRegex: string;
    const DateAfterRegex = "\\b((or|and)\\s+(above|after|later|greater)(?!\\s+than))\\b";
    const YearPeriodRegex: string;
    const ComplexDatePeriodRegex: string;
    const UnitMap: ReadonlyMap<string, string>;
    const UnitValueMap: ReadonlyMap<string, number>;
    const SeasonMap: ReadonlyMap<string, string>;
    const SeasonValueMap: ReadonlyMap<string, number>;
    const CardinalMap: ReadonlyMap<string, number>;
    const DayOfWeek: ReadonlyMap<string, number>;
    const MonthOfYear: ReadonlyMap<string, number>;
    const Numbers: ReadonlyMap<string, number>;
    const DayOfMonth: ReadonlyMap<string, number>;
    const DoubleNumbers: ReadonlyMap<string, number>;
    const HolidayNames: ReadonlyMap<string, string[]>;
    const WrittenDecades: ReadonlyMap<string, number>;
    const SpecialDecadeCases: ReadonlyMap<string, number>;
    const DefaultLanguageFallback = "MDY";
    const SuperfluousWordList: string[];
    const DurationDateRestrictions: string[];
    const AmbiguityFiltersDict: ReadonlyMap<string, string>;
}

export declare namespace ChineseDateTime {
    const MonthRegex = "(?<month>正月|一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月|01月|02月|03月|04月|05月|06月|07月|08月|09月|10月|11月|12月|1月|2月|3月|4月|5月|6月|7月|8月|9月|大年)";
    const DayRegex = "(?<day>01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|1|2|3|4|5|6|7|8|9)";
    const DateDayRegexInChinese = "(?<day>初一|三十|一日|十一日|二十一日|三十一日|二日|三日|四日|五日|六日|七日|八日|九日|十二日|十三日|十四日|十五日|十六日|十七日|十八日|十九日|二十二日|二十三日|二十四日|二十五日|二十六日|二十七日|二十八日|二十九日|一日|十一日|十日|二十一日|二十日|三十一日|三十日|二日|三日|四日|五日|六日|七日|八日|九日|十二日|十三日|十四日|十五日|十六日|十七日|十八日|十九日|二十二日|二十三日|二十四日|二十五日|二十六日|二十七日|二十八日|二十九日|十日|二十日|三十日|10日|11日|12日|13日|14日|15日|16日|17日|18日|19日|1日|20日|21日|22日|23日|24日|25日|26日|27日|28日|29日|2日|30日|31日|3日|4日|5日|6日|7日|8日|9日|一号|十一号|二十一号|三十一号|二号|三号|四号|五号|六号|七号|八号|九号|十二号|十三号|十四号|十五号|十六号|十七号|十八号|十九号|二十二号|二十三号|二十四号|二十五号|二十六号|二十七号|二十八号|二十九号|一号|十一号|十号|二十一号|二十号|三十一号|三十号|二号|三号|四号|五号|六号|七号|八号|九号|十二号|十三号|十四号|十五号|十六号|十七号|十八号|十九号|二十二号|二十三号|二十四号|二十五号|二十六号|二十七号|二十八号|二十九号|十号|二十号|三十号|10号|11号|12号|13号|14号|15号|16号|17号|18号|19号|1号|20号|21号|22号|23号|24号|25号|26号|27号|28号|29号|2号|30号|31号|3号|4号|5号|6号|7号|8号|9号)";
    const DayRegexNumInChinese = "(?<day>一|十一|二十一|三十一|二|三|四|五|六|七|八|九|十二|十三|十四|十五|十六|十七|十八|十九|二十二|二十三|二十四|二十五|二十六|二十七|二十八|二十九|一|十一|十|二十一|二十|三十一|三十|二|三|四|五|六|七|八|九|十二|十三|十四|十五|十六|十七|十八|十九|二十二|二十三|二十四|二十五|二十六|二十七|二十八|二十九|十|二十|廿|卅)";
    const MonthNumRegex = "(?<month>01|02|03|04|05|06|07|08|09|10|11|12|1|2|3|4|5|6|7|8|9)";
    const TwoNumYear = "50";
    const YearNumRegex = "(?<year>((1[5-9]|20)\\d{2})|2100)";
    const YearRegex = "(?<year>(\\d{2,4}))";
    const ZeroToNineIntegerRegexChs = "[一二三四五六七八九零壹贰叁肆伍陆柒捌玖〇两千俩倆仨]";
    const DateYearInChineseRegex: string;
    const WeekDayRegex = "(?<weekday>周日|周天|周一|周二|周三|周四|周五|周六|星期一|星期二|星期三|星期四|星期五|星期六|星期日|星期天|礼拜一|礼拜二|礼拜三|礼拜四|礼拜五|礼拜六|礼拜日|礼拜天|禮拜一|禮拜二|禮拜三|禮拜四|禮拜五|禮拜六|禮拜日|禮拜天|週日|週天|週一|週二|週三|週四|週五|週六)";
    const LunarRegex = "(农历|初一|正月|大年)";
    const DateThisRegex: string;
    const DateLastRegex: string;
    const DateNextRegex: string;
    const SpecialDayRegex = "(最近|前天|后天|昨天|明天|今天|今日|明日|昨日|大后天|大前天|後天|大後天)";
    const SpecialDayWithNumRegex = "^[.]";
    const WeekDayOfMonthRegex: string;
    const DateThisRe = "这个|这一个|这|这一|本|今";
    const DateLastRe = "上个|上一个|上|上一|去";
    const DateNextRe = "下个|下一个|下|下一|明";
    const SpecialDate: string;
    const DateUnitRegex = "(?<unit>年|个月|周|日|天)";
    const BeforeRegex = "以前|之前|前";
    const AfterRegex = "以后|以後|之后|之後|后|後";
    const DateRegexList1: string;
    const DateRegexList2: string;
    const DateRegexList3: string;
    const DateRegexList4: string;
    const DateRegexList5: string;
    const DateRegexList6: string;
    const DateRegexList7: string;
    const DateRegexList8: string;
    const DatePeriodTillRegex = "(?<till>到|至|--|-|—|——|~|–)";
    const DatePeriodTillSuffixRequiredRegex = "(?<till>与|和)";
    const DatePeriodDayRegexInChinese = "(?<day>初一|三十|一日|十一日|二十一日|三十一日|二日|三日|四日|五日|六日|七日|八日|九日|十二日|十三日|十四日|十五日|十六日|十七日|十八日|十九日|二十二日|二十三日|二十四日|二十五日|二十六日|二十七日|二十八日|二十九日|一日|十一日|十日|二十一日|二十日|三十一日|三十日|二日|三日|四日|五日|六日|七日|八日|九日|十二日|十三日|十四日|十五日|十六日|十七日|十八日|十九日|二十二日|二十三日|二十四日|二十五日|二十六日|二十七日|二十八日|二十九日|十日|二十日|三十日|10日|11日|12日|13日|14日|15日|16日|17日|18日|19日|1日|20日|21日|22日|23日|24日|25日|26日|27日|28日|29日|2日|30日|31日|3日|4日|5日|6日|7日|8日|9日|一号|十一号|二十一号|三十一号|二号|三号|四号|五号|六号|七号|八号|九号|十二号|十三号|十四号|十五号|十六号|十七号|十八号|十九号|二十二号|二十三号|二十四号|二十五号|二十六号|二十七号|二十八号|二十九号|一号|十一号|十号|二十一号|二十号|三十一号|三十号|二号|三号|四号|五号|六号|七号|八号|九号|十二号|十三号|十四号|十五号|十六号|十七号|十八号|十九号|二十二号|二十三号|二十四号|二十五号|二十六号|二十七号|二十八号|二十九号|十号|二十号|三十号|10号|11号|12号|13号|14号|15号|16号|17号|18号|19号|1号|20号|21号|22号|23号|24号|25号|26号|27号|28号|29号|2号|30号|31号|3号|4号|5号|6号|7号|8号|9号|一|十一|二十一|三十一|二|三|四|五|六|七|八|九|十二|十三|十四|十五|十六|十七|十八|十九|二十二|二十三|二十四|二十五|二十六|二十七|二十八|二十九|一|十一|十|二十一|二十|三十一|三十|二|三|四|五|六|七|八|九|十二|十三|十四|十五|十六|十七|十八|十九|二十二|二十三|二十四|二十五|二十六|二十七|二十八|二十九|十|二十|三十||廿|卅)";
    const DatePeriodThisRegex = "这个|这一个|这|这一|本";
    const DatePeriodLastRegex = "上个|上一个|上|上一";
    const DatePeriodNextRegex = "下个|下一个|下|下一";
    const RelativeMonthRegex: string;
    const DatePeriodYearRegex: string;
    const StrictYearRegex: string;
    const YearRegexInNumber = "(?<year>(\\d{3,4}))";
    const DatePeriodYearInChineseRegex: string;
    const MonthSuffixRegex: string;
    const SimpleCasesRegex: string;
    const YearAndMonth: string;
    const PureNumYearAndMonth: string;
    const OneWordPeriodRegex: string;
    const WeekOfMonthRegex: string;
    const UnitRegex = "(?<unit>年|(个)?月|周|日|天)";
    const FollowedUnit: string;
    const NumberCombinedWithUnit: string;
    const DateRangePrepositions = "((从|在|自)\\s*)?";
    const YearToYear: string;
    const YearToYearSuffixRequired: string;
    const MonthToMonth: string;
    const MonthToMonthSuffixRequired: string;
    const PastRegex = "(?<past>(前|上|之前|近|过去))";
    const FutureRegex = "(?<future>(后|後|(?<![一两几]\\s*)下|之后|之後|未来(的)?))";
    const SeasonRegex = "(?<season>春|夏|秋|冬)(天|季)?";
    const SeasonWithYear: string;
    const QuarterRegex: string;
    const CenturyRegex = "(?<century>\\d|1\\d|2\\d)世纪";
    const CenturyRegexInChinese = "(?<century>一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|二十一|二十二)世纪";
    const RelativeCenturyRegex: string;
    const DecadeRegexInChinese = "(?<decade>十|一十|二十|三十|四十|五十|六十|七十|八十|九十)";
    const DecadeRegex: string;
    const PrepositionRegex = "(?<prep>^的|在$)";
    const NowRegex = "(?<now>现在|马上|立刻|刚刚才|刚刚|刚才)";
    const NightRegex = "(?<night>早|晚)";
    const TimeOfTodayRegex = "(今晚|今早|今晨|明晚|明早|明晨|昨晚)(的|在)?";
    const DateTimePeriodTillRegex = "(?<till>到|直到|--|-|—|——)";
    const DateTimePeriodPrepositionRegex = "(?<prep>^\\s*的|在\\s*$)";
    const HourRegex: string;
    const HourNumRegex = "(?<hour>[零〇一二两三四五六七八九]|二十[一二三四]?|十[一二三四五六七八九]?)";
    const ZhijianRegex = "^\\s*(之间|之内|期间|中间|间)";
    const DateTimePeriodThisRegex = "这个|这一个|这|这一";
    const DateTimePeriodLastRegex = "上个|上一个|上|上一";
    const DateTimePeriodNextRegex = "下个|下一个|下|下一";
    const AmPmDescRegex = "(?<daydesc>(am|a\\.m\\.|a m|a\\. m\\.|a\\.m|a\\. m|a m|pm|p\\.m\\.|p m|p\\. m\\.|p\\.m|p\\. m|p m))";
    const TimeOfDayRegex = "(?<timeOfDay>凌晨|清晨|早上|早|上午|中午|下午|午后|晚上|夜里|夜晚|半夜|夜间|深夜|傍晚|晚)";
    const SpecificTimeOfDayRegex: string;
    const DateTimePeriodUnitRegex = "(个)?(?<unit>(小时|分钟|秒钟|时|分|秒))";
    const DateTimePeriodFollowedUnit: string;
    const DateTimePeriodNumberCombinedWithUnit: string;
    const DurationYearRegex = "((\\d{3,4})|0\\d|两千)\\s*年";
    const DurationHalfSuffixRegex = "半";
    const DurationSuffixList: ReadonlyMap<string, string>;
    const DurationAmbiguousUnits: string[];
    const LunarHolidayRegex: string;
    const HolidayRegexList1: string;
    const HolidayRegexList2: string;
    const SetUnitRegex = "(?<unit>年|月|周|星期|日|天|小时|时|分钟|分|秒钟|秒)";
    const SetEachUnitRegex: string;
    const SetEachPrefixRegex = "(?<each>(每)\\s*$)";
    const SetLastRegex = "(?<last>last|this|next)";
    const SetEachDayRegex = "(每|每一)(天|日)\\s*$";
    const TimeHourNumRegex = "(00|01|02|03|04|05|06|07|08|09|0|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|1|2|3|4|5|6|7|8|9)";
    const TimeMinuteNumRegex = "(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|0|1|2|3|4|5|6|7|8|9)";
    const TimeSecondNumRegex = "(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|0|1|2|3|4|5|6|7|8|9)";
    const TimeHourChsRegex = "([零〇一二两三四五六七八九]|二十[一二三四]?|十[一二三四五六七八九]?)";
    const TimeMinuteChsRegex = "([二三四五]?十[一二三四五六七八九]?|六十|[零〇一二三四五六七八九])";
    const TimeSecondChsRegex: string;
    const TimeClockDescRegex = "(点\\s*整|点\\s*钟|点|时)";
    const TimeMinuteDescRegex = "(分钟|分|)";
    const TimeSecondDescRegex = "(秒钟|秒)";
    const TimeBanHourPrefixRegex = "(第)";
    const TimeHourRegex: string;
    const TimeMinuteRegex: string;
    const TimeSecondRegex: string;
    const TimeHalfRegex = "(?<half>过半|半)";
    const TimeQuarterRegex = "(?<quarter>[一两二三四1-4])\\s*(刻钟|刻)";
    const TimeChineseTimeRegex: string;
    const TimeDigitTimeRegex: string;
    const TimeDayDescRegex = "(?<daydesc>凌晨|清晨|早上|早|上午|中午|下午|午后|晚上|夜里|夜晚|半夜|午夜|夜间|深夜|傍晚|晚)";
    const TimeApproximateDescPreffixRegex = "(大[约概]|差不多|可能|也许|约|不超过|不多[于过]|最[多长少]|少于|[超短长多]过|几乎要|将近|差点|快要|接近|至少|起码|超出|不到)";
    const TimeApproximateDescSuffixRegex = "(之前|以前|以后|以後|之后|之後|前|后|後|左右)";
    const TimeRegexes1: string;
    const TimeRegexes2: string;
    const TimeRegexes3: string;
    const TimePeriodTimePeriodConnectWords = "(起|至|到|–|-|—|~|～)";
    const TimePeriodLeftChsTimeRegex: string;
    const TimePeriodRightChsTimeRegex: string;
    const TimePeriodLeftDigitTimeRegex: string;
    const TimePeriodRightDigitTimeRegex: string;
    const TimePeriodShortLeftChsTimeRegex: string;
    const TimePeriodShortLeftDigitTimeRegex: string;
    const TimePeriodRegexes1: string;
    const TimePeriodRegexes2: string;
    const ParserConfigurationBefore = "(之前|以前|前)";
    const ParserConfigurationAfter = "(之后|之後|以后|以後|后|後)";
    const ParserConfigurationUntil = "(直到|直至|截至|截止(到)?)";
    const ParserConfigurationSincePrefix = "(自从|自|自打|打)";
    const ParserConfigurationSinceSuffix = "(以来|开始)";
    const ParserConfigurationLastWeekDayToken = "最后一个";
    const ParserConfigurationNextMonthToken = "下一个";
    const ParserConfigurationLastMonthToken = "上一个";
    const ParserConfigurationDatePrefix = " ";
    const ParserConfigurationUnitMap: ReadonlyMap<string, string>;
    const ParserConfigurationUnitValueMap: ReadonlyMap<string, number>;
    const ParserConfigurationSeasonMap: ReadonlyMap<string, string>;
    const ParserConfigurationSeasonValueMap: ReadonlyMap<string, number>;
    const ParserConfigurationCardinalMap: ReadonlyMap<string, number>;
    const ParserConfigurationDayOfMonth: ReadonlyMap<string, number>;
    const ParserConfigurationDayOfWeek: ReadonlyMap<string, number>;
    const ParserConfigurationMonthOfYear: ReadonlyMap<string, number>;
    const DateTimeSimpleAmRegex = "(?<am>早|晨)";
    const DateTimeSimplePmRegex = "(?<pm>晚)";
    const DateTimePeriodMORegex = "(凌晨|清晨|早上|早|上午)";
    const DateTimePeriodAFRegex = "(中午|下午|午后|傍晚)";
    const DateTimePeriodEVRegex = "(晚上|夜里|夜晚|晚)";
    const DateTimePeriodNIRegex = "(半夜|夜间|深夜)";
    const DurationUnitValueMap: ReadonlyMap<string, number>;
    const HolidayNoFixedTimex: ReadonlyMap<string, string>;
    const MergedBeforeRegex = "(前|之前)$";
    const MergedAfterRegex = "(后|後|之后|之後)$";
    const TimeNumberDictionary: ReadonlyMap<string, number>;
    const TimeLowBoundDesc: ReadonlyMap<string, number>;
    const DefaultLanguageFallback = "DMY";
}
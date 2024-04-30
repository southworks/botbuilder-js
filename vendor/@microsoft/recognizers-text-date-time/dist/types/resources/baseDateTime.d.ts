export declare namespace BaseDateTime {
    const HourRegex = "(?<hour>00|01|02|03|04|05|06|07|08|09|0|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|1|2|3|4|5|6|7|8|9)(h)?";
    const MinuteRegex = "(?<min>00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|0|1|2|3|4|5|6|7|8|9)(?!\\d)";
    const DeltaMinuteRegex = "(?<deltamin>00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|0|1|2|3|4|5|6|7|8|9)";
    const SecondRegex = "(?<sec>00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|0|1|2|3|4|5|6|7|8|9)";
    const FourDigitYearRegex = "\\b(?<![$])(?<year>((1\\d|20)\\d{2})|2100)(?!\\.0\\b)\\b";
    const IllegalYearRegex: string;
    const MinYearNum = "1500";
    const MaxYearNum = "2100";
    const MaxTwoDigitYearFutureNum = "30";
    const MinTwoDigitYearPastNum = "70";
    const DayOfMonthDictionary: ReadonlyMap<string, number>;
    const VariableHolidaysTimexDictionary: ReadonlyMap<string, string>;
}

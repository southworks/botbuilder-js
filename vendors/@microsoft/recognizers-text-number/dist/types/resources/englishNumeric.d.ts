export declare namespace EnglishNumeric {
    const LangMarker = "Eng";
    const CompoundNumberLanguage = false;
    const MultiDecimalSeparatorCulture = true;
    const NonStandardSeparatorVariants: string[];
    const RoundNumberIntegerRegex = "(?:hundred|thousand|million|mln|billion|bln|trillion|tln|lakh|crore)s?";
    const ZeroToNineIntegerRegex = "(?:three|seven|eight|four|five|zero|n[ao]ught|nine|one|two|six)";
    const TwoToNineIntegerRegex = "(?:three|seven|eight|four|five|nine|two|six)";
    const NegativeNumberTermsRegex = "(?<negTerm>(minus|negative)\\s+)";
    const NegativeNumberSignRegex: string;
    const AnIntRegex = "(an?)(?=\\s)";
    const TenToNineteenIntegerRegex = "(?:seventeen|thirteen|fourteen|eighteen|nineteen|fifteen|sixteen|eleven|twelve|ten)";
    const TensNumberIntegerRegex = "(?:seventy|twenty|thirty|eighty|ninety|forty|fifty|sixty)";
    const SeparaIntRegex: string;
    const AllIntRegex: string;
    const PlaceHolderPureNumber = "\\b";
    const PlaceHolderDefault = "(?=\\D)|\\b";
    const PlaceHolderMixed = "\\D|\\b";
    const NumbersWithPlaceHolder: (placeholder: string) => string;
    const IndianNumberingSystemRegex = "(?<=\\b)((?:\\d{1,2},(?:\\d{2},)*\\d{3})(?=\\b))";
    const NumbersWithSuffix: string;
    const RoundNumberIntegerRegexWithLocks: string;
    const NumbersWithDozenSuffix: string;
    const AllIntRegexWithLocks: string;
    const AllIntRegexWithDozenSuffixLocks: string;
    const RoundNumberOrdinalRegex = "(?:hundredth|thousandth|millionth|billionth|trillionth)";
    const NumberOrdinalRegex = "(?:first|second|third|fourth|fifth|sixth|seventh|eighth|nine?th|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|thirtieth|fortieth|fiftieth|sixtieth|seventieth|eightieth|ninetieth)";
    const RelativeOrdinalRegex = "(?<relativeOrdinal>(next|previous|current)\\s+one|(the\\s+second|next)\\s+to\\s+last|the\\s+one\\s+before\\s+the\\s+last(\\s+one)?|the\\s+last\\s+but\\s+one|(ante)?penultimate|last|next|previous|current)";
    const SuffixBasicOrdinalRegex: string;
    const SuffixRoundNumberOrdinalRegex: string;
    const AllOrdinalNumberRegex: string;
    const AllOrdinalRegex: string;
    const OrdinalSuffixRegex = "(?<=\\b)(?:(\\d*(1st|2nd|3rd|[4-90]th))|(1[1-2]th))(?=\\b)";
    const OrdinalNumericRegex = "(?<=\\b)(?:\\d{1,3}(\\s*,\\s*\\d{3})*\\s*th)(?=\\b)";
    const OrdinalRoundNumberRegex: string;
    const OrdinalEnglishRegex: string;
    const FractionNotationWithSpacesRegex = "(((?<=\\W|^)-\\s*)|(?<=\\b))\\d+\\s+\\d+[/]\\d+(?=(\\b[^/]|$))";
    const FractionNotationRegex: string;
    const FractionMultiplierRegex: string;
    const RoundMultiplierWithFraction: string;
    const RoundMultiplierRegex: string;
    const FractionNounRegex: string;
    const FractionNounWithArticleRegex: string;
    const FractionPrepositionRegex: string;
    const FractionPrepositionWithinPercentModeRegex: string;
    const AllPointRegex: string;
    const AllFloatRegex: string;
    const DoubleWithMultiplierRegex: string;
    const DoubleExponentialNotationRegex: string;
    const DoubleCaretExponentialNotationRegex: string;
    const DoubleDecimalPointRegex: (placeholder: string) => string;
    const DoubleIndianDecimalPointRegex = "(?<=\\b)((?:\\d{1,2},(?:\\d{2},)*\\d{3})(?:\\.\\d{2})(?=\\b))";
    const DoubleWithoutIntegralRegex: (placeholder: string) => string;
    const DoubleWithRoundNumber: string;
    const DoubleAllFloatRegex: string;
    const ConnectorRegex = "(?<spacer>and)";
    const NumberWithSuffixPercentage: string;
    const FractionNumberWithSuffixPercentage: string;
    const NumberWithPrefixPercentage: string;
    const NumberWithPrepositionPercentage: string;
    const TillRegex = "((?<!\\bequal\\s+)to|through|--|-|\u2014|\u2014\u2014|~|\u2013)";
    const MoreRegex = "(?:(bigger|greater|more|higher|larger)(\\s+than)?|above|over|beyond|exceed(ed|ing)?|surpass(ed|ing)?|(?<!<|=)>)";
    const LessRegex = "(?:(less|lower|smaller|fewer)(\\s+than)?|below|under|(?<!>|=)<)";
    const EqualRegex = "(equal(s|ing)?(\\s+(to|than))?|(?<!<|>)=)";
    const MoreOrEqualPrefix: string;
    const MoreOrEqual: string;
    const MoreOrEqualSuffix = "((and|or)\\s+(((more|greater|higher|larger|bigger)((?!\\s+than)|(\\s+than(?!((\\s+or\\s+equal\\s+to)?\\s*\\d+)))))|((over|above)(?!\\s+than))))";
    const LessOrEqualPrefix: string;
    const LessOrEqual: string;
    const LessOrEqualSuffix = "((and|or)\\s+(less|lower|smaller|fewer)((?!\\s+than)|(\\s+than(?!(\\s*\\d+)))))";
    const NumberSplitMark: string;
    const MoreRegexNoNumberSucceed = "((bigger|greater|more|higher|larger)((?!\\s+than)|\\s+(than(?!(\\s*\\d+))))|(above|over)(?!(\\s*\\d+)))";
    const LessRegexNoNumberSucceed = "((less|lower|smaller|fewer)((?!\\s+than)|\\s+(than(?!(\\s*\\d+))))|(below|under)(?!(\\s*\\d+)))";
    const EqualRegexNoNumberSucceed = "(equal(s|ing)?((?!\\s+(to|than))|(\\s+(to|than)(?!(\\s*\\d+)))))";
    const OneNumberRangeMoreRegex1: string;
    const OneNumberRangeMoreRegex1LB: string;
    const OneNumberRangeMoreRegex2: string;
    const OneNumberRangeMoreSeparateRegex: string;
    const OneNumberRangeLessRegex1: string;
    const OneNumberRangeLessRegex1LB: string;
    const OneNumberRangeLessRegex2: string;
    const OneNumberRangeLessSeparateRegex: string;
    const OneNumberRangeEqualRegex: string;
    const TwoNumberRangeRegex1: string;
    const TwoNumberRangeRegex2: string;
    const TwoNumberRangeRegex3: string;
    const TwoNumberRangeRegex4: string;
    const AmbiguousFractionConnectorsRegex = "(\\bin\\b)";
    const DecimalSeparatorChar = ".";
    const FractionMarkerToken = "over";
    const NonDecimalSeparatorChar = ",";
    const HalfADozenText = "six";
    const WordSeparatorToken = "and";
    const WrittenDecimalSeparatorTexts: string[];
    const WrittenGroupSeparatorTexts: string[];
    const WrittenIntegerSeparatorTexts: string[];
    const WrittenFractionSeparatorTexts: string[];
    const HalfADozenRegex = "half\\s+a\\s+dozen";
    const DigitalNumberRegex: string;
    const CardinalNumberMap: ReadonlyMap<string, number>;
    const OrdinalNumberMap: ReadonlyMap<string, number>;
    const RoundNumberMap: ReadonlyMap<string, number>;
    const AmbiguityFiltersDict: ReadonlyMap<string, string>;
    const RelativeReferenceOffsetMap: ReadonlyMap<string, string>;
    const RelativeReferenceRelativeToMap: ReadonlyMap<string, string>;
}
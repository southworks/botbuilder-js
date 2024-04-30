export declare namespace ChineseNumeric {
    const LangMarker = "Chi";
    const CompoundNumberLanguage = true;
    const MultiDecimalSeparatorCulture = false;
    const DecimalSeparatorChar = ".";
    const FractionMarkerToken = "";
    const NonDecimalSeparatorChar = " ";
    const HalfADozenText = "";
    const WordSeparatorToken = "";
    const ZeroChar = "\u96F6";
    const PairChar = "\u5BF9";
    const RoundNumberMap: ReadonlyMap<string, number>;
    const RoundNumberMapChar: ReadonlyMap<string, number>;
    const ZeroToNineMap: ReadonlyMap<string, number>;
    const FullToHalfMap: ReadonlyMap<string, string>;
    const TratoSimMap: ReadonlyMap<string, string>;
    const UnitMap: ReadonlyMap<string, string>;
    const RoundDirectList: string[];
    const TenChars: string[];
    const DigitalNumberRegex: string;
    const ZeroToNineFullHalfRegex = "[\\d]";
    const DigitNumRegex: string;
    const DozenRegex = ".*\u6253$";
    const PercentageRegex = "(?<=(((?<![\u5341\u767E\u5343\u62FE\u4F70\u4EDF])[\u5341\u767E\u5343\u62FE\u4F70\u4EDF])|([\u4E07\u4EBF\u5146\u842C\u5104]))\\s*\u5206\\s*\u4E4B).+|.+(?=\u4E2A\\s*(((?<![\u5341\u767E\u5343\u62FE\u4F70\u4EDF])[\u5341\u767E\u5343\u62FE\u4F70\u4EDF])|([\u4E07\u4EBF\u5146\u842C\u5104]))\\s*\u5206\\s*\u70B9)|.*(?=[\uFF05%])";
    const DoubleAndRoundRegex: string;
    const FracSplitRegex = "\u53C8|\u5206\\s*\u4E4B|\u5206\\s*\u70B9";
    const ZeroToNineIntegerRegex = "[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u96F6\u58F9\u8D30\u8CB3\u53C1\u8086\u4F0D\u9646\u9678\u67D2\u634C\u7396\u3007\u4E24\u5169\u4FE9\u5006\u4EE8]";
    const DigitNumPlusRegex: string;
    const HalfUnitRegex = "\u534A";
    const NegativeNumberTermsRegex = "[\u8D1F\u8CA0]";
    const NegativeNumberTermsRegexNum: string;
    const NegativeNumberTermsRegexAll: string;
    const NegativeNumberSignRegex: string;
    const SpeGetNumberRegex: string;
    const PairRegex = ".*[\u53CC\u5BF9\u96D9\u5C0D]$";
    const KiloUnitNames = "[\u7C73\u514B\u4F4D\u7126\u5361\u8D6B\u74E6]|\u6BD4\u7279|\u5B57\u8282|\u5927\u5361";
    const MegaUnitNames = "[\u4F4D\u8D6B\u74E6]|\u6BD4\u7279|\u5B57\u8282";
    const RoundNumberIntegerRegex: string;
    const PercentageNumRegex = "(([\u5341\u767E\u5343\u62FE\u4F70\u4EDF])|([\u4E07\u4EBF\u5146\u842C\u5104])){1,3}\\s*\u5206(\\s*\u4E4B|\\s*\u70B9)";
    const AllowListRegex = "([\u3002\uFF0C\u3001\uFF08\uFF09\u201C\u201D]|[\u8FD9\u90A3\u4E0D\u4E5F\u8FD8\u800C\u5374\u66F4\u4F46\u9019\u9084\u537B]?\u662F|[\u5230\u4EE5\u81F3]|[\u56FD\u570B]|\u5468|\u591C|[\u70B9\u9EDE]|[\u4E2A\u500B]|\u500D|\u7968|[\u9879\u9805]|[\u4EA9\u755D]|\u5206|\u5143|\u89D2|\u5929|[\u53CC\u96D9]|[\u5BF9\u5C0D]|\u52A0|[\u51CF\u6E1B]|\u4E58|\u9664|[\u5C0D\u5BF9]|\u6253|\u516C[\u91CC\u88CF]|\u516C[\u9877\u9803]|\u516C\u5206|\u5E73\u65B9|\u65B9|\u7C73|\u5398|\u6BEB|[\u6761\u689D]|\u8239|[\u8F66\u8ECA]|[\u8F86\u8F1B]|\u7FA4|[\u9875\u9801]|\u676F|\u4EBA|[\u5F20\u5F35]|\u6B21|\u4F4D|\u4EFD|\u6279|[\u5C4A\u5C46]|[\u7EA7\u7D1A]|[\u79CD\u7A2E]|\u5957|[\u7B14\u7B46]|\u6839|[\u5757\u584A]|\u4EF6|\u5EA7|\u6B65|[\u9897\u9846]|\u68F5|[\u8282\u7BC0]|\u652F|\u53EA|\u540D|\u5E74|\u6708|\u65E5|[\u53F7\u865F]|\u6735|\u514B|[\u5428\u5678]|\u78C5|[\u7801\u78BC]|\u82F1\u5C3A|\u82F1\u5BF8|\u5347|\u52A0[\u4ED1\u4F96]|\u7ACB\u65B9|[\u53F0\u81FA]|\u5957|[\u7F57\u7F85]|\u4EE4|\u5377|[\u5934\u982D]|\u7BB1|\u5305|\u6876|\u888B|[\u5757\u584A]|\u5BB6|\u884C|\u671F|[\u5C42\u5C64]|\u5EA6|\u9762|\u6240|\u67B6|\u628A|\u7247|[\u9635\u9663]|[\u95F4\u9593]|\u7B49|[\u53E0\u758A]|\u789F|\u4E0B|\u8D77|\u624B|\u5B63|\u90E8|\u4EBA|\u5C0F[\u65F6\u6642]|[\u65F6\u6642]|\u79D2|[\u6837\u6A23]|\u7AE0|\u6BB5|\u661F|\u5DDE|\u6B3E|\u4EE3|\u7EF4|\u91CD|[\u6237\u6238]|\u697C|\u8DEF|\u7BC7|\u53E5|\u952E|\u672C|\u751F|\u8005|\u5B57|\u90CE|\u9053|\u8FB9|\u573A|\u53E3|\u7EBF|\u4E16|\u5CB8|\u91D1|\u7C7B|\u756A|\u7EC4|\u5366|\u773C|\u7CFB|\u58F0|\u66F4|\u5E26|\u8272|\u6218|\u6210|\u8F6E|\u98DF|\u9996|\u5E61|\u7AD9|\u80A1|\u4E95|\u6D41|\u5F00|\u523B|\u6D32|\u56DE|\u5BAE|\u96C6|\u7EC3|\u9031|\u548C|\u73AF|\u7532|\u5904|\u7701|\u91CC|\u6D77|\u904D|\u54C1|\u4F53|\u738B|\u5C3E|\u65B0|\u96BB|\u7248|\u9636|\u677F|\u4FA7|\u6CE2|\u8EAB|\u5219|\u626B|\u623F|\u5F69|\u6728|\u519B|\u5C45|\u665A|\u5C9B|\u8BFE|\u5F0F|\u901A|\u76F8|\u533A|\u6587|\u7AEF|\u5473|\u7530|\u5FC3|\u80CE|\u73ED|\u51FA|\u8FDE|\u5355|\u4E8B|\u4E1D|\u526F|\u5C81|\u65C1|\u5E55|\u4E9B|\u679A|\u62DB|\u5361|\u5E45|\u8A00|\u8857|\u6307|\u8F88|\u5BA4|\u5806|\u4F5C|\u5C01|\u53A2|\u58F0|\u57CE|\u65CF|\u5708|\u8138|\u76EE|\u6392|\u6A21|\u5915|\u7F51|\u5E02|\u5411|\u6781|\u9A71|\u79D1|\u63D0|\u6838|\u6751|\u5BA1|\u5200|\u518C|\u4F8B|\u5173|\u7C92|\u5C40|\u5C71|\u5BF8|\u7897|\u77AC|\u8054|\u6E38|\u811A|\u5B85|\u7EBF|\u683C|\u5165|\u8D9F|\u8CAB|\u754C|\u793E|\u80A2|\u6280|\u6EF4|\u95EE|\u7B11|\u9662|\u5802|\u5C3A|\u5BE8|\u6863|\u4E3E|\u76D8|\u95E8|\u5BA2|\u9910|\u8258|\u6BDB|\u4E08|\u5251|\u66F2|\u4EFB|\u53F6|\u56E2|\u6D3E|\u5634|\u6865|\u62B9|\u679D|\u8D2F|\u4F0F|\u62F3|\u5217|\u673A|\u76D2|\u961F|\u8FDB\u5236|\u680B|\u5E2D|\u65A4|\u8BCD|\u51FB|\u9898|\u578B|\u5B97|\u67F1|\u94B1|\u62CD|\u5267|\u65EC|\u547D|\u6247|\u5339|\u6E56|\u58F6|\u89C9|\u53C9|\u6821|\u6CC9|\u5177|\u4E32|\u5C04|\u8BC1|\u5927\u6279|\u7403|\u6A2A|\u7AD6|\u5C0A|\u8F74|\u89C2|\u5BA1|\u77F3|\u675F|\u5F39|\u682A|\u9886|\u59D4|\u680F|\u70AE|\u9F0E|\u753A|\u5E06|\u6597|\u7F15|\u684C|\u9488|\u5E27|\u8F6C|\u843D|\u8DB3|\u68AF|\u53BF|\u6295|\u8BD5|\u5E2E|\u638C|\u7BAD|\u76CF|\u9505|\u8BA1|\u5927\u7247|\u5B66\u671F|\u622A|\u9876|\u5C4B|\u4ECB|\u5251|\u6842|\u65D7|\u5DF7|\u6325|\u6643|\u5458|\u7FFC|\u6C60|\u56F4|\u52FA|\u5BBF|\u5E93|\u68D2|\u51A0|\u6811|\u7F38|\u4F19|\u7B7E|\u63FD|\u5768|\u5319|\u6869|\u987F|\u7EB8|\u9685|\u8BFA|\u6848|\u520A|\u5382|\u6746|\u88AD|\u4ED3|\u5E8A|\u62C5|\u5E16|\u5C4F|\u76CF|\u8154|\u8D34|\u7A8D|\u6D1E|\u5186|\u576A|\u6CE1|\u56ED|\u9986|\u6E7E|\u62E8|\u67AA|\u804C|\u4EAD|\u80CC|\u7DAD|[\u8B77\u62A4\u6238]|\u6A13|\u9375|\u908A|\u5834|\u7DDA|\u985E|\u7D44|\u8072|\u5E36|\u6230|\u8F2A|\u958B|\u7DF4|\u74B0|\u8655|\u88CF|\u9AD4|\u96BB|\u968E|\u5074|\u5247|\u6383|\u8ECD|\u5C45|\u5CF6|\u8AB2|\u5F0F|\u5340|\u9023|\u55AE|\u7D72|\u6B72|\u5EC2|\u8072|\u81C9|\u7DB2|\u6975|\u9A45|\u5BE9|\u518A|\u95DC|\u806F|\u904A|\u8173|\u7DDA|\u8CAB|\u554F|\u6A94|\u8209|\u76E4|\u9580|\u528D|\u66F2|\u4EFB|\u8449|\u5718|\u6D3E|\u5634|\u6A4B|\u62B9|\u679D|\u8CAB|\u4F0F|\u62F3|\u5217|\u6A5F|\u76D2|\u968A|\u9032\u5236|\u68DF|\u8A5E|\u64CA|\u984C|\u9322|\u58FA|\u89BA|\u8B49|\u5927\u6279|\u7403|\u6A6B|\u8C4E|\u5C0A|\u8EF8|\u89C0|\u5BE9|\u5F48|\u9818|\u59D4|\u6B04|\u91D8|\u9B25|\u7E37|\u91DD|\u5E40|\u8F49|\u7E23|\u8A66|\u5E6B|\u76DE|\u934B|\u8A08|\u5B78\u671F|\u622A|\u9802|\u4ECB|\u528D|\u6842|\u65D7|\u5DF7|\u63EE|\u6643|\u54E1|\u570D|\u52FA|\u5BBF|\u5EAB|\u68D2|\u51A0|\u6A39|\u7F38|\u5925|\u7C3D|\u652C|\u6A01|\u9813|\u7D19|\u9685|\u8AFE|\u5EE0|\u687F|\u8972|\u5009|\u64D4|\u76DE|\u8CBC|\u7AC5|\u6D1E|\u576A|\u6CE1|\u54E1|\u9928|\u7063|\u64A5|\u69CD|\u8077|\u7684|\\s|$)";
    const ContinuouslyNumberRegex: string;
    const SingleLiangRegex: string;
    const NotSingleRegex: string;
    const SingleRegex: string;
    const AllIntRegex: string;
    const PlaceHolderPureNumber = "\\b";
    const PlaceHolderDefault = "\\D|\\b";
    const NumbersSpecialsChars: string;
    const NumbersSpecialsCharsWithSuffix: string;
    const DottedNumbersSpecialsChar: string;
    const NumbersWithHalfDozen: string;
    const NumbersWithDozen: string;
    const PointRegexStr = "[\u70B9\u9EDE\\.\uFF0E]";
    const AllFloatRegex: string;
    const NumbersWithAllowListRegex: string;
    const NumbersAggressiveRegex: string;
    const PointRegex: string;
    const DoubleSpecialsChars: string;
    const DoubleSpecialsCharsWithNegatives: string;
    const SimpleDoubleSpecialsChars: string;
    const DoubleWithMultiplierRegex: string;
    const DoubleWithThousandsRegex: string;
    const DoubleAllFloatRegex: string;
    const DoubleExponentialNotationRegex: string;
    const DoubleScientificNotationRegex: string;
    const OrdinalRegex: string;
    const OrdinalNumbersRegex: string;
    const AllFractionNumber: string;
    const FractionNotationSpecialsCharsRegex: string;
    const FractionNotationRegex: string;
    const PercentagePointRegex: string;
    const SimplePercentageRegex: string;
    const NumbersPercentagePointRegex: string;
    const NumbersPercentageWithSeparatorRegex: string;
    const NumbersPercentageWithMultiplierRegex: string;
    const FractionPercentagePointRegex: string;
    const FractionPercentageWithSeparatorRegex: string;
    const FractionPercentageWithMultiplierRegex: string;
    const SimpleNumbersPercentageRegex: string;
    const SimpleNumbersPercentageWithMultiplierRegex: string;
    const SimpleNumbersPercentagePointRegex: string;
    const IntegerPercentageRegex: string;
    const IntegerPercentageWithMultiplierRegex: string;
    const NumbersFractionPercentageRegex: string;
    const SimpleIntegerPercentageRegex: string;
    const NumbersFoldsPercentageRegex: string;
    const FoldsPercentageRegex: string;
    const SimpleFoldsPercentageRegex: string;
    const SpecialsPercentageRegex: string;
    const NumbersSpecialsPercentageRegex: string;
    const SimpleSpecialsPercentageRegex: string;
    const SpecialsFoldsPercentageRegex = "\u534A\\s*\u6210|(?<=\u6253)[\u5BF9\u5C0D]\\s*\u6298|\u534A\\s*\u6298";
    const SpeicalCharBeforeNumber = "(\u6709|\u662F|\u4E3A)";
    const TillRegex = "(\u5230|\u81F3|--|-|\u2014|\u2014\u2014|~|\u2013)";
    const MoreRegex = "((\u5927\u4E8E|\u591A\u4E8E|\u9AD8\u4E8E|\u8D85\u8FC7|\u5927\u65BC|\u591A\u65BC|\u9AD8\u65BC|\u8D85\u904E|\u8D85\u8FC7)\u4E86?|\u8FC7|>)";
    const LessRegex = "(\u5C0F\u4E8E|\u5C11\u4E8E|\u4F4E\u4E8E|\u5C0F\u65BC|\u5C11\u65BC|\u4F4E\u65BC|\u4E0D\u5230|\u4E0D\u8DB3|<)";
    const EqualRegex = "(\u7B49\u4E8E|\u7B49\u65BC|=)";
    const MoreOrEqual: string;
    const MoreOrEqualSuffix = "(\u6216|\u6216\u8005)\\s*(\u6B21?\u4EE5\u4E0A|\u4E4B\u4E0A|\u66F4[\u5927\u591A\u9AD8])";
    const LessOrEqual: string;
    const LessOrEqualSuffix = "(\u6216|\u6216\u8005)\\s*(\u4EE5\u4E0B|\u4E4B\u4E0B|\u66F4[\u5C0F\u5C11\u4F4E])";
    const OneNumberRangeMoreRegex1: string;
    const OneNumberRangeMoreRegex2 = "\u6BD4\\s*(?<number1>((?!(([,\uFF0C](?!\\d+))|\u3002)).)+)\\s*\u66F4?[\u5927\u591A\u9AD8]";
    const OneNumberRangeMoreRegex3 = "(?<number1>((?!(([,\uFF0C](?!\\d+))|\u3002|[\u6216\u8005])).)+)\\s*(\u6216|\u6216\u8005)?\\s*([\u591A\u51E0\u4F59\u5E7E\u9918]|\u6B21?\u4EE5\u4E0A|\u4E4B\u4E0A|\u66F4[\u5927\u591A\u9AD8])([\u4E07\u4EBF\u842C\u5104]{0,2})";
    const OneNumberRangeLessRegex1: string;
    const OneNumberRangeLessRegex2 = "\u6BD4\\s*(?<number2>((?!(([,\uFF0C](?!\\d+))|\u3002)).)+)\\s*\u66F4?[\u5C0F\u5C11\u4F4E]";
    const OneNumberRangeLessRegex3 = "(?<number2>((?!(([,\uFF0C](?!\\d+))|\u3002|[\u6216\u8005])).)+)\\s*(\u6216|\u6216\u8005)?\\s*(\u4EE5\u4E0B|\u4E4B\u4E0B|\u66F4[\u5C0F\u5C11\u4F4E])";
    const OneNumberRangeMoreSeparateRegex = "^[.]";
    const OneNumberRangeLessSeparateRegex = "^[.]";
    const OneNumberRangeEqualRegex: string;
    const TwoNumberRangeRegex1: string;
    const TwoNumberRangeRegex2: string;
    const TwoNumberRangeRegex3: string;
    const TwoNumberRangeRegex4: string;
    const AmbiguityFiltersDict: ReadonlyMap<string, string>;
    const AmbiguousFractionConnectorsRegex = "^[.]";
    const RelativeReferenceOffsetMap: ReadonlyMap<string, string>;
    const RelativeReferenceRelativeToMap: ReadonlyMap<string, string>;
}

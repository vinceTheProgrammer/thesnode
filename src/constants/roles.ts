export enum BadgeRole {
    RetiredStaff = '1297424029782642719',
    Translator = '1297424236859887698',
    Occifer = '1297424346951843941',
    MegaNoder = '1297424458017017876',
    ProNoder = '1297424569023332405',
    MasterNoder = '1297424737412190219',
    LegendaryNoder = '1297424846724009984',
    FeaturedLvl1 = '1297424956413575198',
    FeaturedLvl2 = '1297425066988142694',
    FeaturedLvl3 = '1297425147363594250',
    FeaturedLvl4 = '1297425226518233138',
    UCWinnerLvl1 = '1297425326950973440',
    UCWinnerLvl2 = '1297425461323763756',
    UCWinnerLvl3 = '1297425548611555459',
    UCWinnerLvl4 = '1297425727343300639',
    UCVoter = '1297425855198265418',
    Crusader = '1297425972362219580',
    Halloween2018Winner = '1297426075017678909',
    Halloween2020Winner = '1297426180676521994',
    Halloween2021Winner = '1297426286955724833',
    Halloween2022Winner = '1297426366068953132',
    Christmas2020Winner = '1297426461409415199',
    Christmas2021Winner = '1297426533454970920',
    MerryMadnessWinner = '1297426640800055367',
    TreasureTroveWinner = '1297423787356192849',
    StickIdolWinner = '1297423356848771163'
}

export const BADGE_TO_ROLE: Record<string, BadgeRole> = {
    "retired-staff": BadgeRole.RetiredStaff,
    "translator": BadgeRole.Translator,
    "occifer": BadgeRole.Occifer,
    "mega-noder": BadgeRole.MegaNoder,
    "pro-noder": BadgeRole.ProNoder,
    "master-noder": BadgeRole.MasterNoder,
    "legendary-noder": BadgeRole.LegendaryNoder,
    "featured-lvl1": BadgeRole.FeaturedLvl1,
    "featured-lvl2": BadgeRole.FeaturedLvl2,
    "featured-lvl3": BadgeRole.FeaturedLvl3,
    "featured-lvl4": BadgeRole.FeaturedLvl4,
    "uc-winner-lvl1": BadgeRole.UCWinnerLvl1,
    "uc-winner-lvl2": BadgeRole.UCWinnerLvl2,
    "uc-winner-lvl3": BadgeRole.UCWinnerLvl3,
    "uc-winner-lvl4": BadgeRole.UCWinnerLvl4,
    "uc-voter": BadgeRole.UCVoter,
    "crusader": BadgeRole.Crusader,
    "halloween-2018-winner": BadgeRole.Halloween2018Winner,
    "halloween-2020-winner": BadgeRole.Halloween2020Winner,
    "halloween-2021-winner": BadgeRole.Halloween2021Winner,
    "halloween-2022-winner": BadgeRole.Halloween2022Winner,
    "christmas-2020-winner": BadgeRole.Christmas2020Winner,
    "christmas-2021-winner": BadgeRole.Christmas2021Winner,
    "christmas-2022-winner": BadgeRole.MerryMadnessWinner,
    "treasure-trove-winner": BadgeRole.TreasureTroveWinner,
    "stick-idol-winner": BadgeRole.StickIdolWinner,
};

export enum ColorRole {
    FunBlue = '1298766291032866827',
    ConiferGreen = '1298766092378046595',
    AmethystPurple = '1298765909586083931',
    TussockOrange = '1298765586561765417',
    WarmBeige = '1298765368000774164',
    MustardYellow = '1298765235292999751',
    HeliotropePink = '1298765061178921020',
    BurntSienna = '1298764889594265723',
    HotPink = '1298753776076980285',
    SunsetOrange = '1298753575089995867',
    CardinalRed = '1298753337210044569',
    TangoOrange = '1298753093877497926',
    CranberryRed = '1298752555668602971',
    VividPurple = '1298752065585283102',
    PurpleHeartPurple = '1298751975751553106'
}

export const ColorToRoleIdMap: Record<ColorRole, string[]> = {
    [ColorRole.FunBlue]: [BadgeRole.RetiredStaff],
    [ColorRole.ConiferGreen]: [BadgeRole.Translator],
    [ColorRole.AmethystPurple]: [BadgeRole.Occifer],
    [ColorRole.TussockOrange]: [BadgeRole.MegaNoder, BadgeRole.ProNoder, BadgeRole.MasterNoder, BadgeRole.LegendaryNoder],
    [ColorRole.WarmBeige]: [BadgeRole.LegendaryNoder],
    [ColorRole.MustardYellow]: [BadgeRole.FeaturedLvl1, BadgeRole.FeaturedLvl2, BadgeRole.FeaturedLvl3, BadgeRole.FeaturedLvl4],
    [ColorRole.HeliotropePink]: [BadgeRole.FeaturedLvl4],
    [ColorRole.BurntSienna]: [BadgeRole.UCWinnerLvl1, BadgeRole.UCWinnerLvl2, BadgeRole.UCWinnerLvl3, BadgeRole.UCWinnerLvl4],
    [ColorRole.HotPink]: [BadgeRole.UCWinnerLvl4],
    [ColorRole.SunsetOrange]: [BadgeRole.UCVoter],
    [ColorRole.CardinalRed]: [BadgeRole.Crusader],
    [ColorRole.TangoOrange]: [BadgeRole.Halloween2018Winner, BadgeRole.Halloween2020Winner, BadgeRole.Halloween2021Winner, BadgeRole.Halloween2022Winner],
    [ColorRole.CranberryRed]: [BadgeRole.Christmas2020Winner, BadgeRole.Christmas2021Winner, BadgeRole.MerryMadnessWinner],
    [ColorRole.VividPurple]: [BadgeRole.TreasureTroveWinner],
    [ColorRole.PurpleHeartPurple]: [BadgeRole.StickIdolWinner]
}

export enum RoleId {
    GroupPerms = '1300984956813836390',
    Linked = '1309276982047019061',
    Staff = '1302378657960038492'
}

export const GoodRoles : string[] = [
    BadgeRole.RetiredStaff,
    BadgeRole.Translator,
    BadgeRole.MegaNoder,
    BadgeRole.ProNoder,
    BadgeRole.MasterNoder,
    BadgeRole.LegendaryNoder,
    BadgeRole.FeaturedLvl1,
    BadgeRole.FeaturedLvl2,
    BadgeRole.FeaturedLvl3,
    BadgeRole.FeaturedLvl4,
    BadgeRole.UCWinnerLvl1,
    BadgeRole.UCWinnerLvl2,
    BadgeRole.UCWinnerLvl3,
    BadgeRole.UCWinnerLvl4,
    BadgeRole.UCVoter,
    BadgeRole.Crusader,
    BadgeRole.Halloween2018Winner,
    BadgeRole.Halloween2020Winner,
    BadgeRole.Halloween2021Winner,
    BadgeRole.Halloween2022Winner,
    BadgeRole.MerryMadnessWinner,
    BadgeRole.TreasureTroveWinner,
    BadgeRole.StickIdolWinner,
    BadgeRole.Occifer
]

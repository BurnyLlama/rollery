export const TYPES = {
    '(': 'GROUP_BEGIN',
    '[': 'GROUP_BEGIN',
    '{': 'GROUP_BEGIN',
    ')': 'GROUP_END',
    ']': 'GROUP_END',
    '}': 'GROUP_END',
    ',': 'GROUP_SEP',
}

export const ALIASES = {
    'R': 'ROLLER',
    'G': 'GE',
}

export const WORDS = {
    'ROLLER':   'KEY_WORD',
    'HJÄLP':    'KEY_WORD',
    'MOTIVERA': 'KEY_WORD',

    'GE':       'ACTION_WORD',
    'TA':       'ACTION_WORD',
    'TILLDELA': 'ACTION_WORD',
    'AVSKAFFA': 'ACTION_WORD',

    'ALLA':     'SELECT_ALL',
}

export const RECIPES = {
    'ROLLER':   ['KEY_WORD', 'ACTION_WORD', 'PARAM', 'PARAM'],
    'HJÄLP':    ['KEY_WORD'],
    'MOTIVERA': ['KEY_WORD'],
}

export const MAN_PAGES = {
    'ROLLER':   "ROLLER <GE | TA | TILLDELA | AVSKAFFA> <KLASSKOD> <ROLL>",
    'HJÄLP':    "HJÄLP",
    'MOTIVERA': "MOTIVERA",
}
export const WORD_CHARS = /[A-ZÅÄÖ0-9?*]/

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
    'R':        'ROLLER',
    'ROLL':     'ROLLER',
    'ROLES':    'ROLLER',
    'ROLE':     'ROLLER',

    'GIVE':     'GE',
    'GV':       'GE',
    'UNGIVE':   'TA',
    'TAKE':     'TA',
    'DELETE':   'TA',
    'DEL':      'TA',
    'REOVE':    'TA',
    'RM':       'TA',

    'MOTIVATE': 'MOTIVERA',
    'M':        'MOTIVERA',

    'HELP':     'HJÄLP',
    'MANUAL':   'HJÄLP',
    '?':        'HJÄLP',

    'ALL':      'ALLA',
    '*':        'ALLA',
}

export const WORDS = {
    'ROLLER':       'KEY_WORD',
    'HJÄLP':        'KEY_WORD',
    'MOTIVERA':     'KEY_WORD',
    'IMPORTERA':    'KEY_WORD',

    'GE':           'ACTION_WORD',
    'TA':           'ACTION_WORD',
    'TILLDELA':     'ACTION_WORD',
    'AVSKAFFA':     'ACTION_WORD',

    'ALLA':         'SELECT_ALL',
}

export const RECIPES = {
    'ROLLER':       ['KEY_WORD', 'ACTION_WORD', 'PARAM', 'PARAM'],
    'HJÄLP':        ['KEY_WORD'],
    'MOTIVERA':     ['KEY_WORD'],
    'IMPORTERA':    ['KEY_WORD'],
}

export const MAN_PAGES = {
    'ROLLER':       "ROLLER <GE | TA | TILLDELA | AVSKAFFA> <'Klasskod' | ('Klasskoder')> <'Roll' | ('Roller')>",
    'HJÄLP':        "HJÄLP",
    'MOTIVERA':     "MOTIVERA",
    'IMPORTERA':    "IMPORTERA",
}
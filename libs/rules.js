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
    'ROLL':     'ROLLER',
    'ROLES':    'ROLLER',
    'ROLE':     'ROLLER',
    'R':        'ROLLER',

    'GIVE':     'GE',
    'GV':       'GE',

    'TAKE':     'TA',
    'TK':       'TA',

    'GRANT':    'TILLDELA',
    'GR':       'TILLDELA',
    'TD':       'TILLDELA',

    'REVOKE':   'AVSKAFFA',
    'RV':       'AVSKAFFA',
    'AS':       'AVSKAFFA',

    'LIST':     'LISTA',
    'LS':       'LISTA',

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
    'KUL':          'KEY_WORD',
    'IMPORTERA':    'KEY_WORD',

    'GE':           'ACTION_WORD',
    'TA':           'ACTION_WORD',
    'TILLDELA':     'ACTION_WORD',
    'AVSKAFFA':     'ACTION_WORD',
    'LISTA':        'ACTION_WORD',

    'DIKT':         'ACTION_WORD',
    'MOTIVERA':     'ACTION_WORD',
    'LYRICS':       'ACTION_WORD',

    'PAPPASKÄMT':   'ACTION_WORD',
    'FAKTA':        'ACTION_WORD',

    'PIXLAR':       'ACTION_WORD',
    'NOISE':        'ACTION_WORD',
    'FÄRG':         'ACTION_WORD',

    'ALLA':         'SELECT_ALL',
}

export const RECIPES = {
    'ROLLER':       'KEY_WORD ACTION_WORD ?(PARAM|) ?(PARAM|)',
    'HJÄLP':        'KEY_WORD',
    'KUL':          'KEY_WORD ACTION_WORD ?(PARAM|) ?(PARAM|)',
    'IMPORTERA':    'KEY_WORD',
}

export const MAN_PAGES = {
    'ROLLER':       "ROLLER <GE | TA | TILLDELA | AVSKAFFA | LISTA> <'Klasskod' | ('Klasskoder')> <'Roll' | ('Roller')>",
    'HJÄLP':        "HJÄLP",
    'KUL':          "KUL <PAPPASKÄMT | MOTIVERA | DIKT | LYRICS | FAKTA |PIXLAR | NOISE>",
    'IMPORTERA':    "IMPORTERA",
}
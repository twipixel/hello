export default class KeyCode {
    static get BREAK() { return 3; }
    static get BACKSPACE() { return 8; }
    static get TAB() { return 9; }
    static get CLEAR() { return 12; }
    static get ENTER() { return 13; }
    static get COMMAND() { return 15; }
    static get SHIFT() { return 16; }
    static get CONTROL() { return 17; }
    static get ALTERNATE() { return 18; }
    static get PAUSE() { return 18; }
    static get CAPSLOCK() { return 18; }
    static get ESCAPE() { return 27; }
    static get SPACE() { return 32; }
    static get PAGE_UP() { return 33; }
    static get PAGE_DOWN() { return 34; }
    static get END() { return 35; }
    static get HOME() { return 36; }
    static get LEFT() { return 37; }
    static get UP() { return 38; }
    static get RIGHT() { return 39; }
    static get DOWN() { return 40; }
    static get INSERT() { return 45; }
    static get DELETE() { return 46; }
    static get NUMBER_0() { return 48; }
    static get NUMBER_1() { return 49; }
    static get NUMBER_2() { return 50; }
    static get NUMBER_3() { return 51; }
    static get NUMBER_4() { return 52; }
    static get NUMBER_5() { return 53; }
    static get NUMBER_6() { return 54; }
    static get NUMBER_7() { return 55; }
    static get NUMBER_8() { return 56; }
    static get NUMBER_9() { return 57; }
    static get A() { return 65; }
    static get B() { return 66; }
    static get C() { return 67; }
    static get D() { return 68; }
    static get E() { return 69; }
    static get F() { return 70; }
    static get G() { return 71; }
    static get H() { return 72; }
    static get I() { return 73; }
    static get J() { return 74; }
    static get K() { return 75; }
    static get L() { return 76; }
    static get M() { return 77; }
    static get N() { return 78; }
    static get O() { return 79; }
    static get P() { return 80; }
    static get Q() { return 81; }
    static get R() { return 82; }
    static get S() { return 83; }
    static get T() { return 84; }
    static get U() { return 85; }
    static get V() { return 86; }
    static get W() { return 87; }
    static get X() { return 88; }
    static get Y() { return 89; }
    static get Z() { return 90; }
    static get LEFT_WINDOW() { return 91; }
    static get RIGHT_WINDOW() { return 92; }
    static get RIGHT_MENU() { return 93; }
    static get NUMPAD_0() { return 96; }
    static get NUMPAD_1() { return 97; }
    static get NUMPAD_2() { return 98; }
    static get NUMPAD_3() { return 99; }
    static get NUMPAD_4() { return 100; }
    static get NUMPAD_5() { return 101; }
    static get NUMPAD_6() { return 102; }
    static get NUMPAD_7() { return 103; }
    static get NUMPAD_8() { return 104; }
    static get NUMPAD_9() { return 105; }
    static get NUMPAD_MULTIPLY() { return 106; }
    static get NUMPAD_ADD() { return 107; }
    static get NUMPAD_ENTER() { return 108; }
    static get NUMPAD_SUBTRACT() { return 109; }
    static get NUMPAD_DECIMAL() { return 110; }
    static get NUMPAD_DIVIDE() { return 111; }
    static get F1() { return 112; }
    static get F2() { return 113; }
    static get F3() { return 114; }
    static get F4() { return 115; }
    static get F5() { return 116; }
    static get F6() { return 117; }
    static get F7() { return 118; }
    static get F8() { return 119; }
    static get F9() { return 120; }
    static get F10() { return 121; }
    static get F11() { return 122; }
    static get F12() { return 123; }
    static get F13() { return 124; }
    static get F14() { return 125; }
    static get F15() { return 126; }
    static get SEMICOLON() { return 186; }
    static get EQUAL() { return 187; }
    static get COMMA() { return 188; }
    static get DASH() { return 189; }
    static get PERIOD() { return 190; }
    static get BACKQUOTE() { return 192; }
    static get BACKSLASH() { return 220; }
    static get QUOTE() { return 222; }


    /*
    const keyCodes = {
        3 : "break",
        8 : "backspace / delete",
        9 : "tab",
        12 : 'clear',
        13 : "enter",
        16 : "shift",
        17 : "ctrl",
        18 : "alt",
        19 : "pause/break",
        20 : "caps lock",
        27 : "escape",
        32 : "spacebar",
        33 : "page up",
        34 : "page down",
        35 : "end",
        36 : "home ",
        37 : "left arrow ",
        38 : "up arrow ",
        39 : "right arrow",
        40 : "down arrow ",
        41 : "select",
        42 : "print",
        43 : "execute",
        44 : "Print Screen",
        45 : "insert ",
        46 : "delete",
        48 : "0",
        49 : "1",
        50 : "2",
        51 : "3",
        52 : "4",
        53 : "5",
        54 : "6",
        55 : "7",
        56 : "8",
        57 : "9",
        58 : ":",
        59 : "semicolon (firefox), equals",
        60 : "<",
        61 : "equals (firefox)",
        63 : "ß",
        64 : "@ (firefox)",
        65 : "a",
        66 : "b",
        67 : "c",
        68 : "d",
        69 : "e",
        70 : "f",
        71 : "g",
        72 : "h",
        73 : "i",
        74 : "j",
        75 : "k",
        76 : "l",
        77 : "m",
        78 : "n",
        79 : "o",
        80 : "p",
        81 : "q",
        82 : "r",
        83 : "s",
        84 : "t",
        85 : "u",
        86 : "v",
        87 : "w",
        88 : "x",
        89 : "y",
        90 : "z",
        91 : "Windows Key / Left ⌘ / Chromebook Search key",
        92 : "right window key ",
        93 : "Windows Menu / Right ⌘",
        96 : "numpad 0 ",
        97 : "numpad 1 ",
        98 : "numpad 2 ",
        99 : "numpad 3 ",
        100 : "numpad 4 ",
        101 : "numpad 5 ",
        102 : "numpad 6 ",
        103 : "numpad 7 ",
        104 : "numpad 8 ",
        105 : "numpad 9 ",
        106 : "multiply ",
        107 : "add",
        108 : "numpad period (firefox)",
        109 : "subtract ",
        110 : "decimal point",
        111 : "divide ",
        112 : "f1 ",
        113 : "f2 ",
        114 : "f3 ",
        115 : "f4 ",
        116 : "f5 ",
        117 : "f6 ",
        118 : "f7 ",
        119 : "f8 ",
        120 : "f9 ",
        121 : "f10",
        122 : "f11",
        123 : "f12",
        124 : "f13",
        125 : "f14",
        126 : "f15",
        127 : "f16",
        128 : "f17",
        129 : "f18",
        130 : "f19",
        131 : "f20",
        132 : "f21",
        133 : "f22",
        134 : "f23",
        135 : "f24",
        144 : "num lock ",
        145 : "scroll lock",
        160 : "^",
        161: '!',
        163 : "#",
        164: '$',
        165: 'ù',
        166 : "page backward",
        167 : "page forward",
        169 : "closing paren (AZERTY)",
        170: '*',
        171 : "~ + * key",
        173 : "minus (firefox), mute/unmute",
        174 : "decrease volume level",
        175 : "increase volume level",
        176 : "next",
        177 : "previous",
        178 : "stop",
        179 : "play/pause",
        180 : "e-mail",
        181 : "mute/unmute (firefox)",
        182 : "decrease volume level (firefox)",
        183 : "increase volume level (firefox)",
        186 : "semi-colon / ñ",
        187 : "equal sign ",
        188 : "comma",
        189 : "dash ",
        190 : "period ",
        191 : "forward slash / ç",
        192 : "grave accent / ñ / æ",
        193 : "?, / or °",
        194 : "numpad period (chrome)",
        219 : "open bracket ",
        220 : "back slash ",
        221 : "close bracket / å",
        222 : "single quote / ø",
        223 : "`",
        224 : "left or right ⌘ key (firefox)",
        225 : "altgr",
        226 : "< /git >",
        230 : "GNOME Compose Key",
        231 : "ç",
        233 : "XF86Forward",
        234 : "XF86Back",
        255 : "toggle touchpad"
    };
    */
}

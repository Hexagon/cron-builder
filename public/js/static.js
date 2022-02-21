export { WeekDays, Parts };

const WeekDays = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN"
];

const Parts = [
    { 
        "part": "seconds",
        "count": 60,
        "offset": 0
    },
    { 
        "part": "minutes",
        "count": 60,
        "offset": 0
    },
    { 
        "part": "hours",
        "count": 24,
        "offset": 0
    },
    { 
        "part": "days",
        "count": 31,
        "offset": 1
    },
    { 
        "part": "months",
        "count": 12,
        "offset": 1
    },
    { 
        "part": "daysOfWeek",
        "count": 7,
        "offset": 0
    }
];
const ChartData = (tGeneral, tDashboard) => ({
    ranges: {
        "this-week": tDashboard('this_week'),
        "this-month": tDashboard('this_month'),
        "this-year": tDashboard('this_year')
    },
    labels: {
        "this-week": [
            tGeneral("mon"),
            tGeneral("tue"),
            tGeneral("wed"),
            tGeneral("thu"),
            tGeneral("fri"),
            tGeneral("sat"),
            tGeneral("sun")
        ],
        "this-month": [
            `${tGeneral('week')} 1`,
            `${tGeneral('week')} 2`,
            `${tGeneral('week')} 3`,
            `${tGeneral('week')} 4`
        ],
        "this-year": [
            tGeneral("jan"),
            tGeneral("feb"),
            tGeneral("mar"),
            tGeneral("apr"),
            tGeneral("may"),
            tGeneral("jun"),
            tGeneral("jul"),
            tGeneral("aug"),
            tGeneral("sep"),
            tGeneral("oct"),
            tGeneral("nov"),
            tGeneral("dec")
        ]
    },
    series: {
        "this-week": [
            {
                name: tDashboard('gains'),
                type: "line",
                data: []
            },
            {
                name: tDashboard('costs'),
                type: "line",
                data: []
            }
        ],
        "this-month": [
            {
                name: tDashboard('gains'),
                type: "line",
                data: []
            },
            {
                name: tDashboard('costs'),
                type: "line",
                data: []
            }
        ],
        "this-year": [
            {
                name: tDashboard('gains'),
                type: "line",
                data: []
            },
            {
                name: tDashboard('costs'),
                type: "line",
                data: []
            }
        ]
    }
});

export default ChartData;
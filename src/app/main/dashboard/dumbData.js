export const widgets = {
    summary: {
        ranges: {
            DY: "Yesterday",
            DT: "Today",
            DTM: "Tomorrow"
        },
        currentRange: "DT",
        data: {
            name: "Due Tasks",
            count: {
                DY: 21,
                DT: 25,
                DTM: 19
            },
            extra: {
                name: "Completed",
                count: {
                    DY: 6,
                    DT: 7,
                    DTM: "-"
                }
            }
        },
        detail: "You can show some detailed information about this widget in here."
    },
    overdue: {
        title: "Overdue",
        data: {
            name: "Tasks",
            count: 4,
            extra: {
                name: "Yesterday's overdue",
                count: 2
            }
        },
        detail: "You can show some detailed information about this widget in here."
    },
    issues: {
        title: "Issues",
        data: {
            name: "Open",
            count: 32,
            extra: {
                name: "Closed today",
                count: 0
            }
        },
        detail: "You can show some detailed information about this widget in here."
    },
    features: {
        title: "Features",
        data: {
            name: "Proposals",
            count: 42,
            extra: {
                name: "Implemented",
                count: 8
            }
        },
        detail: "You can show some detailed information about this widget in here."
    },
    githubIssues: {
        overview: {
            "this-week": {
                "new-issues": 214,
                "closed-issues": 75,
                fixed: 3,
                "wont-fix": 4,
                "re-opened": 8,
                "needs-triage": 6
            },
            "last-week": {
                "new-issues": 197,
                "closed-issues": 72,
                fixed: 6,
                "wont-fix": 11,
                "re-opened": 6,
                "needs-triage": 5
            }
        },
        ranges: {
            "this-week": "This Week",
            "last-week": "Last Week"
        },
        labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ],
        series: {
            "this-week": [
                {
                    name: "New issues",
                    type: "line",
                    data: [
                        42,
                        28,
                        43,
                        34,
                        20,
                        25,
                        22
                    ]
                },
                {
                    name: "Closed issues",
                    type: "column",
                    data: [
                        11,
                        10,
                        8,
                        11,
                        8,
                        10,
                        17
                    ]
                }
            ],
            "last-week": [
                {
                    name: "New issues",
                    type: "line",
                    data: [
                        37,
                        32,
                        39,
                        27,
                        18,
                        24,
                        20
                    ]
                },
                {
                    name: "Closed issues",
                    type: "column",
                    data: [
                        9,
                        8,
                        10,
                        12,
                        7,
                        11,
                        15
                    ]
                }
            ]
        }
    },
    taskDistribution: {
        ranges: {
            "this-week": "This Week",
            "last-week": "Last Week"
        },
        overview: {
            "this-week": {
                new: 594,
                completed: 287
            },
            "last-week": {
                new: 526,
                completed: 260
            }
        },
        labels: [
            "API",
            "Backend",
            "Frontend",
            "Issues"
        ],
        series: {
            "this-week": [
                15,
                20,
                38,
                27
            ],
            "last-week": [
                19,
                16,
                42,
                23
            ]
        }
    },
    schedule: {
        ranges: {
            today: "Today",
            tomorrow: "Tomorrow"
        },
        series: {
            today: [
                {
                    title: "Group Meeting",
                    time: "in 32 minutes",
                    location: "Conference room 1B"
                },
                {
                    title: "Coffee Break",
                    time: "10:30 AM"
                },
                {
                    title: "Public Beta Release",
                    time: "11:00 AM"
                },
                {
                    title: "Lunch",
                    time: "12:10 PM"
                },
                {
                    title: "Dinner with David",
                    time: "05:30 PM",
                    location: "Magnolia"
                },
                {
                    title: "Jane's Birthday Party",
                    time: "07:30 PM",
                    location: "Home"
                },
                {
                    title: "Overseer's Retirement Party",
                    time: "09:30 PM",
                    location: "Overseer's room"
                }
            ],
            tomorrow: [
                {
                    title: "Marketing Meeting",
                    time: "09:00 AM",
                    location: "Conference room 1A"
                },
                {
                    title: "Public Announcement",
                    time: "11:00 AM"
                },
                {
                    title: "Lunch",
                    time: "12:10 PM"
                },
                {
                    title: "Meeting with Beta Testers",
                    time: "03:00 PM",
                    location: "Conference room 2C"
                },
                {
                    title: "Live Stream",
                    time: "05:30 PM"
                },
                {
                    title: "Release Party",
                    time: "07:30 PM",
                    location: "CEO's house"
                },
                {
                    title: "CEO's Private Party",
                    time: "09:30 PM",
                    location: "CEO's Penthouse"
                }
            ]
        }
    },
    budgetDistribution: {
        categories: [
            "Concept",
            "Design",
            "Development",
            "Extras",
            "Marketing"
        ],
        series: [
            {
                name: "Budget",
                data: [
                    12,
                    20,
                    28,
                    15,
                    25
                ]
            }
        ]
    },
    weeklyExpenses: {
        amount: 17663,
        labels: [
            "05 Jan - 12 Jan",
            "13 Jan - 20 Jan",
            "21 Jan - 28 Jan",
            "29 Jan - 05 Feb",
            "06 Feb - 13 Feb",
            "14 Feb - 21 Feb"
        ],
        series: [
            {
                name: "Expenses",
                data: [
                    4412,
                    4345,
                    4541,
                    4677,
                    4322,
                    4123
                ]
            }
        ]
    },
    monthlyExpenses: {
        amount: 54663,
        labels: [
            "21 Jan - 28 Jan",
            "29 Jan - 05 Feb",
            "06 Feb - 13 Feb",
            "14 Feb - 21 Feb"
        ],
        series: [
            {
                name: "Expenses",
                data: [
                    15521,
                    15519,
                    15522,
                    15521
                ]
            }
        ]
    },
    yearlyExpenses: {
        amount: 648813,
        labels: [
            "04 Dec - 11 Dec",
            "12 Dec - 19 Dec",
            "20 Dec - 27 Dec",
            "28 Dec - 04 Jan",
            "05 Jan - 12 Jan",
            "13 Jan - 20 Jan",
            "21 Jan - 28 Jan",
            "29 Jan - 05 Feb",
            "06 Feb - 13 Feb",
            "14 Feb - 21 Feb"
        ],
        series: [
            {
                name: "Expenses",
                data: [
                    45891,
                    45801,
                    45834,
                    45843,
                    45800,
                    45900,
                    45814,
                    45856,
                    45910,
                    45849
                ]
            }
        ]
    },
    budgetDetails: {
        columns: [
            "Type",
            "Total Budget",
            "Expenses (USD)",
            "Expenses (%)",
            "Remaining (USD)",
            "Remaining (%)"
        ],
        rows: [
            {
                type: "Concept",
                total: 14880,
                expensesAmount: 14000,
                expensesPercentage: 94.08,
                remainingAmount: 880,
                remainingPercentage: 5.92
            },
            {
                type: "Design",
                total: 21080,
                expensesAmount: 17240.34,
                expensesPercentage: 81.78,
                remainingAmount: 3839.66,
                remainingPercentage: 18.22
            },
            {
                type: "Development",
                total: 34720,
                expensesAmount: 3518,
                expensesPercentage: 10.13,
                remainingAmount: 31202,
                remainingPercentage: 89.87
            },
            {
                type: "Extras",
                total: 18600,
                expensesAmount: 0,
                expensesPercentage: 0,
                remainingAmount: 18600,
                remainingPercentage: 100
            },
            {
                type: "Marketing",
                total: 34720,
                expensesAmount: 19859.84,
                expensesPercentage: 57.2,
                remainingAmount: 14860.16,
                remainingPercentage: 42.8
            }
        ]
    },
    teamMembers: [
        {
            id: "2bfa2be5-7688-48d5-b5ac-dc0d9ac97f14",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/female-10.jpg",
            name: "Nadia Mcknight",
            email: "nadiamcknight@mail.com",
            phone: "+1-943-511-2203",
            title: "Project Director"
        },
        {
            id: "77a4383b-b5a5-4943-bc46-04c3431d1566",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/male-19.jpg",
            name: "Best Blackburn",
            email: "blackburn.best@beadzza.me",
            phone: "+1-814-498-3701",
            title: "Senior Developer"
        },
        {
            id: "8bb0f597-673a-47ca-8c77-2f83219cb9af",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/male-14.jpg",
            name: "Duncan Carver",
            email: "duncancarver@mail.info",
            phone: "+1-968-547-2111",
            title: "Senior Developer"
        },
        {
            id: "c318e31f-1d74-49c5-8dae-2bc5805e2fdb",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/male-01.jpg",
            name: "Martin Richards",
            email: "martinrichards@mail.biz",
            phone: "+1-902-500-2668",
            title: "Junior Developer"
        },
        {
            id: "0a8bc517-631a-4a93-aacc-000fa2e8294c",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/female-20.jpg",
            name: "Candice Munoz",
            email: "candicemunoz@mail.co.uk",
            phone: "+1-838-562-2769",
            title: "Lead Designer"
        },
        {
            id: "a4c9945a-757b-40b0-8942-d20e0543cabd",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/female-01.jpg",
            name: "Vickie Mosley",
            email: "vickiemosley@mail.net",
            phone: "+1-939-555-3054",
            title: "Designer"
        },
        {
            id: "b8258ccf-48b5-46a2-9c95-e0bd7580c645",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/female-02.jpg",
            name: "Tina Harris",
            email: "tinaharris@mail.ca",
            phone: "+1-933-464-2431",
            title: "Designer"
        },
        {
            id: "f004ea79-98fc-436c-9ba5-6cfe32fe583d",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/male-02.jpg",
            name: "Holt Manning",
            email: "holtmanning@mail.org",
            phone: "+1-822-531-2600",
            title: "Marketing Manager"
        },
        {
            id: "8b69fe2d-d7cc-4a3d-983d-559173e37d37",
            avatar: process.env.PUBLIC_URL + "/assets/images/avatars/female-03.jpg",
            name: "Misty Ramsey",
            email: "mistyramsey@mail.us",
            phone: "+1-990-457-2106",
            title: "Consultant"
        }
    ]
}

export default { widgets }
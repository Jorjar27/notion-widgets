/* ==========================================================
   NIGHT ONSEN WIDGETS
   Shared JavaScript functions
   ========================================================== */

"use strict";


/* ==========================================================
   1. Date and time helpers
   ========================================================== */

/**
 * Returns a new Date object containing the current local
 * date and time from the visitor's device.
 */
function onsenGetNow() {
    return new Date();
}


/**
 * Returns the full name of a month.
 *
 * Example:
 * 0 becomes "January"
 */
function onsenGetMonthName(monthNumber) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return monthNames[monthNumber];
}


/**
 * Returns the full name of a weekday.
 *
 * Example:
 * 0 becomes "Sunday"
 */
function onsenGetWeekdayName(dayNumber) {
    const weekdayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    return weekdayNames[dayNumber];
}


/**
 * Adds the correct suffix to a date number.
 *
 * Examples:
 * 1 becomes "1st"
 * 2 becomes "2nd"
 * 3 becomes "3rd"
 * 4 becomes "4th"
 */
function onsenAddOrdinalSuffix(number) {
    const finalTwoDigits = number % 100;

    if (
        finalTwoDigits >= 11 &&
        finalTwoDigits <= 13
    ) {
        return `${number}th`;
    }

    switch (number % 10) {
        case 1:
            return `${number}st`;

        case 2:
            return `${number}nd`;

        case 3:
            return `${number}rd`;

        default:
            return `${number}th`;
    }
}


/**
 * Returns a readable full date.
 *
 * Example:
 * "Monday, 27th July 2026"
 */
function onsenFormatFullDate(date = onsenGetNow()) {
    const weekday =
        onsenGetWeekdayName(date.getDay());

    const day =
        onsenAddOrdinalSuffix(date.getDate());

    const month =
        onsenGetMonthName(date.getMonth());

    const year =
        date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
}


/**
 * Returns a shorter date.
 *
 * Example:
 * "27 July 2026"
 */
function onsenFormatShortDate(date = onsenGetNow()) {
    const day = date.getDate();
    const month = onsenGetMonthName(date.getMonth());
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


/* ==========================================================
   2. Clock helpers
   ========================================================== */

/**
 * Adds a leading zero to single-digit numbers.
 *
 * Example:
 * 7 becomes "07"
 */
function onsenPadNumber(number) {
    return String(number).padStart(2, "0");
}


/**
 * Returns the current time in 24-hour format.
 *
 * Example:
 * "17:08"
 */
function onsenFormatTime24Hour(
    date = onsenGetNow(),
    includeSeconds = false
) {
    const hours =
        onsenPadNumber(date.getHours());

    const minutes =
        onsenPadNumber(date.getMinutes());

    if (!includeSeconds) {
        return `${hours}:${minutes}`;
    }

    const seconds =
        onsenPadNumber(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
}


/**
 * Returns the current time in 12-hour format.
 *
 * Example:
 * "5:08 PM"
 */
function onsenFormatTime12Hour(
    date = onsenGetNow(),
    includeSeconds = false
) {
    let hours = date.getHours();

    const period =
        hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const minutes =
        onsenPadNumber(date.getMinutes());

    if (!includeSeconds) {
        return `${hours}:${minutes} ${period}`;
    }

    const seconds =
        onsenPadNumber(date.getSeconds());

    return `${hours}:${minutes}:${seconds} ${period}`;
}


/**
 * Starts a live clock inside an HTML element.
 *
 * Usage:
 *
 * onsenStartClock("clock", {
 *     format: "24",
 *     includeSeconds: false
 * });
 */
function onsenStartClock(
    elementId,
    options = {}
) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        console.warn(
            `Onsen clock could not find #${elementId}.`
        );

        return null;
    }

    const format =
        options.format === "12" ? "12" : "24";

    const includeSeconds =
        options.includeSeconds === true;

    function updateClock() {
        const now = onsenGetNow();

        if (format === "12") {
            element.textContent =
                onsenFormatTime12Hour(
                    now,
                    includeSeconds
                );
        } else {
            element.textContent =
                onsenFormatTime24Hour(
                    now,
                    includeSeconds
                );
        }

        element.setAttribute(
            "datetime",
            now.toISOString()
        );
    }

    updateClock();

    const intervalLength =
        includeSeconds ? 1000 : 10000;

    return window.setInterval(
        updateClock,
        intervalLength
    );
}


/* ==========================================================
   3. Greeting helpers
   ========================================================== */

/**
 * Returns a greeting based on the current hour.
 */
function onsenGetGreeting(date = onsenGetNow()) {
    const hour = date.getHours();

    if (hour < 5) {
        return "A quiet night";
    }

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    if (hour < 21) {
        return "Good evening";
    }

    return "A peaceful night";
}


/**
 * Places a time-based greeting into an element.
 */
function onsenSetGreeting(elementId) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        console.warn(
            `Onsen greeting could not find #${elementId}.`
        );

        return;
    }

    element.textContent =
        onsenGetGreeting();
}


/* ==========================================================
   4. Calendar helpers
   ========================================================== */

/**
 * Returns the number of days in a chosen month.
 */
function onsenGetDaysInMonth(year, month) {
    return new Date(
        year,
        month + 1,
        0
    ).getDate();
}


/**
 * Returns the calendar position of the first day of a month,
 * using Monday as the first day of the week.
 *
 * Monday = 0
 * Tuesday = 1
 * Sunday = 6
 */
function onsenGetMondayFirstPosition(
    year,
    month
) {
    const firstDay =
        new Date(year, month, 1);

    return (firstDay.getDay() + 6) % 7;
}


/**
 * Creates an empty calendar square.
 */
function onsenCreateEmptyCalendarDay() {
    const element =
        document.createElement("div");

    element.className =
        "onsen-calendar-day onsen-calendar-day-empty";

    element.setAttribute(
        "aria-hidden",
        "true"
    );

    return element;
}


/**
 * Creates a numbered calendar square.
 */
function onsenCreateCalendarDay(
    dayNumber,
    date,
    today
) {
    const element =
        document.createElement("div");

    element.className =
        "onsen-calendar-day";

    element.textContent =
        dayNumber;

    element.setAttribute(
        "aria-label",
        onsenFormatFullDate(date)
    );

    const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

    if (isToday) {
        element.classList.add(
            "onsen-calendar-day-today"
        );

        element.setAttribute(
            "aria-current",
            "date"
        );
    }

    return element;
}


/**
 * Renders the current month into a calendar grid.
 *
 * Required HTML:
 *
 * <h1 id="calendarMonth"></h1>
 * <div id="calendarGrid">
 *     weekday headings go here
 * </div>
 *
 * Usage:
 *
 * onsenRenderCurrentCalendar({
 *     titleId: "calendarMonth",
 *     gridId: "calendarGrid"
 * });
 */
function onsenRenderCurrentCalendar(options = {}) {
    const titleId =
        options.titleId || "calendarMonth";

    const gridId =
        options.gridId || "calendarGrid";

    const titleElement =
        document.getElementById(titleId);

    const gridElement =
        document.getElementById(gridId);

    if (!titleElement || !gridElement) {
        console.warn(
            "Onsen calendar could not find its title or grid."
        );

        return;
    }

    const today = onsenGetNow();

    const year =
        today.getFullYear();

    const month =
        today.getMonth();

    titleElement.innerHTML =
        `${onsenGetMonthName(month)} ` +
        `<span class="onsen-title-accent">${year}</span>`;

    const oldDays =
        gridElement.querySelectorAll(
            ".onsen-calendar-day"
        );

    oldDays.forEach((day) => {
        day.remove();
    });

    const startingPosition =
        onsenGetMondayFirstPosition(
            year,
            month
        );

    const daysInMonth =
        onsenGetDaysInMonth(
            year,
            month
        );

    for (
        let position = 0;
        position < startingPosition;
        position++
    ) {
        gridElement.appendChild(
            onsenCreateEmptyCalendarDay()
        );
    }

    for (
        let dayNumber = 1;
        dayNumber <= daysInMonth;
        dayNumber++
    ) {
        const date =
            new Date(
                year,
                month,
                dayNumber
            );

        gridElement.appendChild(
            onsenCreateCalendarDay(
                dayNumber,
                date,
                today
            )
        );
    }
}


/* ==========================================================
   5. Daily quote helpers
   ========================================================== */

const onsenQuotes = [
    "Take each day gently.",
    "Rest is part of the journey.",
    "Let the quiet find you.",
    "Move slowly. Breathe deeply.",
    "There is peace in small moments.",
    "You do not have to rush.",
    "Softness is still strength.",
    "Leave room for stillness.",
    "Begin again, quietly.",
    "Today can be simple.",
    "Be where your feet are.",
    "Evening brings its own kind of peace."
];


/**
 * Returns a quote based on the current date.
 *
 * The quote stays the same all day and changes the next day.
 */
function onsenGetDailyQuote(date = onsenGetNow()) {
    const startOfYear =
        new Date(
            date.getFullYear(),
            0,
            0
        );

    const difference =
        date - startOfYear;

    const oneDay =
        1000 * 60 * 60 * 24;

    const dayOfYear =
        Math.floor(difference / oneDay);

    const quoteIndex =
        dayOfYear % onsenQuotes.length;

    return onsenQuotes[quoteIndex];
}


/**
 * Places today's quote into an element.
 */
function onsenSetDailyQuote(elementId) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        console.warn(
            `Onsen quote could not find #${elementId}.`
        );

        return;
    }

    element.textContent =
        onsenGetDailyQuote();
}


/* ==========================================================
   6. Automatic date refresh
   ========================================================== */

/**
 * Runs a supplied function shortly after midnight.
 *
 * This means widgets can update themselves even when the
 * Notion page has been left open overnight.
 */
function onsenRefreshAfterMidnight(callback) {
    if (typeof callback !== "function") {
        return;
    }

    function scheduleRefresh() {
        const now = onsenGetNow();

        const nextMidnight =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0,
                0,
                2
            );

        const delay =
            nextMidnight.getTime() -
            now.getTime();

        window.setTimeout(() => {
            callback();
            scheduleRefresh();
        }, delay);
    }

    scheduleRefresh();
}


/* ==========================================================
   7. Shared page setup
   ========================================================== */

/**
 * Adds a class once the page has loaded.
 *
 * This can later be used for subtle entrance animations.
 */
function onsenMarkPageReady() {
    document.documentElement.classList.add(
        "onsen-page-ready"
    );
}


/**
 * Runs common setup after the HTML has loaded.
 */
document.addEventListener(
    "DOMContentLoaded",
    () => {
        onsenMarkPageReady();
    }
);

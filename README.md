- Task: [RS-school - React Performance](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/performance.md)

- Code: [GitHub](https://github.com/heresyhawkins/class-components/tree/performance)

- Deploy: [Netlify](https://performance17.netlify.app/)

# Eco Emissions Table - Performance Profiling

This part summarizes the performance of the Emissions Table component using React DevTools Profiler. Measurements were taken before and after optimizations.

Profiling Actions:

## 1. Searching Countries

Scenario: Typing a string not present in the table (no matches) and clearing the search input (all rows displayed).

Before Optimization:

All table rows re-rendered unnecessarily.

![React Profiler screenshot](./src/screenshots/Screenshot_10.png)

After Optimization:

Only filtered rows render.

![React Profiler screenshot](./src/screenshots/Screenshot_5.png)

## 2. Changing Year

Scenario: Selecting a different year from the year selector.

Before Optimization:

Entire table re-rendered; highlight effect applied to all rows.

![React Profiler screenshot](./src/screenshots/Screenshot_1.png)

After Optimization:

Only cells with changed data highlight.

![React Profiler screenshot](./src/screenshots/Screenshot_6.png)

## 3. Sorting

Scenario: Sorting by population and by country name.

Before Optimization:

Sorting triggered full table re-render.

![React Profiler screenshot](./src/screenshots/Screenshot_2.png)
![React Profiler screenshot](./src/screenshots/Screenshot_3.png)

After Optimization:

Only necessary row updates applied.

![React Profiler screenshot](./src/screenshots/Screenshot_7.png)
![React Profiler screenshot](./src/screenshots/Screenshot_8.png)

## 4. Adding/Removing Columns

Scenario: Toggling additional columns (e.g., GDP, Methane, Oil CO₂).

Before Optimization:

Re-render affected all rows unnecessarily.

![React Profiler screenshot](./src/screenshots/Screenshot_4.png)

After Optimization:

Only the new columns render; other cells remain untouched.

![React Profiler screenshot](./src/screenshots/Screenshot_9.png)

const API_URL = "http://127.0.0.1:8000";

let subjectsCache = [];


// =====================================================
// NAVIGATION
// =====================================================

function showSection(sectionId, clickedButton) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {
            button.classList.remove("active");
        });


    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}


// =====================================================
// DATE
// =====================================================

function loadCurrentDate() {

    const element =
        document.getElementById("currentDate");

    if (!element) return;


    const today = new Date();

    element.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}


// =====================================================
// FORM VISIBILITY
// =====================================================

function showTaskForm() {

    const dashboardForm =
        document.getElementById(
            "dashboardTaskForm"
        );

    const taskForm =
        document.getElementById("taskForm");


    if (dashboardForm) {
        dashboardForm.classList.toggle("hidden");
    }

    if (taskForm) {
        taskForm.classList.toggle("hidden");
    }
}


function showSubjectForm() {

    const dashboardForm =
        document.getElementById(
            "dashboardSubjectForm"
        );

    const subjectForm =
        document.getElementById("subjectForm");


    if (dashboardForm) {
        dashboardForm.classList.toggle("hidden");
    }

    if (subjectForm) {
        subjectForm.classList.toggle("hidden");
    }
}


// =====================================================
// SUBJECTS
// =====================================================

async function loadSubjects() {

    try {

        const response =
            await fetch(`${API_URL}/subjects`);


        if (!response.ok) {
            throw new Error(
                "Could not load subjects"
            );
        }


        const subjects =
            await response.json();


        // Save subjects for task display

        subjectsCache = subjects;


        // ---------------------------------------------
        // SUBJECT COUNT
        // ---------------------------------------------

        const countElement =
            document.getElementById(
                "subjectCount"
            );

        if (countElement) {
            countElement.textContent =
                subjects.length;
        }


        // ---------------------------------------------
        // GET DROPDOWNS
        // ---------------------------------------------

        const timerSubject =
            document.getElementById(
                "timerSubject"
            );

        const taskSubject =
            document.getElementById(
                "taskSubject"
            );

        const dashboardTaskSubject =
            document.getElementById(
                "dashboardTaskSubject"
            );


        // ---------------------------------------------
        // TIMER DROPDOWN
        // ---------------------------------------------

        if (timerSubject) {

            timerSubject.innerHTML =
                `<option value="">
                    Select subject
                </option>`;


            subjects.forEach(subject => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    subject.id;

                option.textContent =
                    subject.name;

                timerSubject.appendChild(
                    option
                );

            });
        }


        // ---------------------------------------------
        // TASK DROPDOWN
        // ---------------------------------------------

        if (taskSubject) {

            taskSubject.innerHTML =
                `<option value="">
                    No subject
                </option>`;


            subjects.forEach(subject => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    subject.id;

                option.textContent =
                    subject.name;

                taskSubject.appendChild(
                    option
                );

            });
        }


        // ---------------------------------------------
        // DASHBOARD TASK DROPDOWN
        // ---------------------------------------------

        if (dashboardTaskSubject) {

            dashboardTaskSubject.innerHTML =
                `<option value="">
                    No subject
                </option>`;


            subjects.forEach(subject => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    subject.id;

                option.textContent =
                    subject.name;

                dashboardTaskSubject.appendChild(
                    option
                );

            });
        }


        // ---------------------------------------------
        // SUBJECT PAGE
        // ---------------------------------------------

        const subjectsList =
            document.getElementById(
                "subjectsList"
            );


        if (subjectsList) {

            if (subjects.length === 0) {

                subjectsList.innerHTML =
                    `<p class="empty">
                        No subjects added yet.
                    </p>`;
            }

            else {

                subjectsList.innerHTML =
                    subjects
                        .map(subject => {

                            const progress =
                                subject.total_topics > 0
                                    ? (
                                        subject.completed_topics /
                                        subject.total_topics
                                    ) * 100
                                    : 0;


                            return `
                                <div class="subject">

                                    <div class="subject-name">

                                        <strong>
                                            ${escapeHTML(
                                                subject.name
                                            )}
                                        </strong>

                                        <span>
                                            ${
                                                subject.completed_topics
                                            }/${
                                                subject.total_topics
                                            }
                                        </span>

                                    </div>


                                    <div class="progress">

                                        <div
                                            class="progress-bar"
                                            style="width: ${progress}%"
                                        ></div>

                                    </div>


                                    <div class="subject-footer">

                                        <span>
                                            ${Math.round(
                                                progress
                                            )}% completed
                                        </span>


                                        <button
                                            onclick="updateProgress(
                                                ${subject.id},
                                                ${subject.total_topics}
                                            )"
                                        >
                                            Update
                                        </button>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");
            }
        }


        // ---------------------------------------------
        // DASHBOARD SUBJECT PREVIEW
        // ---------------------------------------------

        const dashboardSubjects =
            document.getElementById(
                "dashboardSubjects"
            );


        if (dashboardSubjects) {

            if (subjects.length === 0) {

                dashboardSubjects.innerHTML =
                    `<p class="empty">
                        Add your first subject.
                    </p>`;
            }

            else {

                dashboardSubjects.innerHTML =
                    subjects
                        .slice(0, 4)
                        .map(subject => {

                            const progress =
                                subject.total_topics > 0
                                    ? (
                                        subject.completed_topics /
                                        subject.total_topics
                                    ) * 100
                                    : 0;


                            return `
                                <div class="subject">

                                    <div class="subject-name">

                                        <strong>
                                            ${escapeHTML(
                                                subject.name
                                            )}
                                        </strong>

                                        <span>
                                            ${Math.round(
                                                progress
                                            )}%
                                        </span>

                                    </div>


                                    <div class="progress">

                                        <div
                                            class="progress-bar"
                                            style="width: ${progress}%"
                                        ></div>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");
            }
        }


        await loadSubjectAnalytics();

    }

    catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );

    }
}


// =====================================================
// ADD SUBJECT
// =====================================================

async function addSubject() {

    const nameElement =
        document.getElementById(
            "subjectName"
        );

    const topicsElement =
        document.getElementById(
            "totalTopics"
        );


    if (!nameElement || !topicsElement) {
        return;
    }


    const name =
        nameElement.value.trim();

    const totalTopics =
        Number(topicsElement.value) || 0;


    if (!name) {

        alert(
            "Please enter a subject name."
        );

        return;
    }


    if (totalTopics < 0) {

        alert(
            "Total topics cannot be negative."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/subjects`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        total_topics:
                            totalTopics

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not add subject"
            );

        }


        nameElement.value = "";
        topicsElement.value = "";


        const form =
            document.getElementById(
                "subjectForm"
            );


        if (form) {
            form.classList.add("hidden");
        }


        await loadSubjects();

    }

    catch (error) {

        console.error(
            "Error adding subject:",
            error
        );

        alert(
            "Could not add subject."
        );

    }
}


// =====================================================
// ADD SUBJECT FROM DASHBOARD
// =====================================================

async function addDashboardSubject() {

    const nameElement =
        document.getElementById(
            "dashboardSubjectName"
        );

    const topicsElement =
        document.getElementById(
            "dashboardTotalTopics"
        );


    if (!nameElement || !topicsElement) {
        return;
    }


    const name =
        nameElement.value.trim();

    const totalTopics =
        Number(topicsElement.value) || 0;


    if (!name) {

        alert(
            "Please enter a subject name."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/subjects`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        total_topics:
                            totalTopics

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not add subject"
            );

        }


        nameElement.value = "";
        topicsElement.value = "";


        const form =
            document.getElementById(
                "dashboardSubjectForm"
            );


        if (form) {
            form.classList.add("hidden");
        }


        await loadSubjects();

    }

    catch (error) {

        console.error(
            "Error adding subject:",
            error
        );

        alert(
            "Could not add subject."
        );

    }
}


// =====================================================
// UPDATE SUBJECT PROGRESS
// =====================================================

async function updateProgress(
    subjectId,
    totalTopics
) {

    const completed =
        prompt(
            `How many topics have you completed? (0-${totalTopics})`
        );


    if (completed === null) {
        return;
    }


    const completedNumber =
        Number(completed);


    if (
        !Number.isInteger(
            completedNumber
        ) ||
        completedNumber < 0 ||
        completedNumber > totalTopics
    ) {

        alert(
            `Enter a whole number between 0 and ${totalTopics}.`
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/subjects/${subjectId}/progress?completed_topics=${completedNumber}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.detail ||
                "Could not update progress"
            );
        }


        await loadSubjects();

    }

    catch (error) {

        console.error(
            "Error updating progress:",
            error
        );

        alert(
            error.message
        );

    }
}


// =====================================================
// TASKS
// =====================================================

async function loadTasks() {

    try {

        const response =
            await fetch(
                `${API_URL}/tasks`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load tasks"
            );

        }


        const tasks =
            await response.json();


        // ---------------------------------------------
        // TASK COUNT
        // ---------------------------------------------

        const taskCount =
            document.getElementById(
                "taskCount"
            );


        if (taskCount) {
            taskCount.textContent =
                tasks.length;
        }


        const tasksList =
            document.getElementById(
                "tasksList"
            );

        const dashboardTasks =
            document.getElementById(
                "dashboardTasks"
            );


        // ---------------------------------------------
        // FULL TASK LIST
        // ---------------------------------------------

        if (tasksList) {

            if (tasks.length === 0) {

                tasksList.innerHTML =
                    `<p class="empty">
                        No tasks yet. Add your first task!
                    </p>`;

            }

            else {

                tasksList.innerHTML =
                    tasks
                        .map(task => {

                            const subjectName =
                                getSubjectName(
                                    task.subject_id
                                );


                            const subjectDisplay =
                                subjectName
                                    ? `
                                        <p>
                                            ${
                                                escapeHTML(
                                                    subjectName
                                                )
                                            }
                                        </p>
                                    `
                                    : "";


                            const dueDate =
                                task.due_date
                                    ? `
                                        <p>
                                            Due:
                                            ${task.due_date}
                                        </p>
                                    `
                                    : "";


                            return `
                                <div
                                    class="task ${
                                        task.completed
                                            ? "completed"
                                            : ""
                                    }"
                                >

                                    <div class="task-info">

                                        <h4>

                                            ${
                                                task.completed
                                                    ? "✓ "
                                                    : ""
                                            }

                                            ${escapeHTML(
                                                task.title
                                            )}

                                        </h4>


                                        <p>

                                            ${
                                                task.description
                                                    ? escapeHTML(
                                                        task.description
                                                    )
                                                    : "No description"
                                            }

                                        </p>


                                        ${subjectDisplay}

                                        ${dueDate}

                                    </div>


                                    <div
                                        class="task-actions"
                                    >

                                        <span
                                            class="priority"
                                        >
                                            ${escapeHTML(
                                                task.priority
                                            )}
                                        </span>


                                        <button
                                            onclick="toggleTask(
                                                ${task.id}
                                            )"
                                        >
                                            ${
                                                task.completed
                                                    ? "Undo"
                                                    : "Complete"
                                            }
                                        </button>


                                        <button
                                            onclick="deleteTask(
                                                ${task.id}
                                            )"
                                        >
                                            ×
                                        </button>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");
            }
        }


        // ---------------------------------------------
        // DASHBOARD TASK PREVIEW
        // ---------------------------------------------

        if (dashboardTasks) {

            if (tasks.length === 0) {

                dashboardTasks.innerHTML =
                    `<p class="empty">
                        No tasks for now.
                    </p>`;

            }

            else {

                dashboardTasks.innerHTML =
                    tasks
                        .slice(-3)
                        .reverse()
                        .map(task => {

                            const subjectName =
                                getSubjectName(
                                    task.subject_id
                                );


                            return `
                                <div
                                    class="task ${
                                        task.completed
                                            ? "completed"
                                            : ""
                                    }"
                                >

                                    <div class="task-info">

                                        <h4>

                                            ${
                                                task.completed
                                                    ? "✓ "
                                                    : ""
                                            }

                                            ${escapeHTML(
                                                task.title
                                            )}

                                        </h4>


                                        <p>

                                            ${escapeHTML(
                                                task.priority
                                            )}
                                            priority

                                            ${
                                                subjectName
                                                    ? ` • ${
                                                        escapeHTML(
                                                            subjectName
                                                        )
                                                    }`
                                                    : ""
                                            }

                                        </p>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");
            }
        }


        await loadTaskAnalytics();

    }

    catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );

    }
}


// =====================================================
// ADD TASK
// =====================================================

async function addTask() {

    const titleElement =
        document.getElementById(
            "taskTitle"
        );

    const subjectElement =
        document.getElementById(
            "taskSubject"
        );

    const priorityElement =
        document.getElementById(
            "taskPriority"
        );

    const dueDateElement =
        document.getElementById(
            "taskDueDate"
        );


    if (
        !titleElement ||
        !subjectElement ||
        !priorityElement ||
        !dueDateElement
    ) {
        return;
    }


    const title =
        titleElement.value.trim();

    const subjectId =
        subjectElement.value;

    const priority =
        priorityElement.value;

    const dueDate =
        dueDateElement.value;


    if (!title) {

        alert(
            "Please enter a task."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tasks`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: title,

                        description: "",

                        priority: priority,

                        due_date:
                            dueDate || null,

                        subject_id:
                            subjectId
                                ? Number(subjectId)
                                : null

                    })

                }
            );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.detail ||
                "Could not add task"
            );

        }


        titleElement.value = "";
        dueDateElement.value = "";
        subjectElement.value = "";


        const form =
            document.getElementById(
                "taskForm"
            );


        if (form) {
            form.classList.add("hidden");
        }


        await loadTasks();

    }

    catch (error) {

        console.error(
            "Error adding task:",
            error
        );

        alert(
            error.message
        );

    }
}


// =====================================================
// ADD TASK FROM DASHBOARD
// =====================================================

async function addDashboardTask() {

    const titleElement =
        document.getElementById(
            "dashboardTaskTitle"
        );

    const subjectElement =
        document.getElementById(
            "dashboardTaskSubject"
        );

    const priorityElement =
        document.getElementById(
            "dashboardTaskPriority"
        );

    const dueDateElement =
        document.getElementById(
            "dashboardTaskDueDate"
        );


    if (
        !titleElement ||
        !subjectElement ||
        !priorityElement ||
        !dueDateElement
    ) {
        return;
    }


    const title =
        titleElement.value.trim();

    const subjectId =
        subjectElement.value;

    const priority =
        priorityElement.value;

    const dueDate =
        dueDateElement.value;


    if (!title) {

        alert(
            "Please enter a task."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tasks`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: title,

                        description: "",

                        priority: priority,

                        due_date:
                            dueDate || null,

                        subject_id:
                            subjectId
                                ? Number(subjectId)
                                : null

                    })

                }
            );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.detail ||
                "Could not add task"
            );

        }


        titleElement.value = "";
        dueDateElement.value = "";
        subjectElement.value = "";


        const form =
            document.getElementById(
                "dashboardTaskForm"
            );


        if (form) {
            form.classList.add("hidden");
        }


        await loadTasks();

    }

    catch (error) {

        console.error(
            "Error adding dashboard task:",
            error
        );

        alert(
            error.message
        );

    }
}


// =====================================================
// TOGGLE TASK
// =====================================================

async function toggleTask(taskId) {

    try {

        const response =
            await fetch(
                `${API_URL}/tasks/${taskId}/toggle`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not update task"
            );

        }


        await loadTasks();

    }

    catch (error) {

        console.error(
            "Error updating task:",
            error
        );

        alert(
            "Could not update task."
        );

    }
}


// =====================================================
// DELETE TASK
// =====================================================

async function deleteTask(taskId) {

    if (!confirm("Delete this task?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete task"
            );

        }


        await loadTasks();

    }

    catch (error) {

        console.error(
            "Error deleting task:",
            error
        );

        alert(
            "Could not delete task."
        );

    }
}


// =====================================================
// STUDY TIMER
// =====================================================

let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;


function formatTime(totalSeconds) {

    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    return [
        hours,
        minutes,
        seconds
    ]
        .map(value =>
            String(value).padStart(
                2,
                "0"
            )
        )
        .join(":");
}


function updateTimerDisplay() {

    const display =
        document.getElementById(
            "timerDisplay"
        );


    if (display) {

        display.textContent =
            formatTime(
                timerSeconds
            );

    }
}


function startTimer() {

    if (timerRunning) {
        return;
    }


    const subjectElement =
        document.getElementById(
            "timerSubject"
        );


    if (
        !subjectElement ||
        !subjectElement.value
    ) {

        alert(
            "Please select a subject first."
        );

        return;
    }


    timerRunning = true;


    const startButton =
        document.getElementById(
            "startTimerBtn"
        );

    const stopButton =
        document.getElementById(
            "stopTimerBtn"
        );


    if (startButton) {
        startButton.disabled = true;
    }

    if (stopButton) {
        stopButton.disabled = false;
    }


    timerInterval =
        setInterval(() => {

            timerSeconds++;

            updateTimerDisplay();

        }, 1000);
}


async function stopTimer() {

    if (!timerRunning) {
        return;
    }


    clearInterval(timerInterval);

    timerRunning = false;


    const subjectElement =
        document.getElementById(
            "timerSubject"
        );


    if (
        !subjectElement ||
        !subjectElement.value
    ) {

        resetTimer();

        alert(
            "Please select a subject."
        );

        return;
    }


    if (timerSeconds <= 0) {

        resetTimer();

        return;
    }


    const durationMinutes =
        timerSeconds / 60;


    try {

        const response =
            await fetch(
                `${API_URL}/study-sessions`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        subject_id:
                            Number(
                                subjectElement.value
                            ),

                        duration:
                            Number(
                                durationMinutes.toFixed(
                                    2
                                )
                            ),

                        date:
                            getLocalDate()

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not save study session"
            );

        }


        const studiedTime =
            formatTime(
                timerSeconds
            );


        resetTimer();


        alert(
            `Study session saved! You studied for ${studiedTime}.`
        );


        await loadStudyTime();
        await loadWeeklyStudy();
        await loadStreak();

    }

    catch (error) {

        console.error(
            "Error saving study session:",
            error
        );

        alert(
            "Could not save study session."
        );

    }
}


function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval = null;

    timerRunning = false;

    timerSeconds = 0;


    const startButton =
        document.getElementById(
            "startTimerBtn"
        );

    const stopButton =
        document.getElementById(
            "stopTimerBtn"
        );


    if (startButton) {
        startButton.disabled = false;
    }


    if (stopButton) {
        stopButton.disabled = true;
    }


    updateTimerDisplay();
}


// =====================================================
// STUDY TIME
// =====================================================

async function loadStudyTime() {

    try {

        const response =
            await fetch(
                `${API_URL}/study-sessions/total`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load study time"
            );

        }


        const data =
            await response.json();


        const totalMinutes =
            Number(
                data.total_minutes
            ) || 0;


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            Math.round(
                totalMinutes % 60
            );


        const element =
            document.getElementById(
                "studyTime"
            );


        if (element) {

            element.textContent =
                `${hours}h ${minutes}m`;

        }

    }

    catch (error) {

        console.error(
            "Error loading study time:",
            error
        );

    }
}


// =====================================================
// WEEKLY STUDY ANALYTICS
// =====================================================

async function loadWeeklyStudy() {

    try {

        const response =
            await fetch(
                `${API_URL}/analytics/weekly-study`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load weekly study"
            );

        }


        const data =
            await response.json();


        const chart =
            document.getElementById(
                "weeklyChart"
            );


        if (!chart) {
            return;
        }


        if (data.length === 0) {

            chart.innerHTML =
                `<p class="empty">
                    No study data yet.
                </p>`;

            return;
        }


        const maxMinutes =
            Math.max(
                ...data.map(
                    day =>
                        Number(day.minutes) || 0
                ),
                1
            );


        chart.innerHTML =
            data.map(day => {

                const minutes =
                    Number(day.minutes) || 0;


                const height =
                    (
                        minutes /
                        maxMinutes
                    ) * 100;


                return `
                    <div class="chart-column">

                        <div class="chart-bar-container">

                            <div
                                class="chart-bar"
                                style="height: ${height}%"
                                title="${minutes} minutes"
                            ></div>

                        </div>


                        <div class="chart-value">
                            ${Math.round(minutes)}m
                        </div>


                        <div class="chart-day">
                            ${escapeHTML(day.day)}
                        </div>

                    </div>
                `;

            }).join("");

    }

    catch (error) {

        console.error(
            "Error loading weekly study:",
            error
        );

    }
}


// =====================================================
// TASK ANALYTICS
// =====================================================

async function loadTaskAnalytics() {

    try {

        const response =
            await fetch(
                `${API_URL}/analytics/tasks`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load task analytics"
            );

        }


        const data =
            await response.json();


        const completed =
            document.getElementById(
                "completedTasks"
            );

        const pending =
            document.getElementById(
                "pendingTasks"
            );

        const total =
            document.getElementById(
                "totalTasks"
            );


        if (completed) {
            completed.textContent =
                data.completed;
        }


        if (pending) {
            pending.textContent =
                data.pending;
        }


        if (total) {
            total.textContent =
                data.total;
        }

    }

    catch (error) {

        console.error(
            "Error loading task analytics:",
            error
        );

    }
}


// =====================================================
// SUBJECT ANALYTICS
// =====================================================

async function loadSubjectAnalytics() {

    try {

        const response =
            await fetch(
                `${API_URL}/analytics/subjects`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load subject analytics"
            );

        }


        const subjects =
            await response.json();


        const container =
            document.getElementById(
                "analyticsSubjects"
            );


        if (!container) {
            return;
        }


        if (subjects.length === 0) {

            container.innerHTML =
                `<p class="empty">
                    No subjects yet.
                </p>`;

            return;
        }


        container.innerHTML =
            subjects.map(subject => {

                return `
                    <div class="analytics-subject">

                        <div
                            class="analytics-subject-header"
                        >

                            <strong>
                                ${escapeHTML(
                                    subject.name
                                )}
                            </strong>


                            <span>
                                ${subject.progress}%
                            </span>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width: ${subject.progress}%"
                            ></div>

                        </div>

                    </div>
                `;

            }).join("");

    }

    catch (error) {

        console.error(
            "Error loading subject analytics:",
            error
        );

    }
}


// =====================================================
// DAY STREAK
// =====================================================

async function loadStreak() {

    try {

        const response =
            await fetch(
                `${API_URL}/analytics/streak`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load streak"
            );

        }


        const data =
            await response.json();


        const element =
            document.getElementById(
                "streakCount"
            );


        if (element) {

            element.textContent =
                data.streak;

        }

    }

    catch (error) {

        console.error(
            "Error loading streak:",
            error
        );

    }
}


// =====================================================
// HELPERS
// =====================================================

function getSubjectName(subjectId) {

    if (!subjectId) {
        return null;
    }


    const subject =
        subjectsCache.find(
            subject =>
                subject.id === subjectId
        );


    return subject
        ? subject.name
        : null;
}


function getLocalDate() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



// =====================================================
// LUNERA PROFILE & FIRST-VISIT WELCOME
// =====================================================
const LUNERA_PROFILE_KEY = "luneraProfileV1";

function getLuneraProfile() {
    try {
        return JSON.parse(localStorage.getItem(LUNERA_PROFILE_KEY) || "null");
    } catch (error) {
        return null;
    }
}

function applyLuneraProfile(profile) {
    const heading = document.getElementById("welcomeHeading");
    const subheading = document.getElementById("welcomeSubheading");
    if (!heading || !subheading) return;

    const name = (profile?.name || "").trim();
    const quote = (profile?.quote || "").trim();

    heading.textContent = name ? `Good to see you, ${name}.` : "Your space to make progress.";
    subheading.textContent = quote || "Make room for progress, one focused session at a time.";
}

function openWelcomeEditor(editing = false) {
    const overlay = document.getElementById("welcomeOverlay");
    const nameInput = document.getElementById("profileName");
    const quoteInput = document.getElementById("profileQuote");
    const title = document.getElementById("welcomeTitle");
    const intro = overlay?.querySelector(".welcome-intro");
    const skipButton = document.getElementById("skipQuoteBtn");
    const submitButton = document.getElementById("welcomeSubmitBtn");
    const savedProfile = getLuneraProfile();

    if (!overlay || !nameInput || !quoteInput) return;
    nameInput.value = savedProfile?.name || "";
    quoteInput.value = savedProfile?.quote || "";
    overlay.dataset.editing = editing ? "true" : "false";
    if (title) title.textContent = editing ? "Make it yours." : "Make room for progress.";
    if (intro) intro.textContent = editing
        ? "Update your name or add a personal reminder whenever you like."
        : "A calmer space to plan your work, focus on what matters, and see how far you’ve come.";
    if (skipButton) skipButton.textContent = editing ? "Save without quote" : "Continue without quote";
    if (submitButton) submitButton.innerHTML = editing ? 'Save changes <span aria-hidden="true">→</span>' : 'Continue <span aria-hidden="true">→</span>';
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    window.setTimeout(() => nameInput.focus(), 80);
}

function finishWelcome(skipQuote = false) {
    const nameInput = document.getElementById("profileName");
    const quoteInput = document.getElementById("profileQuote");
    const name = (nameInput?.value || "").trim();

    if (!name) {
        nameInput?.setCustomValidity("Please enter your name to continue.");
        nameInput?.reportValidity();
        nameInput?.focus();
        return;
    }
    nameInput.setCustomValidity("");

    const profile = {
        name: name.slice(0, 40),
        quote: skipQuote ? "" : (quoteInput?.value || "").trim().slice(0, 180)
    };
    try {
        localStorage.setItem(LUNERA_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.warn("Could not save Lunera profile in this browser.", error);
    }

    applyLuneraProfile(profile);
    const overlay = document.getElementById("welcomeOverlay");
    overlay?.classList.remove("is-visible");
    overlay?.setAttribute("aria-hidden", "true");
}

function initializeWelcome() {
    const overlay = document.getElementById("welcomeOverlay");
    const form = document.getElementById("welcomeForm");
    const skipButton = document.getElementById("skipQuoteBtn");
    const editButton = document.getElementById("editWelcomeBtn");
    if (!overlay || !form || !skipButton) return;

    const savedProfile = getLuneraProfile();
    if (savedProfile?.name) {
        applyLuneraProfile(savedProfile);
    } else {
        openWelcomeEditor(false);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        finishWelcome(false);
    });
    skipButton.addEventListener("click", () => finishWelcome(true));
    editButton?.addEventListener("click", () => openWelcomeEditor(true));
}


// =====================================================
// INITIALIZE APP
// =====================================================

async function initializeApp() {

    initializeWelcome();
    if (window.lucide) window.lucide.createIcons();
    loadCurrentDate();

    updateTimerDisplay();


    await loadSubjects();

    await loadTasks();

    await loadStudyTime();

    await loadWeeklyStudy();

    await loadTaskAnalytics();

    await loadSubjectAnalytics();

    await loadStreak();

}


initializeApp();

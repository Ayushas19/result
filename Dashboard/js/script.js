// ======================================
// FILE PATHS
// ======================================

const SCORE_FILE = "Dashboard/data/score_cleaned.xlsx";
const ELIMINATED_FILE = "Dashboard/data/eliminated_cleaned.xlsx";
const PARTICIPATION_FILE = "Dashboard/data/30_Days.xlsx";

let scoreData = [];
let eliminatedData = [];
let participationData = [];

// ======================================
// APP START
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);

async function initDashboard(){

    try{

        scoreData =
            await readExcel(
                SCORE_FILE
            );

        eliminatedData =
            await readExcel(
                ELIMINATED_FILE
            );

        participationData =
            await readExcel(
                PARTICIPATION_FILE
            );

        console.log(
            "Score:",
            scoreData.length
        );

        console.log(
            "Eliminated:",
            eliminatedData.length
        );

        console.log(
            "Participation:",
            participationData.length
        );

        loadMetrics();

        loadWinners();

        loadLeaderboard();

        loadCertificates();

        loadStrikeSections();

        setupSearch();

        initScrollReveal();

    }

    catch(error){

        console.error(error);

        alert(
            "Unable to load Excel files."
        );

    }

}

// ======================================
// READ EXCEL
// ======================================

async function readExcel(filePath){

    const response =
        await fetch(filePath);

    if(!response.ok){

        throw new Error(
            `File not found: ${filePath}`
        );

    }

    const arrayBuffer =
        await response.arrayBuffer();

    const workbook =
        XLSX.read(
            arrayBuffer,
            {
                type:"array"
            }
        );

    const sheetName =
        workbook.SheetNames[0];

    const worksheet =
        workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(
        worksheet
    );

}

// ======================================
// ANIMATED COUNTER
// ======================================

function animateCounter(
    element,
    target
){

    let current = 0;

    const speed =
        Math.max(
            1,
            target / 60
        );

    const timer =
        setInterval(() => {

            current += speed;

            if(current >= target){

                current = target;

                clearInterval(timer);

                // Add class when counter finishes
                element.classList.add("counter-pop");
                setTimeout(() => {
                    element.classList.remove("counter-pop");
                }, 500);

            }

            element.innerText =
                Math.floor(current);

        },15);

}

// ======================================
// METRICS
// ======================================

function loadMetrics(){

    const totalParticipants =
        scoreData.length +
        eliminatedData.length;

    const completed100Days =
        scoreData.length;

    const participationCertificates =
        participationData.length;

    const zeroStrikeCount =
        scoreData.filter(
            user =>
                Number(user.strikes) === 0
        ).length;

    animateCounter(
        document.getElementById(
            "metricParticipants"
        ),
        totalParticipants
    );

    animateCounter(
        document.getElementById(
            "totalParticipants"
        ),
        totalParticipants
    );

    animateCounter(
        document.getElementById(
            "completedParticipants"
        ),
        completed100Days
    );

    animateCounter(
        document.getElementById(
            "participationCount"
        ),
        participationCertificates
    );

    animateCounter(
        document.getElementById(
            "zeroStrikeCount"
        ),
        zeroStrikeCount
    );

}

// ======================================
// SCORE COLUMN
// ======================================
//
// CURRENT:
// total_score
//
// LATER REPLACE WITH:
// total_Final_Scores
//
// ONLY CHANGE THIS VARIABLE
//
// ======================================

const SCORE_COLUMN =
    "Total_Final_Scores";


// ======================================
// WINNERS
// ======================================

function loadWinners(){

    const sortedUsers =
        [...scoreData].sort(
            (a,b)=>
                Number(
                    b[SCORE_COLUMN]
                ) -
                Number(
                    a[SCORE_COLUMN]
                )
        );

    // -----------------------------
    // HALL OF FAME & 1ST PLACE
    // -----------------------------

    if(sortedUsers[0]){

        const winnerUsername = sortedUsers[0].github_username;
        const winnerScore = sortedUsers[0][SCORE_COLUMN];
        const avatarUrl = `https://github.com/${winnerUsername}.png`;

        // Populate Hall of Fame
        document.getElementById("hof-username").innerText = winnerUsername;
        document.getElementById("hof-score").innerText = winnerScore;
        document.getElementById("hof-avatar").src = avatarUrl;
        document.getElementById("hof-profile-link").href = `https://github.com/${winnerUsername}`;

        // Populate Podium Winner
        document.getElementById("winner-name").innerText = winnerUsername;
        document.getElementById("winner-score").innerText = `Score : ${winnerScore}`;
        document.getElementById("winner-avatar").src = avatarUrl;

    }

    // -----------------------------
    // RUNNER UP (2nd Place)
    // -----------------------------

    if(sortedUsers[1]){

        const runner1Username = sortedUsers[1].github_username;
        document.getElementById("runner1-name").innerText = runner1Username;
        document.getElementById("runner1-score").innerText = `Score : ${sortedUsers[1][SCORE_COLUMN]}`;
        document.getElementById("runner1-avatar").src = `https://github.com/${runner1Username}.png`;

    }

    // -----------------------------
    // SECOND RUNNER UP (3rd Place)
    // -----------------------------

    if(sortedUsers[2]){

        const runner2Username = sortedUsers[2].github_username;
        document.getElementById("runner2-name").innerText = runner2Username;
        document.getElementById("runner2-score").innerText = `Score : ${sortedUsers[2][SCORE_COLUMN]}`;
        document.getElementById("runner2-avatar").src = `https://github.com/${runner2Username}.png`;

    }

}


// ======================================
// LEADERBOARD
// ======================================

function loadLeaderboard(
    customData = null
){

    const tbody =
        document.getElementById(
            "leaderboardBody"
        );

    tbody.innerHTML = "";

    const data =
        customData || scoreData;

    const sortedUsers =
        [...data].sort(
            (a,b)=>
                Number(
                    b[SCORE_COLUMN]
                ) -
                Number(
                    a[SCORE_COLUMN]
                )
        );

    const topUsers =
        sortedUsers.slice(0,10);

    topUsers.forEach(
        (user,index)=>{

            const row =
                document.createElement(
                    "tr"
                );

            let medal = "";

            if(index === 0){

                medal = "<img src='assets/images/trophy_icon.png' class='leaderboard-medal' alt='Gold'>";

            }
            else if(index === 1){

                medal = "<img src='assets/images/medal_icon.png' class='leaderboard-medal' alt='Silver'>";

            }
            else if(index === 2){

                medal = "<img src='assets/images/strike_icon.png' class='leaderboard-medal' alt='Bronze'>";

            }
            else{

                medal =
                    "#" +
                    (index+1);

            }

            row.innerHTML = `

            <td>

                ${medal}

            </td>

            <td>

                <img
                src="https://github.com/${user.github_username}.png"
                alt="avatar"
                width="45"
                height="45"
                style="
                border-radius:50%;
                object-fit:cover;
                ">

            </td>

            <td>

                ${user.github_username}

            </td>

            <td>

                ${user[SCORE_COLUMN]}

            </td>

            `;

            tbody.appendChild(
                row
            );

        }
    );

}


// ======================================
// SEARCH
// ======================================

function setupSearch(){

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if(!searchInput) return;

    searchInput.addEventListener(
        "input",
        function(){

            const keyword =
                this.value
                .toLowerCase()
                .trim();

            if(keyword === ""){

                loadLeaderboard();

                return;

            }

            const filteredUsers =
                scoreData.filter(
                    user =>
                        String(
                            user.github_username
                        )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
                );

            loadLeaderboard(
                filteredUsers
            );

        }
    );

}


// ======================================
// OPTIONAL
// USER PROFILE URL
// ======================================

function getGithubProfileUrl(
    username
){

    return `https://github.com/${username}`;

}


// ======================================
// OPTIONAL
// TOP 3 ARRAY
// ======================================

function getTopThreeUsers(){

    return [...scoreData]
        .sort(
            (a,b)=>
                Number(
                    b[SCORE_COLUMN]
                ) -
                Number(
                    a[SCORE_COLUMN]
                )
        )
        .slice(0,3);

}

// ======================================
// CERTIFICATE HOLDERS
// ======================================

function loadCertificates(){

    loadCompletionCertificates();

    loadParticipationCertificates();

}


// ======================================
// COMPLETION HOLDERS
// ======================================

function loadCompletionCertificates(){

    const container =
        document.getElementById(
            "completionUsers"
        );

    container.innerHTML = "";

    scoreData.forEach(user => {

        const chip =
            createUserChip(
                user.github_username,
                "completion"
            );

        container.appendChild(
            chip
        );

    });

    document.getElementById(
        "completionCountBadge"
    ).innerText =
        scoreData.length;

}


// ======================================
// PARTICIPATION HOLDERS
// ======================================

function loadParticipationCertificates(){

    const container =
        document.getElementById(
            "participationUsers"
        );

    container.innerHTML = "";

    participationData.forEach(
        user => {

            const chip =
                createUserChip(
                    user.github_username,
                    "participation"
                );

            container.appendChild(
                chip
            );

        }
    );

    document.getElementById(
        "participationCountBadge"
    ).innerText =
        participationData.length;

}


// ======================================
// STRIKE ANALYSIS
// ======================================

function loadStrikeSections(){

    const zeroStrikeUsers =
        scoreData.filter(
            user =>
                Number(
                    user.strikes
                ) === 0
        );

    const oneStrikeUsers =
        scoreData.filter(
            user =>
                Number(
                    user.strikes
                ) === 1
        );

    const twoStrikeUsers =
        scoreData.filter(
            user =>
                Number(
                    user.strikes
                ) === 2
        );

    renderStrikeUsers(
        "zeroStrikeUsers",
        zeroStrikeUsers,
        "zero"
    );

    renderStrikeUsers(
        "oneStrikeUsers",
        oneStrikeUsers,
        "one"
    );

    renderStrikeUsers(
        "twoStrikeUsers",
        twoStrikeUsers,
        "two"
    );

    updateStrikeCounts(
        zeroStrikeUsers.length,
        oneStrikeUsers.length,
        twoStrikeUsers.length
    );

}


// ======================================
// STRIKE COUNTS
// ======================================

function updateStrikeCounts(

    zeroCount,
    oneCount,
    twoCount

){

    document.getElementById(
        "zeroStrikeAccordionCount"
    ).innerText =
        zeroCount;

    document.getElementById(
        "oneStrikeAccordionCount"
    ).innerText =
        oneCount;

    document.getElementById(
        "twoStrikeAccordionCount"
    ).innerText =
        twoCount;

}


// ======================================
// STRIKE USER RENDER
// ======================================

function renderStrikeUsers(

    containerId,
    users,
    className

){

    const container =
        document.getElementById(
            containerId
        );

    container.innerHTML = "";

    users.forEach(user => {

        const chip =
            createUserChip(
                user.github_username,
                className
            );

        container.appendChild(
            chip
        );

    });

}


// ======================================
// USER CHIP
// ======================================

function createUserChip(

    username,
    className

){

    const chip =
        document.createElement(
            "span"
        );

    chip.className =
        `user-chip ${className}`;

    chip.innerHTML = `

        <i class="fa-brands fa-github"></i>

        ${username}

    `;

    chip.addEventListener(
        "click",
        () => {

            window.open(
                `https://github.com/${username}`,
                "_blank"
            );

        }
    );

    return chip;

}


// ======================================
// OPTIONAL
// EXPORT TOP 10
// ======================================

function getTopTenUsers(){

    return [...scoreData]

        .sort(
            (a,b)=>

                Number(
                    b[SCORE_COLUMN]
                ) -

                Number(
                    a[SCORE_COLUMN]
                )

        )

        .slice(0,10);

}


// ======================================
// OPTIONAL
// GET ZERO STRIKE USERS
// ======================================

function getZeroStrikeUsers(){

    return scoreData.filter(
        user =>
            Number(
                user.strikes
            ) === 0
    );

}


// ======================================
// OPTIONAL
// GET COMPLETION HOLDERS
// ======================================

function getCompletionHolders(){

    return scoreData;

}


// ======================================
// OPTIONAL
// GET PARTICIPATION HOLDERS
// ======================================

function getParticipationHolders(){

    return participationData;

}


// ======================================
// SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
// ======================================

function initScrollReveal() {
    const sections = document.querySelectorAll(
        ".champions, .metrics-section-outer, .leaderboard, .certificate-section, .strike-section"
    );
    
    // Add CSS reveal class to all observed components
    sections.forEach(sec => {
        sec.classList.add("reveal-section");
    });
    
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(sec => {
        observer.observe(sec);
    });
}

// ======================================
// DEBUG INFO
// ======================================

console.log(
    "Dashboard JS Loaded Successfully"
);
let counter = 1;
let isReady = false;
let red1 = document.getElementById("ready1");
let red2 = document.getElementById("ready2");
const buttons = document.querySelectorAll(".bot1");

// تأكد من جلب خلايا حروف BINGO بشكل صحيح
// نستخدم "table tr:nth-last-child(1) td" للوصول لآخر صف (B-I-N-G-O)
const bingoCells = document.querySelectorAll("table tr:last-child td");

buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        if (!isReady) {
            if (this.textContent === "") {
                this.textContent = counter;
                counter++;
                if (counter > 25) {
                    isReady = true;
                    red1.innerHTML = "GAME START!";
                    red2.style.backgroundColor = "lightgreen";
                }
            }
        } else {
            // التبديل بين الملون وغير الملون عند اللعب
            if (this.style.backgroundColor === "rgb(222, 109, 122)") {
                this.style.backgroundColor = "";
                this.style.color = "black";
            } else {
                this.style.backgroundColor = "rgb(222, 109, 122)";
                this.style.color = "white";
            }
            checkWin(); // استدعاء دالة فحص الفوز
        }
    });
});

function checkWin() {
    let completedLines = 0;
    const size = 5;

    // 1. فحص الصفوف
    for (let i = 0; i < size; i++) {
        let rowFilled = true;
        for (let j = 0; j < size; j++) {
            if (buttons[i * size + j].style.backgroundColor !== "rgb(222, 109, 122)") {
                rowFilled = false;
            }
        }
        if (rowFilled) completedLines++;
    }

    // 2. فحص الأعمدة
    for (let i = 0; i < size; i++) {
        let colFilled = true;
        for (let j = 0; j < size; j++) {
            if (buttons[j * size + i].style.backgroundColor !== "rgb(222, 109, 122)") {
                colFilled = false;
            }
        }
        if (colFilled) completedLines++;
    }

    // 3. فحص الأقطار (X Shape)
    let diag1 = true;
    for (let i = 0; i < size; i++) {
        if (buttons[i * (size + 1)].style.backgroundColor !== "rgb(222, 109, 122)") diag1 = false;
    }
    if (diag1) completedLines++;

    let diag2 = true;
    for (let i = 1; i <= size; i++) {
        if (buttons[i * (size - 1)].style.backgroundColor !== "rgb(222, 109, 122)") diag2 = false;
    }
    if (diag2) completedLines++;

    updateBingoLetters(completedLines);
}

function updateBingoLetters(lines) {
    // تلوين الحروف B-I-N-G-O بناءً على عدد الخطوط
    for (let i = 0; i < 5; i++) {
        if (i < lines) {
            // تلوين الخلية بالأخضر إذا اكتمل خط
            if (bingoCells[i].style.backgroundColor !== "lightgreen") {
                bingoCells[i].style.backgroundColor = "lightgreen";
                // اهتزاز عند كل حرف جديد يضيء
                if (navigator.vibrate) navigator.vibrate(200);
            }
        } else {
            // مسح اللون إذا قام اللاعب بإلغاء تحديد خانة وقلت الخطوط عن 5
            bingoCells[i].style.backgroundColor = "";
        }
    }

    // صرخة الفوز واهتزاز قوي عند اكتمال 5 خطوط (كلمة BINGO)
    if (lines >= 5) {
        if (navigator.vibrate) navigator.vibrate([500, 100, 500]);
        
        if ('speechSynthesis' in window && !window.speechSynthesis.speaking) {
            let msg = new SpeechSynthesisUtterance("BINGO!");
            msg.lang = 'en-US';
            window.speechSynthesis.speak(msg);
        }

        setTimeout(() => {
            alert("BINGO! مبروك الفوز!");
        }, 300);
    }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("Service Worker Failed", err));
}

// أضف هذا في نهاية ملف scripte.js
window.onload = function() {
    const btn = document.getElementById("resetBtn");
    if (btn) {
        btn.onclick = function() {
            if (confirm("هل تريد إعادة تشغيل اللعبة؟")) {
                window.location.reload();
            }
        };
    }
};


// =====================================================
// K.W. CENTER
// PRE-GIFTED RESULT SYSTEM
// Version 2.00
// =====================================================

// ======================
// API URL
// ======================

const API_URL =
"https://script.google.com/macros/s/AKfycbxW4SVSRk7AkmMZtBynheuQoDrh0CbhppncmMX8NZadlen6-jLF28JlsiujwO4VVK5Y-g/exec";


// ======================
// ELEMENT
// ======================

const examIdInput=document.getElementById("examId");

const searchButton=document.getElementById("searchButton");

const status=document.getElementById("status");

const result=document.getElementById("result");

const printButton=document.getElementById("printButton");

const newSearchButton=document.getElementById("newSearchButton");



// ======================
// SEARCH
// ======================

searchButton.addEventListener("click",searchExam);

examIdInput.addEventListener("keypress",function(e){

if(e.key==="Enter"){

searchExam();

}

});




// ======================
// SEARCH EXAM
// ======================

async function searchExam(){

const examid=examIdInput.value.trim();

if(examid===""){

status.innerHTML="กรุณากรอกเลขประจำตัวสอบ";

status.style.color="red";

return;

}

searchButton.disabled=true;

searchButton.innerHTML="⏳ กำลังค้นหา...";

status.innerHTML="";

result.style.display="none";

try{

const response=await fetch(

API_URL+

"?examid="+

encodeURIComponent(examid)

);

const data=await response.json();

console.log(data);

if(data.success){

showResult(data);

}

else{

status.innerHTML="ไม่พบข้อมูล";

status.style.color="red";

}

}

catch(err){

console.log(err);

status.innerHTML="เกิดข้อผิดพลาดในการเชื่อมต่อ";

status.style.color="red";

}

searchButton.disabled=false;

searchButton.innerHTML="ตรวจสอบคะแนน";

}
// ======================
// SHOW RESULT
// ======================

function showResult(data){

    // แสดง Card
    result.style.display="block";

    // --------------------------
    // ข้อมูลผู้เข้าสอบ
    // --------------------------

    document.getElementById("resultExamId").textContent =
        data.examid;

    document.getElementById("resultName").textContent =
        data.name;


    // ==========================
    // คณิตศาสตร์
    // ==========================

    document.getElementById("mathFull").textContent =
        data.math.full + " ข้อ";

    document.getElementById("mathCorrect").textContent =
        data.math.correct + " ข้อ";

    document.getElementById("mathScore").textContent =
        data.math.score + " คะแนน";


    // ==========================
    // วิทยาศาสตร์
    // ==========================

    document.getElementById("scienceFull").textContent =
        data.science.full + " ข้อ";

    document.getElementById("scienceCorrect").textContent =
        data.science.correct + " ข้อ";

    document.getElementById("scienceScore").textContent =
        data.science.score + " คะแนน";


    // ==========================
    // ภาษาอังกฤษ
    // ==========================

    document.getElementById("englishFull").textContent =
        data.english.full + " ข้อ";

    document.getElementById("englishCorrect").textContent =
        data.english.correct + " ข้อ";

    document.getElementById("englishScore").textContent =
        data.english.score + " คะแนน";

    document.getElementById("englishTscore").textContent =
        data.english.tscore;


    // ==========================
    // คะแนนรวม
    // ==========================

    document.getElementById("mathScienceTotal").textContent =
        data.mathScience + " คะแนน";

    document.getElementById("grandTotal").textContent =
        data.grandTotal + " คะแนน";



    // ==========================
    // ผลสอบ
    // ==========================

    const resultStatus =
        document.getElementById("resultStatus");

    resultStatus.textContent =
        data.result;



    if(data.result==="ผ่าน"){

        resultStatus.classList.remove("fail");

        resultStatus.classList.add("pass");

    }

    else{

        resultStatus.classList.remove("pass");

        resultStatus.classList.add("fail");

    }



    // ==========================
    // อันดับ
    // ==========================

    let medal="🏅";

if(data.rank==1){

    medal="🥇";

}
else if(data.rank==2){

    medal="🥈";

}
else if(data.rank==3){

    medal="🥉";

}

document.getElementById("resultRank").innerHTML=

medal+

" อันดับ "

+

data.rank;



    // ==========================
    // Progress Bar
    // ==========================

    updateProgress(

        "mathBar",

        data.math.correct,

        data.math.full

    );


    updateProgress(

        "scienceBar",

        data.science.correct,

        data.science.full

    );


    updateProgress(

        "englishBar",

        data.english.correct,

        data.english.full

    );



    // ==========================
    // Scroll
    // ==========================
drawChart(data);
    result.scrollIntoView({

        behavior:"smooth"

    });

}
// ==========================
// Progress Bar
// ==========================

function updateProgress(id,correct,full){

    let percent = 0;

    if(full > 0){
        percent = (correct / full) * 100;
    }

    if(percent > 100){
        percent = 100;
    }

    const bar = document.getElementById(id);

    bar.style.width = percent + "%";

    bar.textContent = Math.round(percent) + "%";

    bar.style.color = "#fff";
    bar.style.fontWeight = "bold";
    bar.style.textAlign = "center";
    bar.style.lineHeight = "18px";
}
// ==========================
// New Search
// ==========================

newSearchButton.addEventListener(

"click",

function(){

    result.style.display="none";

    examIdInput.value="";

    status.innerHTML="";

    examIdInput.focus();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

);
// ==========================
// Print
// ==========================

printButton.addEventListener(
    "click",
    printReport
);
let chart;
function drawChart(data){

    if(chart){

        chart.destroy();

    }

    const ctx=

    document.getElementById("scoreChart");

    chart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:[

                "คณิต",

                "วิทย์",

                "อังกฤษ"

            ],

            datasets:[{

                label:"คะแนน",

                data:[

                    data.math.score,

                    data.science.score,

                    data.english.score

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}
// ==========================================
// PRINT REPORT
// ==========================================

function printReport() {

    const today = new Date();

    const printDate =
        today.toLocaleDateString("th-TH");

    const printTime =
        today.toLocaleTimeString("th-TH");

    let html = `

<!DOCTYPE html>

<html lang="th">

<head>

<meta charset="UTF-8">

<title>รายงานผลสอบ</title>

<style>

body{

    font-family:
    "Sarabun",
    sans-serif;

    margin:40px;

    color:#222;

}

.header{

    text-align:center;

    border-bottom:3px solid #1683D8;

    padding-bottom:20px;

    margin-bottom:30px;

}

.logo{

    width:90px;

    margin-bottom:10px;

}

h1{

    margin:5px;

    color:#1683D8;

}

h2{

    margin:5px;

    font-size:22px;

}

.info{

    margin-top:20px;

}

.info table{

    width:100%;

    border-collapse:collapse;

}

.info td{

    padding:10px;

    border:1px solid #CCC;

}

.subject{

    margin-top:25px;

}

.subject table{

    width:100%;

    border-collapse:collapse;

}

.subject th{

    background:#1683D8;

    color:white;

    padding:10px;

}

.subject td{

    border:1px solid #CCC;

    padding:10px;

}

.summary{

    margin-top:30px;

}

.summary table{

    width:100%;

    border-collapse:collapse;

}

.summary td{

    border:1px solid #CCC;

    padding:12px;

}

.footer{

    margin-top:70px;

    display:flex;

    justify-content:space-between;

}

.sign{

    text-align:center;

    width:250px;

}

.small{

    margin-top:50px;

    text-align:center;

    color:#777;

    font-size:13px;

}

.pass{

    color:green;

    font-weight:bold;

}

.fail{

    color:red;

    font-weight:bold;

}

</style>

</head>

<body>

<div class="header">

<img src="logo.png" class="logo">

<h1>โรงเรียนกวดวิชาแก่นวิทย์</h1>

<h2>รายงานผลสอบ Pre-Gifted</h2>

ปีการศึกษา 2569

</div>

<div class="info">

<table>

<tr>

<td width="30%">เลขประจำตัวสอบ</td>

<td>${document.getElementById("resultExamId").textContent}</td>

</tr>

<tr>

<td>ชื่อผู้เข้าสอบ</td>

<td>${document.getElementById("resultName").textContent}</td>

</tr>

</table>

</div>
`;
html += `

<div class="subject">

<table>

<tr>

<th>วิชา</th>

<th>จำนวนข้อ</th>

<th>ตอบถูก</th>

<th>คะแนน</th>

</tr>

<tr>

<td>คณิตศาสตร์</td>

<td>${document.getElementById("mathFull").textContent}</td>

<td>${document.getElementById("mathCorrect").textContent}</td>

<td>${document.getElementById("mathScore").textContent}</td>

</tr>

<tr>

<td>วิทยาศาสตร์</td>

<td>${document.getElementById("scienceFull").textContent}</td>

<td>${document.getElementById("scienceCorrect").textContent}</td>

<td>${document.getElementById("scienceScore").textContent}</td>

</tr>

<tr>

<td>ภาษาอังกฤษ</td>

<td>${document.getElementById("englishFull").textContent}</td>

<td>${document.getElementById("englishCorrect").textContent}</td>

<td>${document.getElementById("englishScore").textContent}</td>

</tr>

</table>

</div>

<div class="summary">

<table>

<tr>

<td>คะแนนรวม คณิต+วิทย์</td>

<td>${document.getElementById("mathScienceTotal").textContent}</td>

</tr>

<tr>

<td>คะแนนรวมทั้ง 3 วิชา</td>

<td>${document.getElementById("grandTotal").textContent}</td>

</tr>

<tr>

<td>T-Score ภาษาอังกฤษ</td>

<td>${document.getElementById("englishTscore").textContent}</td>

</tr>

<tr>

<td>ผลการสอบ</td>

<td class="${
document.getElementById("resultStatus").textContent.includes("ผ่าน")
?"pass":"fail"
}">
${document.getElementById("resultStatus").textContent}
</td>

</tr>

<tr>

<td>อันดับ</td>

<td>${document.getElementById("resultRank").textContent}</td>

</tr>

</table>

</div>

<div class="footer">

<div class="sign">

..............................................

<br>

ผู้ปกครอง

</div>

<div class="sign">

..............................................

<br>

ผู้อำนวยการ

</div>

</div>

<div class="small">

พิมพ์เมื่อ

${printDate}

เวลา

${printTime}

<br>

K.W. Center Pre-Gifted Result System

</div>

</body>

</html>

`;
const printWindow = window.open("", "_blank");

printWindow.document.write(html);

printWindow.document.close();

printWindow.focus();

setTimeout(function(){

    printWindow.print();

},500);

}
var indexQuestion = 
    document.querySelector('#stt-question');
var contenQuestion = 
    document.querySelector('#content-question');
var sttQuestion = 
    document.querySelector('#stt-question');
var dapan = 
    document.querySelectorAll('.dapan');
var showGameOverElement = 
    document.querySelector('#show-gameover');
var timing = document.querySelector('#question .timing');

console.log(timing);

// ham kiem tra xem array co gia tri hop le hay k
var isValueVaild = function(arr) {
    for(var i=0; i<arr.length; ++i) {
        if(arr[i])
            return true;
    }
    return false;
}

//constructor dataQuestion
var Question = function (operator, num1, num2, answer) {
    this.operator = operator;
    this.num1 = num1;
    this.num2 = num2;
    this.answer = answer;
}

// function init question
var initQuestion = function () {

    var arrayOperator = ['+','-','*','/'];
    var operator = arrayOperator[Math.floor((Math.random() * 4))];
    var num1 = Math.floor(Math.random() * (100));
    var num2 = 0, answer = 0;
    
    switch(operator) {

        case '+': num2 = Math.floor(Math.random() * (100));
                  answer = num1 + num2;
                break;

        case '-': num2 = Math.floor(Math.random() * (100));
                  answer = num1 - num2
                break;

        case '*': num1++;
                  num2 = Math.floor(Math.random() * (9)) + 1; // ko cho num2 = 0, xem lại hàm addValueForAnswer (=0 => false => ko add dc value);
                  answer = num1 * num2;
                break;

        default : num2 = Math.floor(Math.random() * (9) + 1);
                  answer = num1/num2;
                  answer = parseFloat(answer.toFixed(2));  
    }

    var dataQuestion = new Question(operator, num1, num2, answer);
    return dataQuestion;

}

// function add value to answer element
var addValueForAnswer = function(listValue, nodeElement) {
    var indexOfNodeElement = 0;
    do {
        var i = Math.floor((Math.random() * 4));
        if(listValue[i]) {
            nodeElement[indexOfNodeElement].innerText = listValue[i];
            indexOfNodeElement++;
            delete listValue[i];
        }
    }while(isValueVaild(listValue));
}

var changeBgWhenTrue = function(elementWantChange) {
    //add background color
    setTimeout(function(){
        elementWantChange.classList.add('bg-true');
    }, 0);

    // remove background color
    setTimeout(function(){
        elementWantChange.classList.remove('bg-true');
    }, 200);

    setTimeout(function(){
        elementWantChange.classList.add('bg-true');
    }, 400);

    setTimeout(function(){
        elementWantChange.classList.remove('bg-true');
    }, 600);
}

// function change background when false
var changeBgWhenFalse = function (elementWantChange) {
    
    // set background for answer false
    elementWantChange.classList.add('bg-false');

    //set border for main
    elementWantChange.parentElement.parentElement.classList.add('border-for-main');
}

//function show message game over
var showMessageGameOver = function (element) {

    //show message
    showGameOverElement.style.display = 'block';

    // Add number answer true for show message game over
    var numAnswerTrue = showGameOverElement.querySelector('#get-numQuestion');
    numAnswerTrue.innerText = `${numQuestion-1}`;

    // hủy bỏ bắt sự kiện click chuột vào đáp án
    for(var x = 0; x < dapan.length; ++x) {
        dapan[x].onclick = function () {
        }
    }
    clearTimeout(check);

    //replay
    document.querySelector('#replay').onclick = function() {
        replay(element);
    }

}

// function hightlight answer true when user select false
var hightLightAnswerTrue = function (element, answerTrue) {

    //select list answer
    
    for(var i = 0; i < element.length; ++i) {
        if(element[i].innerText == answerTrue) {
            element[i].parentElement.parentElement.classList.add('bg-true');
        }
    }
}

//function replay
var replay = function (elementWantChange) {

    //hide message gameover
    showGameOverElement.style.display = 'none';

    //gỡ các giá trị của đáp án người dùng khi sai
    if(elementWantChange) {
        elementWantChange.classList.remove('bg-false');
        elementWantChange.parentElement.parentElement.classList.remove('border-for-main');
        console.log(elementWantChange.parentElement);
    }

    var listAnswers = document.querySelectorAll('#answer .select-answer');
    console.log(listAnswers);
    for(var i = 0; i < listAnswers.length; ++i) {
        listAnswers[i].classList.remove('bg-true');
    }

    //set các giá trị thành ban đầu
    numQuestion = 1;
    isGameOver = false;
    
    //gọi lại hàm play để tiếp tục chơi
    play(isGameOver);
}


// code add element TextNode
var numQuestion = 1;
var isGameOver = false;
var selectOfUser = 0;
var time = 0;
var check;

var play = function (isGameOver) {
    if (!isGameOver) {

        sttQuestion.innerText = `${numQuestion}`;
        var dataQuestion = initQuestion();
        console.log(dataQuestion);
        
        contenQuestion.innerText = `${dataQuestion.num1} ${dataQuestion.operator} ${dataQuestion.num2} = ?`;

        var listAnswer = [
            parseFloat(dataQuestion.answer),
            parseFloat(dataQuestion.answer) + parseFloat((Math.floor(Math.random() * 10) + 1)),
            parseFloat(dataQuestion.answer) + parseFloat((Math.floor(Math.random() * 10) + 1)),
            parseFloat(dataQuestion.answer) - parseFloat((Math.floor(Math.random() * 10) - 1)),
        ];
        console.log(listAnswer);

        //add
        addValueForAnswer(listAnswer, dapan);

        time = 15;
        checkTime();

        //lấy đáp án người dùng
        for (var i = 0; i < dapan.length; ++i) {

            dapan[i].onclick = function (e) {

                selectOfUser = e.target.innerText;
                parseFloat(selectOfUser);
                parseFloat(dataQuestion.answer);
                isGameOver = (selectOfUser != dataQuestion.answer);

                if (isGameOver) {
                    
                    changeBgWhenFalse(e.target.parentElement.parentElement);
                    showMessageGameOver(e.target.parentElement.parentElement);
                    //đánh dấu đáp án đúng khi user chọn sai
                    hightLightAnswerTrue(dapan, dataQuestion.answer)

                } else {
                    numQuestion++;
                    clearTimeout(check);
                    changeBgWhenTrue(e.target.parentElement.parentElement);
                }

                // qua câu khác
                setTimeout(function () {
                    play(isGameOver);
                }, 1500);
            }
        }
    }
    return 0;
}



// xử lý thời gian
var checkTime = function () {
    timing.innerText = time;
    time--;
    
    if(time >= 0) {
        check = setTimeout(checkTime, 1000);
    } else {
        showMessageGameOver();
    }
}

play(isGameOver);

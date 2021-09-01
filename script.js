let li = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let content;
let submitbtn = document.getElementById('submit');
let output = document.getElementById('label');

function printObject(object) {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if (typeof (element) != 'object') {
                if(key == 'word'){
                    content += `<li class="word"><h2><span>${key}:</span> ${element}</h2></li>`;
                }
                else if (key == 'audio') {
                    content += `<li><span>${key}:</span> <audio controls>
                    <source src="http:${element}" type="audio/ogg">
                    <source src="horse.mp3" type="audio/mpeg">
                  Your browser does not support the audio element.
                  </audio></li>`;
                }
                else if (key != 'phonetic') {
                    content += `<li><span>${key}:</span> ${element}</li>`;
                }
            } else if (Array.isArray(element)) {
                if (element.length != 0) {
                    content += `<li><span>${key}:</span>`;
                    traverseArray(element);
                    content += `</li >`;
                }
            }
        }
    }
}

function traverseArray(array) {
    let count = 0;
    for (let i = 0; i < Math.min(5, array.length); i++) {
        let element = array[i];
        if (typeof (element) == 'object') {
            content += `<ul>`;
            printObject(element);
            content += `</ul><br>`;

        }
        else {
            if (count > 5)
                break;

            count++;
            if (count === Math.min(5, array.length))
                content += `${element}.`;
            else
                content += `${element}, `;

        }
    };
}

submit.onclick = function () {
    document.getElementById("empty").style.display = "none";
    document.getElementById("box1").style.padding = "20px 20px 20px 35px";
    content = "";
    let word = document.getElementById('textbox').value;
    fetch(li + word)
        .then((response) => {
            if (!response.ok)
                throw new Error("Not 2xx response");
            return response.json();
        })
        .then((data) => {
            let meanings = data;
            for (let i = 0; i < meanings.length; i++) {
                let element = meanings[i];
                if (Array.isArray(element)) {
                    traverseArray(element);
                }
                else if (typeof (element) == 'object') {
                    content += `<ul class="top">`;
                    printObject(element);
                    content += '</ul>'
                }
                else {
                    console.log(element);
                }
            }
            output.innerHTML = content;        
            console.log(data);
        })
        .catch((error) => {
            console.log(error, "error found");
            content = "<ul id='top'><li><h2><b>No definations found.</b></h2><p>Sorry pal, we couldn't find definitions for the word you were looking for.<br> You can try the search again at later time or head to the web instead.</p></li></ul>";
            output.innerHTML = content;
        });
    
};

document.getElementById('switch5').addEventListener('click', (event) => {
    console.log("checked>>>>>>>");
    if (event.target.checked) {
        console.log("checked>>>>>>>")
        document.getElementById('switch1').disabled = true
        document.getElementById('switch2').disabled = true
        document.getElementById('switch3').disabled = true
        document.getElementById('switch4').disabled = true
        document.getElementById('customRange3').disabled = true
    } else {
        console.log("Unchecked>>>>>>>")
        document.getElementById('switch1').disabled = false
        document.getElementById('switch2').disabled = false
        document.getElementById('switch3').disabled = false
        document.getElementById('switch4').disabled = false
        document.getElementById('customRange3').disabled = false
    }
});
var btn = document.getElementById("form3");
var modal2 = document.getElementById("myModal2");
// When the user clicks the button, open the modal
function on(){
    modal2.style.display = "block";
}
function off(){
    modal2.style.display = "none";
}
btn.addEventListener("submit", (event)=>{
    event.preventDefault();
    console.log("button clicked")
   on();
});

var btn2 = document.getElementById("IgnoreButton");
btn2.addEventListener('click',()=>{
    console.log("Listener is working...")
    off();
})



//registration ------
let objToket = {
    token: "",
    history: 0,
    currentPwd: null
}
async function submitForm(event) {
    event.preventDefault();
    const name = document.getElementsByTagName("input")[0].value;
    const email = document.getElementsByTagName("input")[1].value;
    const password = document.getElementsByTagName("input")[2].value;
    const cpassword = document.getElementsByTagName("input")[3].value;
    if (!(cpassword === password)) {
        document.getElementById("id0").innerHTML = "Please fill the same password";
    } else {
        try {
            let data = await myfunction(name, email, password);
            singlePage(obj.v1 = 'form2')
            console.log(data);
        } catch (error) {
            console.log("this is Error" + error);
        }
        console.log("Submit function is working")

    }
    return false;
}
const myfunction = async (name, email, password) => {
    try {
        let response = await fetch('http://localhost:5434/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        if (!response.ok) {
            console.log(response);
            //singlePage('form2')
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        return error
    }

}
//registration listener-----
document.getElementById("form1").addEventListener('submit', function myfunc(event) {
    submitForm(event)
})


// login -----
async function loginForm(event) {
    event.preventDefault();
    const email = document.getElementsByTagName("input")[4].value;
    const password = document.getElementsByTagName("input")[5].value;
    //console.log(typeof(password));
    try {
        let data = await checkLogin(email, password);
        // Assuming you have a JSON response with a key 'token'
        if (data && data != undefined) {
            const token = data.token;
            // Set the cookie with the JWT token
            if (data.success == 1) {
                const cookieDetails = {
                    url: 'http://127.0.0.1:5500/',  // Replace with your domain
                    name: 'jwtToken',
                    value: token,
                    secure: true,
                    httpOnly: true,
                    sameSite: 'strict'
                };

                chrome.cookies.set(cookieDetails, (cookie) => {
                    console.log('Cookie set:', cookie);
                });
                document.addEventListener("DOMContentLoaded", singlePage(null));


            } else if (data.msg === "email not found") {

                document.getElementById('l0').innerHTML = "<h3 text-white > Email not found</h3>";

                // singlePage(v1);

            } else if (data.msg === "email or password is incorrect") {

                document.getElementById('l0').innerHTML = "<h3 text-white >email or password is incorrect</h3>";

            }

        }
        console.log(data);

    } catch (error) {
        console.log("this is Error" + error);
    }
    //console.log("Hello i am login page");

}
const checkLogin = async (Email, Password) => {

    try {
        let response = await fetch('http://localhost:5434/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                email: Email,
                password: Password
            })
        });
        if (!response.ok) {
            console.log(response);
            //singlePage('form');
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        return error
    }

}
//login listener----
document.getElementById("form2").addEventListener('submit', function myfunc2(event) {
    loginForm(event)
})


//single page application---
async function singlePage(temp) {
    // Define your condition to choose which form to show
    if (!temp || temp == undefined) {
        const cookieName = 'jwtToken';
        let token;
        let p = new Promise((resolve, reject) => {
            chrome.cookies.get({ name: cookieName, url: "http://127.0.0.1:5500/" }, (cookie) => {
                if (cookie) {
                    token = cookie.value;
                    console.log('Token from cookie:', token);
                } else {
                    console.log('Cookie not found.');
                    token = "";
                }
                return resolve(token);
            });
        })
        token = await p;
        console.log("Again token found " + token);
        objToket.token = token;
        if (token && token != "") {
            // Show form 1 and hide form 2
            document.getElementById('form1').style.display = 'none';
            document.getElementById('form2').style.display = 'none';
            document.getElementById('home').style.display = 'block';
            document.getElementById('table').style.display = 'none';

            // Searching for current webpage url is their any generated password stored

            let obj3 = { currentUrl: null }
            let p2 = new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    // tabs is an array of tab objects; we'll use the first (and usually only) tab
                    const currentTab = tabs[0];
                    const currentUrl = currentTab.url;
                    return resolve(currentUrl);
                });
            })
            let currentUrl = await p2;
            
            ///--------------------------------
            let domain;
            // Find & remove protocol (http, ftp, etc.) and get domain
            if (currentUrl.indexOf('://') > -1) {
                domain = currentUrl.split('/')[2];
            } else {
                domain = currentUrl.split('/')[0];
            }
            domain = domain.split(':')[0];
            currentUrl = domain;

            console.log('Current URL:', currentUrl, typeof (currentUrl));

            try {
                let data = await myfunction3(objToket.token, currentUrl);
                console.log(data);
                let p = data.password
                let pwd = "" + data.password;
                let un = "" + data.user_name;
                abc2(pwd,un);
                if (pwd) objToket.currentPwd = pwd;
                const arr = pwd.split(pwd.charAt(3))
                if (p && p != undefined) {
                    document.getElementById("messege").innerHTML = "<h3 >---For this page User_Name---</h3>";
                    document.getElementById("password").innerHTML = "<h2 class= text-white text-center>" + un +"<h2> ";
                    document.getElementById("fill").innerHTML = "Copy-Password";
                    document.getElementById("fill").addEventListener('click', async (event) => {
                        event.preventDefault();
                        const val = password;
                        navigator.clipboard.writeText(pwd);

                    })
                    document.getElementById('generate').textContent = "Update"
                }


            } catch (error) {
                console.log("this is Error" + error);
            }

        } else {
            // Show form 2 and hide form 1
            document.getElementById('form1').style.display = 'none';//hiding registration form
            document.getElementById('form2').style.display = 'block';//showing login form
            document.getElementById('home').style.display = 'none';//hiding home page
            document.getElementById('table').style.display = 'none';//hiding home page

        }
    } else {
        if (temp == 'form1') {
            document.getElementById('form1').style.display = 'block';
            document.getElementById('home').style.display = 'none';
            document.getElementById('table').style.display = 'none';
            document.getElementById('form2').style.display = 'none';
        } else if (temp == 'form2') {
            document.getElementById('form1').style.display = 'none';
            document.getElementById('table').style.display = 'none';
            //document.getElementById('form1').remove()
            document.getElementById('home').style.display = 'none';
            document.getElementById('form2').style.display = 'block';
        } else if (temp == 'home') {
            document.getElementById('form1').style.display = 'none';
            document.getElementById('table').style.display = 'none';

            document.getElementById('home').style.display = 'block';
            document.getElementById('form2').style.display = 'none';
        } else if (temp == 'table') {
            document.getElementById('form1').style.display = 'none';
            document.getElementById('table').style.display = 'block';

            document.getElementById('home').style.display = 'block';
            document.getElementById('form2').style.display = 'none';
        }


    }

}
const myfunction3 = async (token, url) => {
    try {
        let response = await fetch('http://localhost:5434/api/getPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                url: url
            })
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        return error
    }

}


// generate password------
async function generate(event) {
    event.preventDefault();
    console.log("yahan pr pwd..." + objToket.currentPwd)
    if (objToket.currentPwd) {
        try {
            const p = await deleteFunction(objToket.token, objToket.currentPwd);

        } catch (error) {
            console.log("Eroor in Deleting " + error);
        }
        // deleteFunction(objToket.token,objToket.currentPwd)
    }
    const upperCase = document.getElementById('switch1').checked;
    const lowerCase = document.getElementById('switch2').checked;
    const integer = document.getElementById('switch3').checked;
    const special = document.getElementById('switch4').checked;
    const crypto = document.getElementById('switch5').checked;
    const length = document.getElementById('customRange3').value;
    const user_name=document.getElementById('field1').value;
    console.log("Home page details ", upperCase, lowerCase, integer, special, length, user_name);
    // Fetching current urls---------------------

    let obj3 = { currentUrl: null }
    if (crypto) {
        let p2 = new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // tabs is an array of tab objects; we'll use the first (and usually only) tab
                const currentTab = tabs[0];
                const currentUrl = currentTab.url;
                return resolve(currentUrl);
            });
        })
        let currentUrl = await p2;
        console.log('Current URL:', currentUrl, typeof (currentUrl));

        let domain;
        // Find & remove protocol (http, ftp, etc.) and get domain
        if (currentUrl.indexOf('://') > -1) {
            domain = currentUrl.split('/')[2];
        } else {
            domain = currentUrl.split('/')[0];
        }
        domain = domain.split(':')[0];
        currentUrl = domain;

        try {
            let data = await myfunction2(objToket.token, currentUrl, null, user_name);
            console.log(data);
            console.log(data);
            let p = data.password
            objToket.currentPwd = p;
            let pwd = "" + data.password;
            const arr = pwd.split(pwd.charAt(3))
            if (p && p != undefined) {
                document.getElementById("messege").innerHTML = "<h1 >---Your Password ---</h1>";
                document.getElementById("password").innerHTML = "<h2 class= text-white text-center>>" + arr[0] + "********<h2> ";
                document.getElementById("fill").innerHTML = "Copy-Text";
                document.getElementById("fill").addEventListener('click', () => {

                    const val = password;
                    navigator.clipboard.writeText(p);
                    // Alert the copied text

                    alert("Copied the text!!!!!!! ");
                })
                abc2(pwd,user_name);
            }

            //document.getElementById("fill").

        } catch (error) {
            console.log("this is Error" + error);
        }
        console.log("Submit function is working");
    } else if (upperCase || lowerCase || integer || special) {
        objPass = {
            upperCase: upperCase,
            lowerCase: lowerCase,
            special: special,
            integer: integer,
            length: length
        }
        let p2 = new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // tabs is an array of tab objects; we'll use the first (and usually only) tab
                const currentTab = tabs[0];
                const currentUrl = currentTab.url;
                return resolve(currentUrl);
            });
        })
        let currentUrl = await p2;
        console.log('Current URL:', currentUrl, typeof (currentUrl));

        try {
            let data = await myfunction2(objToket.token, currentUrl, objPass, user_name);
            console.log(data);
            console.log(data);
            let p = data.password
            objToket.currentPwd = p;
            let pwd = "" + data.password;
            const arr = pwd.split(pwd.charAt(3))
            if (p && p != undefined) {
                abc2(pwd,user_name);
                document.getElementById("messege").innerHTML = "<h1 >---Your Password was---</h1>";
                document.getElementById("password").innerHTML = "<h2 class= text-white text-center>>" + arr[0] + "********<h2> ";
                document.getElementById("fill").innerHTML = "Copy-Text";
                document.getElementById("fill").addEventListener('click', () => {

                    const val = password;
                    navigator.clipboard.writeText(p);
                    // Alert the copied text
                    alert("Copied the text!!!!!!! ");
                })
            }

            //document.getElementById("fill").

        } catch (error) {
            console.log("this is Error" + error);
        }
        console.log("Submit function is working");

    } else {
        const dc = document.createElement('p').textContent = "Please Select Criteria...";
        document.getElementById("id0").appendChild(dc);
    }
}
const myfunction2 = async (token, url, objPass, user_name) => {

    if (objPass) {

        try {
            let response = await fetch('http://localhost:5434/api/setPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    url: url,
                    objPass: objPass,
                    user_name : user_name
                })
            });
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            return response.json();
        } catch (error) {
            return error
        }

    } else {
        try {
            let response = await fetch('http://localhost:5434/api/setPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    url: url,
                    objPass: null,
                    user_name : user_name
                })
            });
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            return response.json();
        } catch (error) {
            return error
        }
    }

}
// Listeners when you click on generate password--------
document.getElementById("submitButton").addEventListener('click', (event) => {
    off();
    generate(event);

})

//fetch  all passwords------------------
async function fetchPasswords(event) {

    try {

        let response = await fetch('http://localhost:5434/api/allPassword', {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'token': objToket.token
            }

        });

        if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
        }

        return response.json();

    } catch (error) {

        return error;

    }
}


let obj = {
    v1: null,
    table: 0

}
document.getElementById("Register").addEventListener("click", () => { singlePage(obj.v1 = 'form1') });
document.getElementById("Login").addEventListener("click", () => { singlePage(obj.v1 = 'form2') });
document.getElementById("history").addEventListener('click', async (event) => {

    if (!objToket.history) {
        singlePage('table')
        if (obj.table == 0) {
            try {
                let data = await fetchPasswords(event);
                for (let i = 0; i < data.length; i++) {
                   

                    const row = document.createElement('tr');
                    const cell1 = document.createElement('td');
                    const cell2 = document.createElement('td');
                    const cell3 = document.createElement('td');
                    const url = data[i].url;
                    let domain;

                    // Find & remove protocol (http, ftp, etc.) and get domain
                    if (url.indexOf('://') > -1) {
                        domain = url.split('/')[2];
                    } else {
                        domain = url.split('/')[0];
                    }
                    domain = domain.split(':')[0];
                    const URL = domain;

                    const button = document.createElement('button');
                    button.textContent = 'Delete';
                    button.id = 'dltButton';
                    button.setAttribute('message', domain);
                    const button2 = document.createElement('button');
                    button2.textContent = 'Copy';
                    button2.id = 'copyButton';
                    button2.addEventListener('click', () => {
                        navigator.clipboard.writeText(data[i].password2);
                    })
                    button.addEventListener('click', async function () {
                        // Delete the row when the button is clicked

                        // alert("<h1>Ok</h1>");
                        showModal();
                        try {
                            const p = await deleteFunction(objToket.token, data[i].password);
                            if (p) {
                                row.remove();
                            }

                        } catch (error) {
                            console.log("Eroor in Deleting " + error);
                        }
                        hideModal();

                    });

                    cell3.textContent = data[i].password2.split(data[i].password2.charAt(10))[0] + "******";
                    cell2.textContent = URL;
                    cell1.appendChild(button);
                    cell1.appendChild(button2);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    row.appendChild(cell3);
                    const targetPassword = data[i].password;
                    // const elm = "<tr><td><button type=button id=dltButton data-messege=" + i + ">Delete</button></td><td>" + data[i].url + "</td><td>" + data[i].password + "</td></tr>";
                    const tableBody = document.getElementById('tableBody');
                    // if(obj.table==0){
                    tableBody.appendChild(row);
                    obj.table = 1
                    // }
                    

                    // document.getElementById('dltButton'+i).addEventListener("click", () => { const message = document.getElementById("dltButton").getAttribute('message'); alert(message); });

                }
                console.log(data);

            } catch (error) {
                console.log("this is Error" + error);
            }
            console.log("History is displaying");
        }
        objToket.history = true;

    } else {
        singlePage('home');
        objToket.history = false;
    }
})
async function deleteFunction(token, targetPassword) {
    try {

        let response = await fetch('http://localhost:5434/api/delete', {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'password': targetPassword
            }

        });

        if (response.ok) {
            console.log(response);
            return response.json();
            // throw new Error('Network response was not ok');
        } else {
            return false;
        }



    } catch (error) {

        return error;

    }
}



document.addEventListener("DOMContentLoaded", singlePage(obj.v1));


// Function to Send a message to the content script--------------
async function abc2(data,user_name) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello", data: data , user_name : user_name });
    // do something with response here, not outside the function
    console.log(response);
}



//trnslation functions------------------------------
async function translateText(text, targetLanguage, currentLanguage) {
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${currentLanguage}|${targetLanguage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            return 'Translation failed.';
        }
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed.';
    }
}

// Function to show the modal and loading spinner
function showModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Function to hide the modal and loading spinner
function hideModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Function to translate the entire page

async function translatePage(tl, cl) {
    if (tl !== cl) {
        showModal();
        const targetLanguage = tl; // Replace with your target language code (e.g., 'es' for Spanish)
        console.log(targetLanguage);
        const elementsToTranslate = document.querySelectorAll('strong,label,button,p,u,h2,h1,a'); // Adjust as needed
        for (const element of elementsToTranslate) {
            const originalText = element.textContent;
            if (originalText && originalText != '' && originalText != undefined) {
                const translatedText = await translateText(originalText, targetLanguage, cl);
                element.textContent = translatedText;
            }

        }
        hideModal();
    }

}
//fetching the language elements--------------------------------
// 1-------------
lang = {
    cl: 'en'
}
document.getElementById('1').addEventListener('click', (event) => {
    // event.preventDefault();
    const targetLanguage = document.getElementById('1').getAttribute("data-custom");
    translatePage(targetLanguage, lang.cl);
    lang.cl = targetLanguage;
    console.log("button clicked");
})
// 2-------------
document.getElementById('2').addEventListener('click', (event) => {
    // event.preventDefault();
    const targetLanguage = document.getElementById('2').getAttribute("data-custom");
    translatePage(targetLanguage, lang.cl);
    lang.cl = targetLanguage;
    console.log("button clicked");
})
// 3-------------
document.getElementById('3').addEventListener('click', (event) => {
    event.preventDefault();
    const targetLanguage = document.getElementById('3').getAttribute("data-custom");
    translatePage(targetLanguage, lang.cl);
    lang.cl = targetLanguage;
    console.log(val);
    console.log("button clicked");
})
// 4-------------
document.getElementById('4').addEventListener('click', (event) => {
    event.preventDefault();
    const targetLanguage = document.getElementById('4').getAttribute("data-custom");
    translatePage(targetLanguage, lang.cl);
    lang.cl = targetLanguage;
    console.log(val);
    console.log("button clicked");
})
// 5-------------
document.getElementById('5').addEventListener('click', (event) => {
    event.preventDefault();
    const targetLanguage = document.getElementById('5').getAttribute("data-custom");
    translatePage(targetLanguage, lang.cl);
    lang.cl = targetLanguage;
    console.log(val);
    console.log("button clicked");
})
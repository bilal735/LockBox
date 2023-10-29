
console.log("content Script is running...........")
//appending the password-------------------------
function fill(suggestion1, user_name) {

    function fetchLoginFields() {
        const loginFields = [];
        const inputElements = document.querySelectorAll('input[type="password"]');

        inputElements.forEach(input => {
            loginFields.push(input);
        });

        return loginFields;
    }
    function fetchUserNameFields() {
        const loginFields = [];
        const inputElements = document.querySelectorAll('input[type="text"]');

        inputElements.forEach(input => {
            loginFields.push(input);
        });

        return loginFields;
    }
    function createSuggestionElement(suggestion, inputElement) {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = `Your Creditentials: ${suggestion}`;
        suggestionElement.style.cursor = 'pointer';
        suggestionElement.style.padding = '5px';
        suggestionElement.style.backgroundColor = 'black';
        suggestionElement.style.color = 'white';
        suggestionElement.style.border = '1px solid #ccc';
        suggestionElement.style.borderRadius = '5px';

        suggestionElement.addEventListener('click', () => {
            inputElement.value = suggestion;
            suggestionElement.remove();
        });

        return suggestionElement;
    }

    // Fetch login fields and append suggestions
    const loginFields = fetchLoginFields();

    const user_names = fetchUserNameFields();

    loginFields.forEach(input => {
        const loginSuggestion = suggestion1;
        const suggestionElement = createSuggestionElement(loginSuggestion, input);

        input.insertAdjacentElement('afterend', suggestionElement);
    });
    if (user_name != 'undefined') {
        user_names.forEach(input => {
            const loginSuggestion = user_name;
            const suggestionElement = createSuggestionElement(loginSuggestion, input);
            input.insertAdjacentElement('afterend', suggestionElement);
        });
    }

}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello") {
            if (request.data && request.data != 'undefined') {
                console.log("password is here " + request.data);
                if (request.data != undefined) fill(request.data, request.user_name);
            }
        }
        sendResponse({ farewell: "goodbye" });
    }
);
//lsitening for a form to submit-----------------


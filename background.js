// console.log("background script is running.....")
// // Listen for messages from content scripts or other parts of the extension
// // background.js

// // Listen for messages from content scripts or other parts of the extension
// // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// //     // Handle the message from the content script
// //     //console.log('Message received in background script:', message);
// //     if(message.action=='fill1'){

// //         chrome.tabs.sendMessage({ action: 'fill2' ,data:message.password});

// //     }

// //     // You can send a response back if needed
// //     sendResponse({ response: 'Message received in the background script' });
// // });

// //Checking for the URLS----------------------------------------------------------------

// chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//     // Check if the tab is reloaded (status is "loading")
//     if (changeInfo.status === 'loading') {

//         console.log('Tab reloaded. Running your function...');

//         let p2 = new Promise((resolve, reject) => {
//             chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//                 const currentTab = tabs[0];
//                 const currentUrl = currentTab.url;
//                 return resolve(currentUrl);
//             });
//         })

//         let currentUrl = await p2;

//         console.log('Current URL From Content Script :', currentUrl, typeof (currentUrl));

//         //fetching the token----------------
//         const cookieName = 'jwtToken';
//         let token;
//         let p = new Promise((resolve, reject) => {
//             chrome.cookies.get({ name: cookieName, url: "http://127.0.0.1:5500/" }, (cookie) => {
//                 if (cookie) {
//                     token = cookie.value;
//                     // console.log('Token from cookie:', token);
//                 } else {
//                     console.log('Cookie not found.');
//                     token = "";
//                 }
//                 return resolve(token);
//             });
//         })
//         token = await p;
//         console.log("Again token found in Backgroud script " + token);

//         let obj={
//             url,
//             token
//         }

//         // Send a message from your background script
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             const activeTab = tabs[0];
//             chrome.tabs.sendMessage(activeTab.id, { data: "Hello from the background!" }, (response) => {
//                 // Handle the response from the content script
//                 console.log("Response from content script:", response);
//             });
//         });

//     }
// });






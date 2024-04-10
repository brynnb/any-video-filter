debugMode = true;

function debugLog(message) {
  if (debugMode) {
    console.log(message);
  }
}

//useful to make websites less distracting while debugging them
function replaceImagesWithGreyBoxesForTesting() {
  // Select all image elements
  var images = document.getElementsByTagName("img");

  // Loop through all image elements
  for (var i = 0; i < images.length; i++) {
    // Change the source of the image to a 1x1 grey pixel
    images[i].src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    // Set the background color to grey
    images[i].style.backgroundColor = "#808080";

    // Preserve aspect ratio while ensuring the image covers the whole area
    images[i].style.objectFit = "cover";
  }
}

if (debugMode) {
  replaceImagesWithGreyBoxesForTesting();
  hideEPAd();
}

//I need to see if ublock works/persists on developer instance of firefox/chrome
function hideEPAd() {
  //hide the elemnt with class "ad300px"
  var ad300px = document.getElementsByClassName("ad300px");
  if (ad300px.length > 0) {
    ad300px[0].style.display = "none";
  }

  //hide element with "adnative-1x1" class
  var adnative1x1 = document.getElementsByClassName("adnative-1x1");
  if (adnative1x1.length > 0) {
    adnative1x1[0].style.display = "none";
  }
}

debugLog("Loading Any Video Filter");

const videoResolutions = [
  "144p",
  "240p",
  "360p",
  "480p",
  "720p",
  "1080p",
  "1440p",
  "2160p",
  "4320p",
];

selectedResolution = "2160p";

function findElementsWithText(text) {
  let elements = [];
  let walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes(text)) {
      elements.push(node.parentElement);
    }
  }
  debugLog(`Found ${elements.length} elements with text "${text}"`);
  return elements;
}

function getDirectTextContent(parent, element) {
  let directText = parent.outerHTML;
  //   for (let child of parent.childNodes) {
  //     if (child !== element) {
  //       directText += child.outerHTML;
  //     }
  //   }
  // remove the outerHTML text from directText
  if (directText) {
    directText = directText.replace(element.outerHTML, "");
    // debugLog(`Direct text content of node: ${directText}`);
  } else {
    // debugLog('parent text is empty');
    directText = "";
  }

  return directText;
}

function includesForbiddenText(text) {
  for (let resolution of videoResolutions) {
    if (text.includes(resolution)) {
      // debugLog('found forbidden text:')
      // debugLog(resolution)
      // debugLog('and')
      // debugLog(text)
      return true;
    }
  }
  return false;
}

function findHighestParent(element) {
  let currentElement = element;
  while (currentElement.parentElement) {
    let parentDirectText = getDirectTextContent(
      currentElement.parentElement,
      currentElement
    );
    // debugLog("wee1");
    // debugLog(parentDirectText);
    if (includesForbiddenText(parentDirectText)) {
      break;
    }
    currentElement = currentElement.parentElement;
  }
  //   debugLog(`Found highest parent for element`);
  return currentElement;
}

function getVisiblePixelArea(element) {
  let style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return 0;
  }
  let rect = element.getBoundingClientRect();
  //round down height and width the nearest integer
  rect.width = Math.floor(rect.width);
  rect.height = Math.floor(rect.height);

  return {
    area: rect.width * rect.height,
    width: rect.width,
    height: rect.height,
  };
}

function getUniqueSelector(element) {
  let path = [];
  while (element) {
    let selector = element.nodeName.toLowerCase();
    if (element.id) {
      selector += "#" + element.id;
    } else if (element.className && typeof element.className === "string") {
      selector += "." + element.className.split(" ").join(".");
    }
    path.unshift(selector);
    element = element.parentNode;
  }
  return path.join(" > ");
}

let likelyVideoElements = [];
let elementsByResolution = [];
videoResolutions.forEach((resolution) => {
  elementsByResolution[resolution] = [];
  let resolutionElements = findElementsWithText(resolution);
  resolutionElements.forEach((element) => {
    let parent = findHighestParent(element);
    let pixelArea = getVisiblePixelArea(parent);
    debugLog(
      `Pixel area for parent of element with text "${resolution}": ${pixelArea.area}, width: ${pixelArea.width}, height: ${pixelArea.height}`
    );
    if (pixelArea.area > 22000) {
      //if parent doesnt have id, assign a random one and inject it into the html
      if (!parent.id) {
        parent.id = `avf-${Math.random().toString(36).substring(7)}`;
        debugLog(`Assigned ID to parent: ${parent.id}`);
      }
      //push ID of element to likelyVideoElements
      likelyVideoElements.push(parent.id);
    }
  });

  elementsByResolution[resolution] = likelyVideoElements;
});

console.log(elementsByResolution);

// elements.sort(
//   (a, b) => getVisiblePixelArea(b).area - getVisiblePixelArea(a).area
// );

// debugLog(`Final sorted elements: ${elements}`);

// $(document).ready(function () {
//   function checkIfExtensionEnabled() {
//     chrome.storage.local.get(["extensionEnabled"], function (result) {
//       if (result.extensionEnabled == false) {
//         window.stop();
//       }
//     });
//   }

//   debugLog("Document is ready");

//   var extensionEnabled = true;

//   if (!extensionEnabled) {
//     window.stop();
//   }

//   var currentCheckRunning; //to be set later and re-run as needed

//   //poll every half second to see if page height changed - if so it possibly means more content has loaded
//   //TODO: make this detect AJAX instead - current ajax detection attempts have failed
//   var currentPageHeight = 0;

//   setInterval(function () {
//     var body = document.body;
//     var html = document.documentElement;

//     var newPageHeight = Math.max(
//       body.scrollHeight,
//       body.offsetHeight,
//       html.clientHeight,
//       html.scrollHeight,
//       html.offsetHeight
//     );

//     //debugLog('checking height' + newPageHeight + '  ' + currentPageHeight);

//     if (newPageHeight != currentPageHeight && currentCheckRunning) {
//       currentCheckRunning(); //run whatever the current check is for current domain

//       currentPageHeight = newPageHeight;
//     }
//   }, 500);

//   // Function to be called when the progressBarValue changes
//   function onProgressBarValueChange(newValue) {
//     debugLog("Progress bar value changed to:", newValue);
//   }

//   // Select the element with the role 'progressbar'
//   var progressBar = document.querySelector('[role="progressbar"]');

//   // Initial setup to store the last known value of the CSS variable
//   let lastKnownValue = getComputedStyle(progressBar)
//     .getPropertyValue("--web-ui_internal_progress-bar-value")
//     .trim();

//   // Create an instance of MutationObserver
//   var observer = new MutationObserver(function (mutations) {
//     debugLog("running mutation");
//   });

//   // Start observing the progressBar element for attribute changes
//   observer.observe(progressBar, {
//     attributes: true, // This configures the observer to watch for changes to attributes of the progressBar
//   });

//   // Remember to disconnect the observer when it's no longer needed to avoid memory leaks
//   // observer.disconnect();

//   function youtubeCheck() {
//     //remove individual video listings that have filter matches
//     $("ytd-rich-item-renderer").each(function () {
//       var str = $(this).html();

//       if (hasFilteredKeywordsInText(str)) {
//         $(this).hide();
//       }
//     });

//     //covid banner or other nagging stuff that never goes away on youtube
//     $("ytd-rich-section-renderer").each(function () {
//       var str = $(this).html();

//       if (hasFilteredKeywordsInText(str)) {
//         $(this).hide();
//       }
//     });

//     //remove "featured" ad sections
//     $("ytd-rich-section-renderer").each(function () {
//       var str = $(this).html().toLowerCase();

//       if (
//         str.indexOf("ytd-compact-promoted-item-renderer") >= 0 ||
//         str.indexOf("ytd-primetime-promo-renderer") >= 0
//       ) {
//         $(this).hide();
//       }
//     });

//     //remove search results
//     $("ytd-video-renderer").each(function () {
//       var str = $(this).html();

//       if (hasFilteredKeywordsInText(str)) {
//         $(this).hide();
//       }
//     });

//     //remove items from channel-specific grid-groups
//     $("ytd-grid-video-renderer").each(function () {
//       var str = $(this).html();

//       if (hasFilteredKeywordsInText(str)) {
//         $(this).hide();
//       }
//     });

//     //remove sections in "best of youtube" category search results entirely if the title is offending
//     $("ytd-item-section-renderer").each(function () {
//       //look at just the title, not all the contents, otherwise something like the entire "Trending" list might get hidden
//       var str = $(this).find("#title").html();

//       if (hasFilteredKeywordsInText(str)) {
//         $(this).hide();
//         debugLog("grr13");
//       }
//     });
//   }
// });

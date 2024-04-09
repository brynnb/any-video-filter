console.log("Loading Any Video Filter");

$(document).ready(function () {
  function checkIfExtensionEnabled() {
    chrome.storage.local.get(["extensionEnabled"], function (result) {
      if (result.extensionEnabled == false) {
        window.stop();
      }
    });
  }

  console.log("Document is ready");

  var extensionEnabled = true;

  if (!extensionEnabled) {
    window.stop();
  }

  var currentCheckRunning; //to be set later and re-run as needed

  //poll every half second to see if page height changed - if so it possibly means more content has loaded
  //TODO: make this detect AJAX instead - current ajax detection attempts have failed
  var currentPageHeight = 0;

  setInterval(function () {
    var body = document.body;
    var html = document.documentElement;

    var newPageHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    //console.log('checking height' + newPageHeight + '  ' + currentPageHeight);

    if (newPageHeight != currentPageHeight && currentCheckRunning) {
      currentCheckRunning(); //run whatever the current check is for current domain

      currentPageHeight = newPageHeight;
    }
  }, 500);

  getDuolingoData();

  // Function to be called when the progressBarValue changes
  function onProgressBarValueChange(newValue) {
    console.log("Progress bar value changed to:", newValue);
  }

  // Select the element with the role 'progressbar'
  var progressBar = document.querySelector('[role="progressbar"]');

  // Initial setup to store the last known value of the CSS variable
  let lastKnownValue = getComputedStyle(progressBar)
    .getPropertyValue("--web-ui_internal_progress-bar-value")
    .trim();

  // Create an instance of MutationObserver
  var observer = new MutationObserver(function (mutations) {

	console.log('running mutation')
    
  });

  // Start observing the progressBar element for attribute changes
  observer.observe(progressBar, {
    attributes: true, // This configures the observer to watch for changes to attributes of the progressBar
  });

  // Remember to disconnect the observer when it's no longer needed to avoid memory leaks
  // observer.disconnect();

  function getDuolingoData() {
    //create json of each id and its content
    var items = [];

    $("tr.athing").each(function () {
      var id = $(this).attr("id");
      //assign child .commtext to variable
      var content = $("tr#" + id + " .commtext").html();

      //convert content to regular text without html tags
      content = $("<div/>").html(content).text();

      items.push({
        id: id,
        content: content,
      });

      // if(hasFilteredKeywordsInText(str)) {
      // 	//change background color to red
      // 	$(this).css('background-color', '#ff0000');
      // }
    });

    //truncate items to first 10 for testing
    items = items.slice(0, 10);

    console.log(items);
  }

  function youtubeCheck() {
    //remove individual video listings that have filter matches
    $("ytd-rich-item-renderer").each(function () {
      var str = $(this).html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).hide();
      }
    });

    //covid banner or other nagging stuff that never goes away on youtube
    $("ytd-rich-section-renderer").each(function () {
      var str = $(this).html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).hide();
      }
    });

    //remove "featured" ad sections
    $("ytd-rich-section-renderer").each(function () {
      var str = $(this).html().toLowerCase();

      if (
        str.indexOf("ytd-compact-promoted-item-renderer") >= 0 ||
        str.indexOf("ytd-primetime-promo-renderer") >= 0
      ) {
        $(this).hide();
      }
    });

    //remove search results
    $("ytd-video-renderer").each(function () {
      var str = $(this).html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).hide();
      }
    });

    //remove items from channel-specific grid-groups
    $("ytd-grid-video-renderer").each(function () {
      var str = $(this).html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).hide();
      }
    });

    //remove sections in "best of youtube" category search results entirely if the title is offending
    $("ytd-item-section-renderer").each(function () {
      //look at just the title, not all the contents, otherwise something like the entire "Trending" list might get hidden
      var str = $(this).find("#title").html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).hide();
        console.log("grr13");
      }
    });
  }

  function imgurCheck() {}

  function twitterCheck() {
    console.log(
      "count " +
        $('div[aria-label^="Timeline: Your Home"]')
          .first()
          .children()
          .children().length
    );

    //filter from trending sidebar
    $('div[aria-label^="Timeline: Trending now"]')
      .first()
      .children()
      .children()
      .each(function () {
        if (hasFilteredKeywordsInText($(this).html())) {
          $(this).hide();
        }
        //console.log($(this).html());
      });

    $('div[aria-label^="Timeline: Your Home"]')
      .children()
      .children()
      .each(function () {
        if (hasFilteredKeywordsInText($(this).html())) {
          $(this).hide();
        }
      });
  }

  function oldRedditCheck() {
    //check for title keywords to block
    $("a.title").each(function () {
      var str = $(this).html().toUpperCase();

      if (hasFilteredKeywordsInText(str)) {
        $(this).parents(".thing.link").first().hide();
      }
    });

    //check for subreddits to block
    $("a.subreddit").each(function () {
      var str = $(this).html().toUpperCase().substring(2);

      if (hasFilteredKeywordsInText(str)) {
        $(this).parents(".thing.link").first().hide();
      }
    });
  }

  function newRedditCheck() {
    //new reddit check keywords to block
    $("h3").each(function () {
      var str = $(this).html();

      if (hasFilteredKeywordsInText(str)) {
        $(this).parents().eq(6).hide();
      }
    });

    //new reddit check for subreddits to block
    $('a[data-click-id="subreddit"]').each(function () {
      var str = $(this).html().substring(2);

      if (hasFilteredKeywordsInText(str)) {
        $(this).parents().eq(5).hide();
      }
    });
  }
});

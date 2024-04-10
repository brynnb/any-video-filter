# any-video-filter
 The premise of this extension is to eventually filter any video website, though the realtiy is that it will likely just work and be tested on the major video platforms in the US. It will also have a few other nice-to-have features regarding video player options. I'm building this extension because many video websites will:

 * Ignore user filtering for a given resolution (e.g. show 2k video when user selected 4k only)
 * Not sort by user selection, or does not provide basic sorting functionality
 * Reverts video resolution to lower option (or "auto") resolution on every page load
 * Auto-mutes or un-mutes every video despite earlier selection to unmute/mute player
 * Have annoying stuff like the Youtube Shorts section that keeps re-appearing despite having closed it previously
 * Doesn't provide a "-" operator for search to specifically exclude some results
 * Required navigating through pages to see all results
 * Other annoying stuff I'll document as I come across it


 ** How it works

 This extension attempts to fine HTML elements that serve as the container for each video thumbnail/info. It does this by looking for common attributes across most any video site, such as the listed resolution or playback time. It sorts all of these videos in an array and then applies filtering and other options as defined the extension settings. 


### To-do

* Get an array of all video elements
    * This is probably best done looking at playtime, which is a consistent foramt between most any video website (e.g. 1:23 or 23:01)
    * Can fallback to resolution if timer elements not found
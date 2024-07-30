/**
 * @name HideOthersActivity
 * @author andresh3
 * @description This addon hides the custom and game activity status of other users from you.
 * @version 1.0.0
 */

// Using regex-style CSS query selectors
// to avoid the changing suffix in discord class_names
const nowPlayingColumnQuery = `div[class^='nowPlayingColumn'], div[class*=' nowPlayingColumn']`
const peopleListItemQuery = `*[class^='peopleListItem'], *[class*=' peopleListItem']`
const avatarQuery = `*[class^='avatar'], *[class*=' avatar']`
const activityQuery = `*[class^='activity'], *[class*=' activity']`
const textQuery = `*[class^='text'], *[class*=' text']`
const channelQuery = `li[class^='channel'], li[class*=' channel']`
const memberQuery = `div[class^='memberInner'], div[class*=' memberInner']`
const statusBubbleQuery = `*[class^='statusBubble'], *[class*=' statusBubble']`
const activityBiteSizeQuery = `*[class^='activityBiteSizePopout'], *[class*=' activityBiteSizePopout']`
const tablistActivityQuery = `*[role="tablist"] div[aria-label="Activity"]`

module.exports = class HideOthersActivity {
  constructor(meta) {
    // No constructor code is needed.
  }

  /**
   * Runs the start-up code when module is loaded.
   */
  start() {
    console.log('Starting HideOthersActivity')
    this.onSwitch(); // Sometimes the "onSwitch" function
    // is not ran directly after enabling and the page may
    // show activity until page is switched.
  }

  stop() {
    // Since our plugin only changes pages via the onSwitch() method,
    // once our plugin is disabled all future changes will be disabled.
    // Activity information will be automatically reloaded as soon as the
    // user switches a page (which they have to do to exit the plugins screen)
  }

  /**
   * utiltizes the onSwitch method to automatically remove or change all elements from a page that contain non generic activity information
   */
  onSwitch()
  {

    // Remove 'nowPlayingColumn' from discord friends page
    const nowPlayingColumn = document.querySelector(nowPlayingColumnQuery);
      // Use regex style CSS selectors to avoid
      // class suffix from changing

    if(nowPlayingColumn)
      nowPlayingColumn.style.display = "none";

    // Replaces any custom activity statuses with basic version: "online/offline/dnd/idle"
    document.querySelectorAll(peopleListItemQuery).forEach((e)=>{
      var status = e.querySelector(avatarQuery).ariaLabel.split(',')[1]

      var activity = e.querySelector(activityQuery)
      if(activity)
      {
        for (const child of activity.children)
        {
          child.style.display="none"
        }
        var text = activity.querySelector(textQuery)
        text.innerText = status
        text.style.display = "inherit"
      }
    })

    // take care of the direct messages activity
    // labels, as well as labels in guilds
    document.querySelectorAll(channelQuery + ', ' + memberQuery).forEach((e)=>{

      var activity = e.querySelector(activityQuery)
      if(activity)
      {
        for (const child of activity.children)
        {
          child.style.display = "none"
        }
        var text = activity.querySelector(textQuery)
        text.innerText = ''
        text.style.display = "inherit"
      }

    })
    // remove status bubble on profile
    // "biteSizePopout" on mini profile in guild,
    // and entire "activity" tab (selector) on full profile
    document.querySelectorAll( statusBubbleQuery + ', ' + activityBiteSizeQuery + ', ' + tablistActivityQuery).forEach((e)=>{
      e.style.display = 'none';
    })
  }
};

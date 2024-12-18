// Function to calculate the time difference between a timestamp and the current time
// and return a user-friendly string representation
export const getTimeDifference = (timestamp) => {
    // Create a Date object representing the current time
    const now = new Date();
  
    // Create a Date object from the provided timestamp (assuming milliseconds)
    const newsDate = new Date(timestamp);
  
    // Calculate the difference between the two dates in milliseconds
    const diffInMs = now.getTime() - newsDate.getTime();
    
    // Convert the milliseconds to minutes by dividing by the number of milliseconds in a minute (60 seconds * 1000 milliseconds)
    // and round down the result using Math.floor
    const diffInMinutes = Math.floor(diffInMs / 60000);
  
    // Convert the minutes to hours by dividing by the number of minutes in an hour (60 minutes)
    // and round down the result using Math.floor
    const diffInHours = Math.floor(diffInMinutes / 60);
  
    // Convert the hours to days by dividing by the number of hours in a day (24 hours)
    // and round down the result using Math.floor
    const diffInDays = Math.floor(diffInHours / 24);
  
    // Check if the difference is in days
    if (diffInDays > 0) {
      // Return a formatted string with the number of days and plural suffix if applicable
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      // Check if the difference is in hours
      // Return a formatted string with the number of hours and plural suffix if applicable
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      // Check if the difference is in minutes
      // Return a formatted string with the number of minutes and plural suffix if applicable
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      // If the difference is very small, return "just now"
      return 'just now';
    }
  };
  
  
  // Helper function to format the timestamp
  export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  //========= HANDLE SHARE LINKS ================
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  //copy link
  export const handleCopyLink = (url) => {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch((error) => {
        console.error('Failed to copy the link:', error);
      });
    };
  
    //share to facebook
   export const handleShareToFacebook = (url) => {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookShareUrl, '_blank');
    };
  
  //share to twitter
   export const handleShareToTwitter = (url, heading) => {
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(heading)}`;
      window.open(twitterShareUrl, '_blank');
    };
  
 /**
 * Checks if the provided airdrop end date has passed
 * @param {string} timestamp - ISO 8601 timestamp string (e.g. '2024-11-17T23:00:00')
 * @returns {string} Returns 'ended' if the timestamp is in the past, 'active' otherwise
 * @throws {Error} If timestamp is invalid
 */
export const isActive = (timestamp) => {
  // Validate timestamp
  if (!timestamp || !(new Date(timestamp)).getTime()) {
    throw new Error('Invalid timestamp provided');
  }

  const endDate = new Date(timestamp);
  const currentDate = new Date();

  return currentDate > endDate ? 'Ended' : new Date(timestamp).toLocaleDateString();
};


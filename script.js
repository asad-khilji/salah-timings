// Function to update current date
function updateGregorianDate() {
    const dateElement = document.getElementById('gregorianDate');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerHTML = today.toLocaleDateString(undefined, options);
}

// Function to convert 24-hour time to 12-hour time with AM/PM
function convertTo12Hour(time) {
    const [hours, minutes] = time.split(':');
    let period = 'A.M.';
    let hour = parseInt(hours);

    if (hour >= 12) {
        period = 'P.M.';
        if (hour > 12) {
            hour -= 12;
        }
    } else if (hour === 0) {
        hour = 12; // Midnight case
    }

    return `${hour}:${minutes} ${period}`;
}

// Function to fetch prayer times from the API
function fetchPrayerTimes(latitude, longitude) {
    const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            document.getElementById('fajrTime').innerText = convertTo12Hour(timings.Fajr);
            document.getElementById('sunriseTime').innerText = convertTo12Hour(timings.Sunrise);
            document.getElementById('zuhrTime').innerText = convertTo12Hour(timings.Dhuhr);
            document.getElementById('asrTime').innerText = convertTo12Hour(timings.Asr);
            document.getElementById('maghrebTime').innerText = convertTo12Hour(timings.Maghrib);
            document.getElementById('ishaTime').innerText = convertTo12Hour(timings.Isha);
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
        });
}

// Function to search city and get its coordinates using OpenCage Geocoding API
function searchCity() {
    const city = document.getElementById('cityInput').value;

    // OpenCage Geocoding API key (you should replace this with your actual API key)
    const apiKey = '4ba03748fc924f00aea74d0e223feaf4';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;

    // Fetch coordinates of the city
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const latitude = data.results[0].geometry.lat;
                const longitude = data.results[0].geometry.lng;
                // Fetch Salah times based on the latitude and longitude
                fetchPrayerTimes(latitude, longitude);
            } else {
                console.error('City not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
        });
}

// Call function to update content on page load
updateGregorianDate();

import { FITBIT_CLIENT_ID, SERVER_URL } from "../constants";

export const refreshToken = async (user) => {
  if (!user.accessToken) return null;

  const refreshToken = user.accessToken.refresh_token;
  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: FITBIT_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString()
    });
    const data = await response.json();
    if (data.errors) {
      console.error(data.errors[0].errorType, data.errors[0].message);
      return null;
      // return Linking.openURL('https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RT4L&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=1w_X75XBECB_EQRvdQMvPcluXNJvmrmPSK-NUP_xRBk&code_challenge_method=S256&state=3b3l4c3i2w4c4x5v4t5i1e1m1d1u3w43&redirect_uri=canbewell%3A%2F%2Fredirect');
    }
    await fetch(`${SERVER_URL}/cbw/accesstokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: JSON.stringify(data), uid: user.user.id })
    });

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const extractCodeAndStateFromURL = (url) => {
  const params = {};
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let match;
  while (match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  return params;
};

const today = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Adds leading zero for months 1-9
  const day = String(today.getDate()).padStart(2, '0'); // Adds leading zero for days 1-9
  return `${year}-${month}-${day}`;
};

const yesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // Adds leading zero for months 1-9
  const day = String(yesterday.getDate()).padStart(2, '0'); // Adds leading zero for days 1-9
  return `${year}-${month}-${day}`;
};

export const getActivitiesLogList = async (accessToken, date = yesterday()) => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/list.json?afterDate=${date}&sort=asc&offset=0&limit=100`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return response.json();
};

export const getDailyActivitySummary = async (accessToken, date = today()) => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/date/${date}.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return response.json();
};

export const getActivityTimeSeries = async (accessToken, resourcePath, date = today()) => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/${resourcePath}/date/${date}/7d.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return response.json();
};

export const getSleepByDate = async (accessToken, date = today()) => {
  const response = await fetch(`https://api.fitbit.com/1.2/user/${accessToken.user_id}/sleep/date/${date}.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return response.json();
};

export const getActivityIntradayByInterval = async (accessToken, resourcePath, detailLevel = '15min', start = 'today', end = 'today') => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/${resourcePath}/date/${start}/${end}/${detailLevel}/time/0:00/23:59.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return await response.json();
};

export const hourlyInterval = (data) => {
  const res = []
  let sum = 0;
  let hour = 0;
  const maxHour = 23;
  for (let d of data) {
    if (parseInt(d.time.split(':')[0]) === hour) {
      sum += d.value;
    } else {
      res.push({ time: hour, value: sum });
      sum = d.value;
      hour = parseInt(d.time.split(':')[0]);
    }
  }
  res.push({ time: hour, value: sum });
  if (hour < maxHour) {
    for (let i = hour + 1; i <= maxHour; i++) {
      res.push({ time: i, value: 0 });
    }
  }
  return res;
};

export const getHourlyActivityByDateRange = async (accessToken, resourcePath, detailLevel, startDate = 'today', endDate = 'today') => {
  const dates = [];
  // generate date from start to end and save all in dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  let loop = new Date(start);
  while (loop <= end) {
    const year = loop.getFullYear();
    const month = String(loop.getMonth() + 1).padStart(2, '0');
    const day = String(loop.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    loop.setDate(loop.getDate() + 1);
  }

  dates.reverse();
  const res = [];
  try {
    for (let date of dates) {
      const data = await getActivityIntradayByInterval(accessToken, resourcePath, detailLevel, date, date);
      if (data?.errors)
        throw new Error(data.errors[0].message);
      const ts = data['activities-steps-intraday']?.dataset || [];
      const hourly = hourlyInterval(ts);
      res.push(hourly);
    }
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const getActivityIntradayByDateRange = async (accessToken, resourcePath, detailLevel = '15min', startDate = 'today', endDate = 'today') => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/${resourcePath}/date/${startDate}/${endDate}/${detailLevel}.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return await response.json();
};

export const getAZMTimeSeriesByInterval = async (accessToken, startDate, endDate) => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/active-zone-minutes/date/${startDate}/${endDate}.json`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });
  return await response.json();
};

export const getActivityLogList = async (accessToken, afterDate) => {
  const response = await fetch(`https://api.fitbit.com/1/user/${accessToken.user_id}/activities/list.json?afterDate=${afterDate}&sort=asc&offset=0&limit=100`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${accessToken.access_token}`,
    },
  });

  return response.json();
};

export const maxValue = (data) => {
  return data.reduce((max, p) => p.value > max ? p.value : max, data[0].value);
}
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '';

export interface FitbitAccessToken {
  access_token: string;
  refresh_token?: string;
  user_id?: string;
  [key: string]: unknown;
}

export interface UserStateWithToken {
  accessToken: FitbitAccessToken | null;
  user: { id: number };
}

export const refreshToken = async (user: UserStateWithToken): Promise<FitbitAccessToken | null> => {
  if (!user.accessToken) return null;
  const refresh = user.accessToken.refresh_token;
  if (!refresh) return null;
  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: FITBIT_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refresh,
      }).toString(),
    });
    const data = (await response.json()) as FitbitAccessToken | { errors: Array<{ errorType: string; message: string }> };
    if ('errors' in data) {
      const errs = data.errors as Array<{ errorType: string; message: string }>;
      if (errs.length > 0) {
        console.error(errs[0].errorType, errs[0].message);
      }
      return null;
    }
    await fetch(`${SERVER_URL}/cbw/accesstokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: JSON.stringify(data), uid: user.user.id }),
    });
    return data as FitbitAccessToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const extractCodeAndStateFromURL = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};

const today = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const yesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getActivitiesLogList = async (
  accessToken: FitbitAccessToken,
  date: string = yesterday()
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/list.json?afterDate=${date}&sort=asc&offset=0&limit=100`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getDailyActivitySummary = async (
  accessToken: FitbitAccessToken,
  date?: string
): Promise<unknown> => {
  const d = date ?? today();
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/date/${d}.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getActivityTimeSeries = async (
  accessToken: FitbitAccessToken,
  resourcePath: string,
  date: string = today()
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/${resourcePath}/date/${date}/7d.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getSleepByDate = async (
  accessToken: FitbitAccessToken,
  date: string = today()
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1.2/user/${userId}/sleep/date/${date}.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getActivityIntradayByInterval = async (
  accessToken: FitbitAccessToken,
  resourcePath: string,
  detailLevel: string = '15min',
  start: string = 'today',
  end: string = 'today'
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/${resourcePath}/date/${start}/${end}/${detailLevel}/time/0:00/23:59.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

interface TimeValuePoint {
  time: string;
  value: number;
}

export const hourlyInterval = (data: TimeValuePoint[]): { time: number; value: number }[] => {
  const res: { time: number; value: number }[] = [];
  let sum = 0;
  let hour = 0;
  const maxHour = 23;
  for (const d of data) {
    const h = parseInt(d.time.split(':')[0], 10);
    if (h === hour) {
      sum += d.value;
    } else {
      res.push({ time: hour, value: sum });
      sum = d.value;
      hour = h;
    }
  }
  res.push({ time: hour, value: sum });
  for (let i = hour + 1; i <= maxHour; i++) {
    res.push({ time: i, value: 0 });
  }
  return res;
};

export const getHourlyActivityByDateRange = async (
  accessToken: FitbitAccessToken,
  resourcePath: string,
  detailLevel: string,
  startDate: string = 'today',
  endDate: string = 'today'
): Promise<{ time: number; value: number }[][] | undefined> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  const loop = new Date(start);
  while (loop <= end) {
    const year = loop.getFullYear();
    const month = String(loop.getMonth() + 1).padStart(2, '0');
    const day = String(loop.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    loop.setDate(loop.getDate() + 1);
  }
  dates.reverse();
  const res: { time: number; value: number }[][] = [];
  try {
    for (const date of dates) {
      const data = (await getActivityIntradayByInterval(
        accessToken,
        resourcePath,
        detailLevel,
        date,
        date
      )) as { errors?: Array<{ message: string }>; 'activities-steps-intraday'?: { dataset: TimeValuePoint[] } };
      if (data?.errors) throw new Error(data.errors[0].message);
      const ts = data['activities-steps-intraday']?.dataset ?? [];
      res.push(hourlyInterval(ts));
    }
    return res;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getActivityIntradayByDateRange = async (
  accessToken: FitbitAccessToken,
  resourcePath: string,
  detailLevel: string = '15min',
  startDate: string = 'today',
  endDate: string = 'today'
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/${resourcePath}/date/${startDate}/${endDate}/${detailLevel}.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getAZMTimeSeriesByInterval = async (
  accessToken: FitbitAccessToken,
  startDate: string,
  endDate: string
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/active-zone-minutes/date/${startDate}/${endDate}.json`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const getActivityLogList = async (
  accessToken: FitbitAccessToken,
  afterDate: string
): Promise<unknown> => {
  const userId = accessToken.user_id ?? '-';
  const response = await fetch(
    `https://api.fitbit.com/1/user/${userId}/activities/list.json?afterDate=${afterDate}&sort=asc&offset=0&limit=100`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${accessToken.access_token}` },
    }
  );
  return response.json();
};

export const maxValue = (data: { value: number }[]): number =>
  data.reduce((max, p) => (p.value > max ? p.value : max), data[0]?.value ?? 0);

const fs = require('fs');
const path = require('path');
const https = require('https');

const LEETCODE_USERNAME = 'adityaroy18';
const GFG_USERNAME = 'royaditkqdh';
const OUTPUT_FILE = path.join(__dirname, '../src/data/dsa_stats.json');

// Helper to make HTTPS requests
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    const req = https.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

// Fetch LeetCode statistics via GraphQL
const getLeetCodeStats = async () => {
  console.log(`Fetching LeetCode stats for ${LEETCODE_USERNAME}...`);
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        attendedContestsCount
      }
    }
  `;

  const body = JSON.stringify({ query, variables: { username: LEETCODE_USERNAME } });
  const responseText = await makeRequest('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  const parsed = JSON.parse(responseText);
  if (!parsed.data || !parsed.data.matchedUser) {
    throw new Error('LeetCode user not found or response invalid');
  }

  const submissions = parsed.data.matchedUser.submitStats.acSubmissionNum;
  const ratingData = parsed.data.userContestRanking;

  return {
    username: LEETCODE_USERNAME,
    solved: submissions.find(x => x.difficulty === 'All')?.count || 579,
    easy: submissions.find(x => x.difficulty === 'Easy')?.count || 179,
    medium: submissions.find(x => x.difficulty === 'Medium')?.count || 361,
    hard: submissions.find(x => x.difficulty === 'Hard')?.count || 39,
    contest_rating: Math.round(ratingData?.rating || 1522),
    attended: ratingData?.attendedContestsCount || 26
  };
};

// Fetch GeeksForGeeks statistics via public scrapers & profile page
const getGFGStats = async () => {
  console.log(`Fetching GFG stats for ${GFG_USERNAME}...`);
  
  // 1. Fetch difficulty counts and scores from public API
  let statsJson = {};
  try {
    const rawData = await makeRequest(`https://gfgstatscard.vercel.app/${GFG_USERNAME}?raw=true`);
    statsJson = JSON.parse(rawData);
  } catch (err) {
    console.warn('Failed to fetch stats card API, using scraper fallback:', err.message);
  }

  // 2. Fetch GFG profile page HTML to extract the KIIT university rank
  let rank = 181;
  try {
    const html = await makeRequest(`https://www.geeksforgeeks.org/profile/${GFG_USERNAME}`);
    const rankMatch = html.match(/\\"institute_rank\\":(\d+)/);
    if (rankMatch) {
      rank = parseInt(rankMatch[1]);
      console.log(`Scraped GFG KIIT University Rank: #${rank}`);
    }
  } catch (err) {
    console.warn('Failed to parse institute rank from profile page, using fallback:', err.message);
  }

  return {
    username: GFG_USERNAME,
    solved: statsJson.total_problems_solved || 244,
    coding_score: statsJson.total_score || 865,
    institute_rank: rank,
    easy: statsJson.Easy || 65,
    medium: statsJson.Medium || 152,
    hard: statsJson.Hard || 17
  };
};

// Main execute function
const run = async () => {
  try {
    const leetcode = await getLeetCodeStats();
    const gfg = await getGFGStats();

    const output = { leetcode, gfg };

    // Ensure output directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    console.log('Successfully updated stats file at:', OUTPUT_FILE);
    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('Error updating stats:', err.message);
    process.exit(1);
  }
};

run();

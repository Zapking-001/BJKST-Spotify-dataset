const fs = require('fs');
const readline = require('readline');

async function processDataset() {
  const fileStream = fs.createReadStream('e:/BJKST/top_10000_1950-now.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let headers = null;
  const rawRows = [];
  const tokenRows = [];
  let rowIndex = 0;

  // CSV line parser that properly handles quotes
  function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  const distinctArtists = new Set();
  let totalTokens = 0;

  for await (const line of rl) {
    if (!headers) {
      headers = parseCSVLine(line);
      continue;
    }
    rowIndex++;
    const cols = parseCSVLine(line);
    
    // Map key columns
    // 0: Track URI, 1: Track Name, 2: Artist URI(s), 3: Artist Name(s), 4: Album URI, 5: Album Name, 8: Release Date, 12: Duration (ms), 15: Popularity, 20: Danceability, 30: Tempo
    const trackUri = cols[0] || '';
    const trackName = cols[1] || '';
    const artistUrisStr = cols[2] || '';
    const artistNamesStr = cols[3] || '';
    const albumUri = cols[4] || '';
    const albumName = cols[5] || '';
    const releaseDate = cols[8] || '';
    const durationMs = parseInt(cols[12], 10) || 0;
    const popularity = parseInt(cols[15], 10) || 0;
    const danceability = parseFloat(cols[20]) || 0;
    const tempo = parseFloat(cols[30]) || 0;

    // Check collaborations
    const artistUris = artistUrisStr.split(',').map(s => s.trim()).filter(Boolean);
    const artistNames = artistNamesStr.split(',').map(s => s.trim()).filter(Boolean);
    const isCollab = artistUris.length > 1 || artistNames.length > 1;

    // Add to raw rows (saving 1000 realistic rows for fast bundle, full metadata)
    if (rawRows.length < 1000) {
      rawRows.push({
        id: rowIndex,
        track_name: trackName,
        artist_names: artistNamesStr,
        artist_uris: artistUrisStr,
        album_name: albumName,
        album_uri: albumUri,
        release_date: releaseDate,
        duration_ms: durationMs,
        popularity: popularity,
        danceability: danceability,
        tempo: tempo,
        is_collab: isCollab
      });
    }

    // Split tokens for stream
    artistUris.forEach((uri, idx) => {
      totalTokens++;
      distinctArtists.add(uri);
      if (tokenRows.length < 1500) {
        tokenRows.push({
          id: totalTokens,
          orig_row: rowIndex,
          track_name: trackName,
          artist_name: artistNames[idx] || artistNames[0] || 'Unknown',
          artist_uri: uri,
          album_name: albumName,
          release_date: releaseDate,
          popularity: popularity,
          is_collab: isCollab
        });
      }
    });
  }

  console.log('Finished parsing:');
  console.log('Total Raw Rows (Tracks):', rowIndex);
  console.log('Total Stream Tokens (m):', totalTokens);
  console.log('Total Distinct Artists (d):', distinctArtists.size);
  console.log('Raw rows sampled:', rawRows.length);
  console.log('Token rows sampled:', tokenRows.length);

  // Write JSON to presentation_app/src/data/spotify_sample.json
  fs.mkdirSync('e:/BJKST/presentation_app/src/data', { recursive: true });
  fs.writeFileSync('e:/BJKST/presentation_app/src/data/spotify_sample.json', JSON.stringify({
    totalRawObs: rowIndex,
    totalStreamTokens: totalTokens,
    totalDistinctArtists: distinctArtists.size,
    columns: headers,
    rawRows,
    tokenRows
  }, null, 2));

  console.log('Saved to e:/BJKST/presentation_app/src/data/spotify_sample.json');
}

processDataset().catch(console.error);

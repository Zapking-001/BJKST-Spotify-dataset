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

    // 35 columns
    const track_uri = cols[0] || '';
    const track_name = cols[1] || '';
    const artist_uris_str = cols[2] || '';
    const artist_names_str = cols[3] || '';
    const album_uri = cols[4] || '';
    const album_name = cols[5] || '';
    const album_artist_uris = cols[6] || '';
    const album_artist_names = cols[7] || '';
    const release_date = cols[8] || '';
    const album_image_url = cols[9] || '';
    const disc_number = parseInt(cols[10], 10) || 1;
    const track_number = parseInt(cols[11], 10) || 1;
    const duration_ms = parseInt(cols[12], 10) || 0;
    const track_preview_url = cols[13] || '';
    const explicit = cols[14] === 'true';
    const popularity = parseInt(cols[15], 10) || 0;
    const isrc = cols[16] || '';
    const added_by = cols[17] || '';
    const added_at = cols[18] || '';
    const artist_genres = cols[19] || '';
    const danceability = parseFloat(cols[20]) || 0;
    const energy = parseFloat(cols[21]) || 0;
    const key_val = parseInt(cols[22], 10) || 0;
    const loudness = parseFloat(cols[23]) || 0;
    const mode_val = parseInt(cols[24], 10) || 0;
    const speechiness = parseFloat(cols[25]) || 0;
    const acousticness = parseFloat(cols[26]) || 0;
    const instrumentalness = parseFloat(cols[27]) || 0;
    const liveness = parseFloat(cols[28]) || 0;
    const valence = parseFloat(cols[29]) || 0;
    const tempo = parseFloat(cols[30]) || 0;
    const time_signature = parseInt(cols[31], 10) || 4;
    const album_genres = cols[32] || '';
    const label = cols[33] || '';
    const copyrights = cols[34] || '';

    // Collaboration detection
    const artistUris = artist_uris_str.split(',').map(s => s.trim()).filter(Boolean);
    const artistNames = artist_names_str.split(',').map(s => s.trim()).filter(Boolean);
    const isCollab = artistUris.length > 1 || artistNames.length > 1;

    // Collect raw rows (1000 rows with all 35 columns)
    if (rawRows.length < 1000) {
      rawRows.push({
        id: rowIndex,
        track_uri,
        track_name,
        artist_uris: artist_uris_str,
        artist_names: artist_names_str,
        album_uri,
        album_name,
        album_artist_uris,
        album_artist_names,
        release_date,
        album_image_url,
        disc_number,
        track_number,
        duration_ms,
        track_preview_url,
        explicit,
        popularity,
        isrc,
        added_by,
        added_at,
        artist_genres,
        danceability,
        energy,
        key: key_val,
        loudness,
        mode: mode_val,
        speechiness,
        acousticness,
        instrumentalness,
        liveness,
        valence,
        tempo,
        time_signature,
        album_genres,
        label,
        copyrights,
        is_collab: isCollab
      });
    }

    // Process artist tokens for stream
    artistUris.forEach((uri, idx) => {
      totalTokens++;
      distinctArtists.add(uri);
      if (tokenRows.length < 1500) {
        tokenRows.push({
          id: totalTokens,
          orig_row: rowIndex,
          track_name,
          artist_name: artistNames[idx] || artistNames[0] || 'Unknown',
          artist_uri: uri,
          album_name,
          release_date,
          popularity,
          duration_ms,
          danceability,
          tempo,
          energy,
          acousticness,
          is_collab: isCollab
        });
      }
    });
  }

  const output = {
    totalRawObs: rowIndex,
    totalStreamTokens: totalTokens,
    totalDistinctArtists: distinctArtists.size,
    columns: [
      'Track URI', 'Track Name', 'Artist URI(s)', 'Artist Name(s)', 'Album URI', 'Album Name',
      'Album Artist URI(s)', 'Album Artist Name(s)', 'Album Release Date', 'Album Image URL',
      'Disc Number', 'Track Number', 'Track Duration (ms)', 'Track Preview URL', 'Explicit',
      'Popularity', 'ISRC', 'Added By', 'Added At', 'Artist Genres', 'Danceability', 'Energy',
      'Key', 'Loudness', 'Mode', 'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness',
      'Valence', 'Tempo', 'Time Signature', 'Album Genres', 'Label', 'Copyrights'
    ],
    rawRows,
    tokenRows
  };

  fs.writeFileSync('e:/BJKST/presentation_app/src/data/spotify_sample.json', JSON.stringify(output));
  console.log(`Saved ${rawRows.length} raw rows and ${tokenRows.length} tokens. Total tokens: ${totalTokens}, distinct: ${distinctArtists.size}`);
}

processDataset();

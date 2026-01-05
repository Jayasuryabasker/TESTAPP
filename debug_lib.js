import { YoutubeTranscript } from 'youtube-transcript';

const VIDEO_ID = 'jNQXAC9IVRw'; // "Me at the zoo" - very old, definitely has captions? Or maybe not.
const VIDEO_ID_2 = 'dQw4w9WgXcQ'; // Rick roll

async function test(id) {
    console.log(`Testing ${id}...`);
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(id);
        console.log(`Success! Found ${transcript.length} items.`);
        if (transcript.length > 0) console.log(transcript[0]);
    } catch (e) {
        console.error(`Failed: ${e.message}`);
    }
}

await test(VIDEO_ID);
await test(VIDEO_ID_2);

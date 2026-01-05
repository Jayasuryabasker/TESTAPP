import { Innertube, UniversalCache } from 'youtubei.js';

(async () => {
    try {
        const youtube = await Innertube.create({
            cache: new UniversalCache(false),
            generate_session_locally: true
        });
        const info = await youtube.getInfo('FuqNluMTIR8');

        if (info.captions && info.captions.caption_tracks[0]) {
            const url = info.captions.caption_tracks[0].base_url + '&fmt=json3';
            const res = await fetch(url);
            const json = await res.json();
            console.log('First event:', JSON.stringify(json.events[0], null, 2));
            if (json.events[1]) console.log('Second event:', JSON.stringify(json.events[1], null, 2));
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
})();

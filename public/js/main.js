
import { Cron } from 'https://cdn.jsdelivr.net/gh/hexagon/croner@4/src/croner.js';
import { GlobalClickListener, UpdateInterface, UpdateMSToNext, ShowError, HideError, GetPattern, BuildInterface, ReadInterface } from './interface.js';
import { Config } from './config.js';

let scheduler, pattern;

function Start() {

    if (scheduler) scheduler.stop();

    // This is where magic happen
    scheduler = Cron(
        GetPattern(),
        Config || {},
        () => {
            console.log('This will run on selected interval');

            // Update interface on each run
            UpdateInterface(scheduler.enumerate(6),scheduler.previous());
        }
    );
    
    pattern = scheduler.pattern;

    BuildInterface(pattern);
    //ReadInterface();

    // Update interface on restart
    UpdateInterface(scheduler.enumerate(6),scheduler.previous());

};

// Sub second scheduling is best done with setInterval
setInterval(() => {
    UpdateMSToNext(scheduler.options.paused ? '?' : scheduler.msToNext());
}, 100);

// Events
document.getElementById('pattern').addEventListener('keypress',() => {
    setTimeout(() => {
        try {
            Start();
            HideError();
        } catch (e) {
            ShowError();
        }
    },0);
});

window.addEventListener('click', e => GlobalClickListener(e));

Start();
import { 
    WeekDays,
    Parts
} from './static.js';

export {
    GetPattern,
    GlobalClickListener,
    UpdateInterface,
    ReadInterface,
    BuildInterface,
    HideError,
    ShowError,
    UpdateMSToNext
};

function GlobalClickListener(e) {
    if (e.target.className.indexOf('part') >= 0) {
        readInterface();
    }
    if (e.target.className.indexOf('select') >= 0) {
        if (e.target.value == 'all') {
            let asd = document.getElementsByClassName('part_'+e.target.dataset["part"]);
            for (let elm of asd) elm.checked = "checked";
        } else if (e.target.value == 'many') {
            let asd = document.getElementsByClassName('part_'+e.target.dataset["part"]);
            let first = true;
            for (let elm of asd) {
                if (first) {
                    elm.checked = "checked";
                    first = false;
                } else {
                    elm.checked = "";
                }
            }
        } else {
            let asd = document.getElementsByClassName('part_'+e.target.dataset["part"]);
            for (let elm of asd) elm.checked = "";
            let asd2 = document.getElementById('part_'+e.target.dataset.part+'_'+e.target.value);
            asd2.checked = "checked";
        }
        readInterface();
    }
}

function UpdateInterface(next6, previous) {
    if (scheduler) {
        let nextHtml = '';
        next6.forEach(d=>{
            nextHtml += '<li>'+d.toLocaleString()+'</li>';
        });
        if (next6.length === 0) {
            nextHtml += '<li>'+d.toLocaleString()+'</li>';
        }
        document.getElementById('next').innerHTML = nextHtml;
        document.getElementById('previous').innerHTML = (previous ? previous.toLocaleString() : '-');
    }
}

function ShowError() {
    document.getElementById('error').className = 'show';
    document.getElementById('message').innerHTML = e;
}

function HideError() {
    document.getElementById('error').className = 'hide';
}

function UpdateMSToNext(state) {
    document.getElementById('mstonext').innerHTML = state;
}

function GetPattern() {
    return document.getElementById('pattern').value;
}

function ReadInterface() {
    let generatedPattern = '',
        first = true;
    Parts.forEach(cur => {
        let continous = true,
            continousStarted = false,
            all = true,
            allMatches = [],
            min = Infinity,
            max = -Infinity,
            lastWasTrue = false,
            selectId = 'select_' + cur.part;
        for(let i = 0; i < cur.count; i++) {
            let id = 'part_' + cur.part + '_' + (i+cur.offset),
                curValue = document.getElementById(id).checked,
                value = i + cur.offset;
            if (curValue) {
                allMatches.push(value);
                if (value < min) min = value;
                if (value > max) max = value;
                if (continousStarted && !lastWasTrue) continous = false;
                continousStarted = true;
            } else {
                all = false;
            }
            lastWasTrue = curValue;
        }
        if (!first) {
            generatedPattern += " ";
        }
        if (all) {
            generatedPattern += "*";
            document.getElementById(selectId).value = 'all';
        } else if (continous && min < max) {
            generatedPattern += min + "-" + max;
            document.getElementById(selectId).value = 'many';
        } else {
            if (allMatches.length > 1) {
                document.getElementById(selectId).value = 'many';
                generatedPattern += allMatches.join(",");
            } else {
                console.log(cur.part === "seconds",allMatches[0] === 0);
                if (!(cur.part === "seconds" && allMatches[0] === 0)) {
                    document.getElementById(selectId).value = allMatches[0];
                    generatedPattern += allMatches.join(",");
                }
            }
        }
        first = false;
    });
    SetPattern(generatedPattern);
}

function BuildInterface(pattern) {
    Parts.forEach(cur => {
        buildPart(cur, pattern[cur.part]);
    });
};

function SetPattern(p) {
    document.getElementById('pattern').value = p;
}

function buildPart(partName, part) {
    let partId = 'part_'+partName.part,
        partTarget = document.getElementById(partId),
        selectId = 'select_'+partName.part,
        selectTarget = document.getElementById(selectId+'_target'),
        partHtml = '<td>',
        selectHtml = '<select id="'+selectId+'" data-part="'+partName.part+'" class="select"><option value="all">All</option><option value="many">Many</option>';
    // Build individual checkboxes
    part.forEach((e, i) => {
        let checked = e ? ' checked="checked"' : '',
            label = i+partName.offset;
        if (partName.part == "daysOfWeek") {
            label = WeekDays[i];
        }
        partHtml += '<input type="checkbox" title="'+label+'" id="'+partId+'_'+(i+partName.offset)+'" class="'+partId+' part" data-idt="'+(i+partName.offset)+'" data-part="'+partName.part+'"'+checked+'>';
    });
    partTarget.innerHTML = partHtml + '</td>';
    // Build selects
    part.forEach((e, i) => {
        let selected = e ? ' selected="selected"' : '',
            label = i+partName.offset;
        if (partName.part == "daysOfWeek") {
            label = WeekDays[i];
        }
        selectHtml += '<option value="'+(i+partName.offset)+'"'+selected+'>'+label+'</option>';
    });
    selectTarget.innerHTML = selectHtml + '</select>';
};
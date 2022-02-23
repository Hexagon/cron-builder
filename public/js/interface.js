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
        ReadInterface();
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
        ReadInterface(true);
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

function ShowError(e) {
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

function ReadInterface(ignoreSelects) {
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
            selectId = 'select_' + cur.part,
            partId = 'part_' + cur.part;
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
            if (!ignoreSelects) document.getElementById(selectId).value = 'all';
        } else if (continous && min < max) {
            generatedPattern += min + "-" + max;
            if (!ignoreSelects) document.getElementById(selectId).value = 'many';
        } else {
            if (allMatches.length > 1) {
                if (!ignoreSelects) document.getElementById(selectId).value = 'many';
                generatedPattern += allMatches.join(",");
            } else {
                console.log(cur.part === "seconds");
                if (!(cur.part === "seconds" && allMatches[0] === 0)) {
                    if (!ignoreSelects) document.getElementById(selectId).value = allMatches[0];
                    generatedPattern += allMatches.join(",");
                }
            }
        }
        console.log(document.getElementById(selectId).value, partId);
        if (document.getElementById(selectId).value === 'many') {
            document.getElementById(partId).style.display = 'table-cell';
        } else {
            document.getElementById(partId).style.display = 'none';
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
        count = 0,
        partHtml = '<td>',
        selectHtml = '<select id="'+selectId+'" data-part="'+partName.part+'" class="select">';
    // Build individual checkboxes
    part.forEach((e, i) => {
        let checked = e ? ' checked="checked"' : '',
            label = i+partName.offset;
        if (partName.part == "daysOfWeek") {
            label = WeekDays[i];
        }
        if (e) count++;
        partHtml += '<input type="checkbox" title="'+label+'" id="'+partId+'_'+(i+partName.offset)+'" class="'+partId+' part" data-idt="'+(i+partName.offset)+'" data-part="'+partName.part+'"'+checked+'>';
    });
    partTarget.innerHTML = partHtml + '</td>';
    // Build selects
    console.log(count, part.length);
    if (count === part.length) {
        selectHtml += '<option value="many">Many</option>';
        selectHtml += '<option value="all" selected="selected">All</option>';
        partTarget.style.display = 'none';
    } else if (count > 1) {
        selectHtml += '<option value="many" selected="selected">Many</option>';
        selectHtml += '<option value="all">All</option>';
        partTarget.style.display = 'block';
    } else {
        selectHtml += '<option value="many">Many</option>';
        selectHtml += '<option value="all">All</option>';
        partTarget.style.display = 'none';
    }
    part.forEach((e, i) => {
        let selected = (e && count === 1) ? ' selected="selected"' : '',
            label = i+partName.offset;
        if (partName.part == "daysOfWeek") {
            label = WeekDays[i];
        }
        selectHtml += '<option value="'+(i+partName.offset)+'"'+selected+'>'+label+'</option>';
    });
    // Hide 
    selectTarget.innerHTML = selectHtml + '</select>';
};
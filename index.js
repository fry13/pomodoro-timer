let seconds_passed = 0;
let longBreakVar = 0;
let interval = 'work';
let intervalVar;
let minutes = 0;
let seconds = 0;
let timer_seconds = 0;

function audio() {
  var audio = $('#beeper');
  $('#beeper').attr('src', './mp3/5.mp3');
  audio[0].pause();
  audio[0].load();
}

function leadZero(num) {
  var s = "" + num;
  if (s.length < 2) {
    s = "0" + s;
  }
  return s;
}

function secondsToMinutes(seconds) {
  var min = parseInt(seconds / 60 % 60);
  var sec = parseInt(seconds % 60);
  return { 'minutes': leadZero(parseInt(min)), 'seconds': leadZero(parseInt(sec)) };
}

function renderDigits(seconds) {
  var digits = secondsToMinutes(seconds)
  $('#digits-minutes').text(digits.minutes);
  $('#digits-seconds').text(digits.seconds);
}

function timer(type, params) {
  seconds_passed++;
  console.log(longBreakVar);
  console.log(interval)

  if (longBreakVar >= 4) {
    renderDigits(0);
    $('#beeper')[0].play();
    seconds_passed = 0;
    interval = 'longBreak'
    longBreakVar = 0;
  } 
  else  if (interval == 'longBreak') {
    if (params.time_longBreak - seconds_passed > 0) {
      renderDigits(params.time_longBreak - seconds_passed);
    }
    else {
      longBreakVar++;
      renderDigits(0);
      $('#beeper')[0].play();
      seconds_passed = 0;
      interval = 'work';
    }
  }
  else  if (interval == 'work') {
    if (params.time_work - seconds_passed > 0) {
      renderDigits(params.time_work - seconds_passed);
    }
    else {
      longBreakVar++;
      renderDigits(0);
      $('#beeper')[0].play();
      seconds_passed = 0;
      interval = 'break';
    }
  }
  else if (interval == 'break') {
    if (params.time_break - seconds_passed > 0) {
      renderDigits(params.time_break - seconds_passed);
    }
    else {
      renderDigits(0);
      $('#beeper')[0].play();
      seconds_passed = 0;
      interval = 'work';
    }
  }
}

$('#ctrl').click(function () {
  audio();
  if ($('#ctrl').text() == 'START') {
    let params = {};
    params.time_work = $('#inputs_work-min').val() * 60 + $('#inputs_work-sec').val() * 1;
    params.time_break = $('#inputs_break-min').val() * 60 + $('#inputs_break-sec').val() * 1;
    params.time_longBreak = $('#inputs_longBreak-min').val() * 60 + $('#inputs_longBreak-sec').val() * 1;  
    
    if (interval == 'work') {
      timer_seconds = params.time_work;
    } else if (interval == 'break') {
      timer_seconds = params.time_break;
    } else if (interval == 'longBreak') {
      timer_seconds = params.time_longBreak;
    }

    intervalVar = setInterval(timer, 1000, 'interval', params);
    $('#ctrl').text('PAUSE');
    $('#reset').removeClass('hide');
    return;
  } else if ($('#ctrl').text() == 'PAUSE') {
    clearInterval(intervalVar);
    $('#ctrl').text('START');
    return;
  }  
});

$('#reset').click(function () {
  clearInterval(intervalVar);
  interval = 'work';  
  seconds_passed = 0;
  longBreakVar = 0;
  renderDigits(0);
  $('#ctrl').text('START');  
  $('#reset').addClass('hide');
})
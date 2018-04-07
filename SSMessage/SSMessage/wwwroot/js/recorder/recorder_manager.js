var recorderManager = function ()
{
    var video, reqBtn, startBtn, stopBtn, ul, stream, recorder;

    var init = function ()
    {
        //Initialisation
        video = document.getElementById('video');
        reqBtn = document.getElementById('request');
        startBtn = document.getElementById('start');
        stopBtn = document.getElementById('stop');
        ul = document.getElementById('ul');

        //Events
        load();
    }

    var load = function ()
    {
        reqBtn.onclick = requestVideo;
        startBtn.onclick = startRecording;
        stopBtn.onclick = stopRecording;
        startBtn.disabled = true;
        ul.style.display = 'none';
        stopBtn.disabled = true;

        //TODO Loading icon
        //alert("Loading...");
    }

    var requestVideo = function ()
    {
        navigator.mediaDevices.getUserMedia(
        {
            video: true,
            audio: true
        })
        .then(stm =>
        {
            stream = stm;
            reqBtn.style.display = 'none';
            startBtn.removeAttribute('disabled');
            video.src = URL.createObjectURL(stream);
        }).catch(e => console.error(e));
    }

    var startRecording = function ()
    {
        recorder = new MediaRecorder(stream);
        recorder.start();
        stopBtn.removeAttribute('disabled');
        startBtn.disabled = true;
    }

    var stopRecording = function ()
    {
        recorder.ondataavailable = e =>
        {
            ul.style.display = 'block';
            var a = document.createElement('a'),
                li = document.createElement('li');
            a.download = ['video_', (new Date() + '').slice(4, 28), '.webm'].join('');
            a.href = URL.createObjectURL(e.data);
            a.textContent = a.download;
            li.appendChild(a);
            ul.appendChild(li);
        };

        recorder.stop();
        startBtn.removeAttribute('disabled');
        stopBtn.disabled = true;
    }

    return {
        init: init
    }
}();
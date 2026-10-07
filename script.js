// script_2.js
(function(){
  var S=[].slice.call(document.querySelectorAll('.s')),i=0;
  
  function fit(s){
    s.style.fontSize='';
    var f=parseFloat(getComputedStyle(s).fontSize),m=f*.6;
    while(s.scrollHeight>s.clientHeight+2&&f>m){
      f*=.97;s.style.fontSize=f+'px';
    }
  }
  
  function fitAll(){S.forEach(fit)}
  addEventListener('resize',fitAll);
  
  function show(n){
    i=Math.max(0,Math.min(S.length-1,n));
    S.forEach(function(s,k){s.classList.toggle('on',k===i)});
    location.hash=i+1;
  }
  
  document.addEventListener('keydown',function(e){
    var k=e.key;
    if(['ArrowRight','ArrowDown','PageDown',' ','Enter'].indexOf(k)>-1){
      e.preventDefault();show(i+1);
    }
    else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].indexOf(k)>-1){
      e.preventDefault();show(i-1);
    }
    else if(k==='Home') show(0);
    else if(k==='End') show(S.length-1);
    else if(k==='f'||k==='F'){
      document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
    }
  });
  
  fitAll();
  show((parseInt(location.hash.slice(1))||1)-1);

  // ===== NEW ADDITIONS =====

  // 1. Cursor Halo Tracking
  var halo = document.getElementById('cursor-halo');
  if (halo) {
    document.addEventListener('mousemove', function(e) {
      halo.style.setProperty('--mouse-x', e.clientX + 'px');
      halo.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }

  // 2. 10% Edge Click to Next/Previous Page
  document.addEventListener('click', function(e) {
    // Ignore clicks on links, buttons, or inputs
    if (e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('button, a, input'))) return;
    
    var clickX = e.clientX;
    var width = window.innerWidth;
    
    if (clickX < width * 0.10) {
      show(i - 1); 
    } else if (clickX > width * 0.90) {
      show(i + 1);
    }
  });

  // 3. Horizontal Swipe-Only Effect
  var touchX = 0, touchY = 0;
  document.addEventListener('touchstart', function(e) {
    touchX = e.changedTouches[0].screenX;
    touchY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var dX = e.changedTouches[0].screenX - touchX;
    var dY = e.changedTouches[0].screenY - touchY;
    
    // Require at least 50px of horizontal swipe, but max 35px of vertical scroll
    if (Math.abs(dX) >= 50 && Math.abs(dY) <= 35) {
      if (dX < 0) {
        show(i + 1); // Swiped left, go forward
      } else {
        show(i - 1); // Swiped right, go back
      }
    }
  });

})();
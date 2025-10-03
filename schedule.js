<script>
(function(){
  const url = "https://petrpinka.github.io/snowlab-otviracka/schedule.json?nocache=" + Date.now();

  function parseHM(hm){const [h,m]=hm.split(':').map(Number);return h*60+m;}
  function getNowParts(){
    const now = new Date();
    return {h: now.getHours(), m: now.getMinutes()};
  }
  function isOpenNow(scheduleDay,h,m){
    if(!scheduleDay) return false;
    const nowMins=h*60+m;
    return nowMins>=parseHM(scheduleDay.open)&&nowMins<parseHM(scheduleDay.close);
  }

  const el = document.createElement("span");
  el.id = "current-opening";
  el.className = "top-opening";
  el.textContent = "Načítám...";

  function placeElement(){
    if(window.innerWidth < 992){
      const mobileTarget = document.querySelector(".top-navigation-tools .responsive-tools");
      if(mobileTarget && !mobileTarget.contains(el)){
        mobileTarget.appendChild(el);
      }
    } else {
      const desktopTarget = document.querySelector(".top-navigation-bar .container");
      if(desktopTarget && !desktopTarget.contains(el)){
        desktopTarget.appendChild(el);
      }
    }
  }

  fetch(url)
    .then(r=>r.json())
    .then(schedule=>{
      const now = new Date();
      const today = now.getDay();
      const {h,m} = getNowParts();
      const todaySchedule = schedule[today];

      if(todaySchedule && isOpenNow(todaySchedule,h,m)){
        el.innerHTML = `<span class="status-dot open"></span> OTEVŘENO&nbsp;<span class="opening-hours">(${todaySchedule.open} – ${todaySchedule.close})</span>`;
        el.className = "top-opening open";
      } else {
        el.innerHTML = `<span class="status-dot closed"></span> ZAVŘENO&nbsp;<span class="closed-note">(Otevíráme 31. 10. 2025)</span>`;
        el.className = "top-opening closed";
      }
      placeElement(); 
    })
    .catch(()=>{
      el.innerHTML = `<span class="status-dot closed"></span> Otevírací doba nedostupná`;
      el.className = "top-opening closed";
      placeElement();
    });

  window.addEventListener("resize", placeElement);
})();
</script>

// duolingo.js - V3 TELEPHONE
const DUO = {
  xp: 0, hearts: 5,
  streak: 1, lastDay: '',

  load() {
    this.xp = +localStorage
      .getItem('isomero_xp') || 0;
    this.hearts = +localStorage
      .getItem('isomero_hearts') || 5;
    this.streak = +localStorage
      .getItem('isomero_streak') || 1;
    this.lastDay = localStorage
      .getItem('isomero_last_day') || '';
  },

  save() {
    localStorage.setItem(
      'isomero_xp', this.xp);
    localStorage.setItem(
      'isomero_hearts', this.hearts);
    localStorage.setItem(
      'isomero_streak', this.streak);
    localStorage.setItem(
      'isomero_last_day', this.lastDay);
  },

  show() {
    const set = (id, v) => {
      let e = document
        .getElementById(id);
      if(e) e.innerText = v;
    };
    set('duoXP', this.xp);
    set('duoStreak', this.streak);
    let h = this.hearts > 0
      ? '❤️'.repeat(this.hearts)
      : '💔';
    set('duoHearts', h);
    set('xp', '⭐ ' + this.xp + ' XP');
    set('streak', this.streak);
    set('hearts', h);
    let p = document.getElementById(
      'duoProgress');
    if(p) p.style.width =
      (this.xp % 100) + '%';
    this.save();
  },

  toast(m, c = '#58cc02') {
    let t = document.getElementById(
      'duoToast');
    if(!t) return;
    t.innerText = m;
    t.style.background = c;
    t.style.display = 'block';
    setTimeout(() => {
      t.style.display = 'none';
    }, 2000);
  },

  newDay() {
    let today = new Date()
      .toISOString().slice(0,10);
    if(this.lastDay &&
      this.lastDay !== today){
      let d = Math.round(
        (new Date(today)
        - new Date(this.lastDay))
        / 86400000);
      if(d === 1){
        this.streak++;
        this.toast('🔥 Streak: '
          + this.streak);
      } else if(d > 1){
        this.streak = 1;
        this.toast('🔥 New streak!');
      }
      this.hearts = 5;
    }
    this.lastDay = today;
    this.show();
  }
};

function addXP(n = 10){
  if(DUO.hearts <= 0)
    return DUO.toast(
      '💔 No hearts!', '#ef4444');
  DUO.newDay();
  DUO.xp = Math.min(
    4160, DUO.xp + n);
  DUO.show();
  DUO.toast('⭐ +' + n + ' XP!');
}

function loseHeart(){
  if(DUO.hearts <= 0) return false;
  DUO.hearts--;
  DUO.show();
  DUO.toast(DUO.hearts
    ? '💔 -1 Heart'
    : '💔 No hearts left!',
    '#ef4444');
  return DUO.hearts > 0;
}

function finishLesson(){
  DUO.newDay();
  DUO.toast('🎉 Lesson done!');
}

DUO.load();
document.addEventListener(
  'DOMContentLoaded',
  () => DUO.newDay());

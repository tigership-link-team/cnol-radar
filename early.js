// 소개 페이지: 등장 효과 준비 (스크립트가 늦거나 막혀도 3초 뒤엔 모두 보여줘요)
document.documentElement.classList.add('js');
setTimeout(() => document.documentElement.classList.add('rv-all'), 3000);

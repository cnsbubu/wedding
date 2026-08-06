/**
 * Simple & Clean Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', CONFIG.images.og);
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain (Simple Overlay)
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      return;
    }

    namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;
    document.body.classList.add('no-scroll');

    btn.addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        curtain.classList.add('is-hidden');
      }, 500);
    });
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    const heroPhoto = $('#heroPhoto');
    heroPhoto.src = CONFIG.images.hero;
    heroPhoto.fetchPriority = 'high';
    $('#heroNames').textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    $('#heroDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
    $('#heroVenue').textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;
      const labelEl = $('#countdownLabel');

      if (diff <= 0) {
        $('#countDays').textContent = '0';
        $('#countHours').textContent = '00';
        $('#countMinutes').textContent = '00';
        $('#countSeconds').textContent = '00';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#countDays').textContent = days;
      $('#countHours').textContent = String(hours).padStart(2, '0');
      $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function createParentName(name, deceased) {
      const nameEl = document.createElement('span');
      if (deceased) nameEl.className = 'deceased';
      nameEl.textContent = name;
      return nameEl;
    }

    const parents = $('#greetingParents');
    parents.replaceChildren();

    function createParentRow(person, relation) {
      const row = document.createElement('div');
      row.className = 'parent-row';
      row.append(
        createParentName(person.father, person.fatherDeceased),
        ' · ',
        createParentName(person.mother, person.motherDeceased),
        ' 의 ',
        relation,
        ' '
      );
      const childName = document.createElement('span');
      childName.className = 'child-name';
      childName.textContent = person.name;
      row.appendChild(childName);
      return row;
    }

    parents.append(createParentRow(g, '아들'), createParentRow(b, '딸'));
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    const grid = $('#calendarGrid');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    grid.innerHTML = `<div class="calendar__header">${monthNames[month]} ${year}</div>`;

    // Weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach(wd => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday';
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    // Days
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'calendar__day';
      if (d === weddingDay) dayEl.classList.add('is-today');
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);

    // Google Calendar link
    const startDate = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + ' ♥ ' + CONFIG.bride.name + ' 결혼식')}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + ' ' + CONFIG.wedding.address)}&details=${encodeURIComponent('결혼식에 초대합니다.')}`;
    $('#googleCalBtn').href = gcalUrl;

    // ICS download (Apple Calendar)
    $('#icsDownloadBtn').addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding//Invitation//KO',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        'DESCRIPTION:결혼식에 초대합니다.',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding.ics';
      a.click();
      URL.revokeObjectURL(url);
      showToast('캘린더 파일이 다운로드됩니다');
    });
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

const PREVIEW_COUNT = 12;
let expanded = false;

function getThumbnailUrl(src) {
    if (!src) return src;
    if (src.includes('images/gallery/')) {
        return src.replace('images/gallery/', 'images/gallery/thumb/');
    }
    return src;
}

function initGallery(galleryImages) {

    const grid = $("#galleryGrid");
    const moreBtn = $("#galleryMoreBtn");

    function renderGallery() {

        grid.innerHTML = "";

        const images = expanded
            ? galleryImages
            : galleryImages.slice(0, PREVIEW_COUNT);

        const fragment = document.createDocumentFragment();

        images.forEach((src, index) => {

            const item = document.createElement("div");
            item.className = "gallery__item animate-item";
            item.dataset.index = index;

            const img = document.createElement("img");
            img.src = getThumbnailUrl(src);
            img.loading = "lazy";

            item.append(img);

            if (scrollObserver) {
                scrollObserver.observe(item);
            }

            fragment.append(item);

        });

        grid.append(fragment);

        observeAnimationItems($$(".gallery__item"));
    }

    renderGallery();

    grid.addEventListener("click", (e) => {

        const item = e.target.closest(".gallery__item");
        if (!item) return;

        openPhotoModal(
            galleryImages,
            Number(item.dataset.index)
        );

    });

    if (galleryImages.length <= PREVIEW_COUNT) {
        moreBtn.style.display = "none";
        return;
    }

    moreBtn.addEventListener("click", () => {

        expanded = true;

        renderGallery();

        moreBtn.remove();

    });

}

  function createPhotoItem(image, className, alt) {
    const item = document.createElement('div');
    item.className = `${className} animate-item`;
    item.dataset.animate = 'fade-up';

    const img = document.createElement('img');
    img.src = image;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    item.appendChild(img);
    return item;
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe, pinch-to-zoom & pan)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let scrollY = 0;

  // Zoom & Pan State
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialTranslateX = 0;
  let initialTranslateY = 0;

  // Touch Gesture State
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let initialPinchDistance = 0;
  let initialScale = 1;
  let lastTapTime = 0;

  function updateTransform(animate = false) {
    const img = $('#modalImg');
    if (!img) return;
    if (animate) {
      img.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      img.style.transition = 'none';
    }
    img.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`;
  }

  function resetZoom(animate = false) {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform(animate);
  }

  function clampTransform() {
    const container = $('#modalContainer');
    const img = $('#modalImg');
    if (!container || !img) return;

    const containerRect = container.getBoundingClientRect();
    const imgW = img.offsetWidth;
    const imgH = img.offsetHeight;

    const maxTx = Math.max(0, (imgW * scale - containerRect.width) / 2);
    const maxTy = Math.max(0, (imgH * scale - containerRect.height) / 2);

    translateX = Math.min(Math.max(translateX, -maxTx), maxTx);
    translateY = Math.min(Math.max(translateY, -maxTy), maxTy);
  }

  function setScale(newScale, centerPoint = null, animate = true) {
    const oldScale = scale;
    const targetScale = Math.min(Math.max(newScale, 1), 4);

    if (targetScale === 1) {
      resetZoom(animate);
      return;
    }

    if (centerPoint && oldScale !== targetScale) {
      const containerRect = $('#modalContainer').getBoundingClientRect();
      const containerCenterX = containerRect.width / 2;
      const containerCenterY = containerRect.height / 2;

      const clickX = centerPoint.x - containerRect.left - containerCenterX;
      const clickY = centerPoint.y - containerRect.top - containerCenterY;

      const scaleFactor = targetScale / oldScale;
      translateX = (translateX - clickX) * scaleFactor + clickX;
      translateY = (translateY - clickY) * scaleFactor + clickY;
    }

    scale = targetScale;
    clampTransform();
    updateTransform(animate);
  }

  function openPhotoModal(images, index, isMap = false) {
    scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    modalImages = images;
    modalIndex = index;
    resetZoom(false);
    showModalImage();

    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    resetZoom(false);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollY,
        behavior: "instant"
      });
    });
  }

  function showModalImage() {
    const img = $('#modalImg');

    // 새 이미지로 전환할 때 이전 이미지가 잠깐 보이는 현상 방지:
    // src를 바꾸기 전에 이미지를 숨기고, 로드 완료 후 다시 표시
    img.style.opacity = '0';
    img.style.transition = 'none';

    const newSrc = modalImages[modalIndex];

    const onLoad = () => {
      img.style.transition = 'opacity 0.2s ease';
      img.style.opacity = '1';
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onLoad);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onLoad); // 에러 시에도 다시 표시

    img.src = newSrc;

    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;
    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';

    // Hide navigation arrows if only 1 image (e.g. map)
    if (modalImages.length <= 1) {
      $('#modalCounter').style.display = 'none';
    } else {
      $('#modalCounter').style.display = '';
    }

    const next = modalIndex + 1;
    if (next < modalImages.length) {
      const preload = new Image();
      preload.src = modalImages[next];
    }
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      resetZoom(false);
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    const modal = $('#photoModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') {
        closePhotoModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowLeft') modalNavigate(-1);
      if (e.key === 'ArrowRight') modalNavigate(1);
    });

    const container = $('#modalContainer');

    // Mouse Wheel Zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.3 : -0.3;
      setScale(scale + delta, { x: e.clientX, y: e.clientY }, false);
    }, { passive: false });

    // Mouse Drag Pan
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.photo-modal__nav') || e.target.closest('.photo-modal__close')) return;
      if (scale > 1 && e.button === 0) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialTranslateX = translateX;
        initialTranslateY = translateY;
        $('#modalImg').classList.add('is-dragging');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging && scale > 1) {
        translateX = initialTranslateX + (e.clientX - dragStartX);
        translateY = initialTranslateY + (e.clientY - dragStartY);
        clampTransform();
        updateTransform(false);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        $('#modalImg')?.classList.remove('is-dragging');
        clampTransform();
        updateTransform(true);
      }
    });

    // Touch Handling (Pinch, Double Tap, Drag, Swipe)
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        initialScale = scale;
      } else if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Double tap check
        const now = Date.now();
        if (now - lastTapTime < 300 && now - lastTapTime > 0) {
          e.preventDefault();
          if (scale > 1.1) {
            resetZoom(true);
          } else {
            setScale(2.5, { x: touchStartX, y: touchStartY }, true);
          }
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        if (scale > 1) {
          isDragging = true;
          dragStartX = touchStartX;
          dragStartY = touchStartY;
          initialTranslateX = translateX;
          initialTranslateY = translateY;
          $('#modalImg').classList.add('is-dragging');
        }
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDistance > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        const pinchScale = (dist / initialPinchDistance) * initialScale;
        scale = Math.min(Math.max(pinchScale, 1), 4);
        clampTransform();
        updateTransform(false);
      } else if (e.touches.length === 1 && isDragging && scale > 1) {
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        translateX = initialTranslateX + (currentX - dragStartX);
        translateY = initialTranslateY + (currentY - dragStartY);
        clampTransform();
        updateTransform(false);
      }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialPinchDistance = 0;
      }
      if (e.touches.length === 0) {
        if (isDragging) {
          isDragging = false;
          $('#modalImg')?.classList.remove('is-dragging');
          clampTransform();
          updateTransform(true);
        }

        if (scale === 1 && e.changedTouches.length > 0) {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          handleSwipe();
        }
      }
    });

    window.addEventListener('resize', () => {
      if ($('#photoModal')?.classList.contains('is-open')) {
        clampTransform();
        updateTransform(false);
      }
    });
  }

  function handleSwipe() {
    if (scale > 1) return;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) {
      modalNavigate(1);
    } else {
      modalNavigate(-1);
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;
    $('#locationVenue').textContent = w.venue;
    $('#locationHall').textContent = w.hall;
    $('#locationAddress').textContent = w.address;
    $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';
    $('#locationMapImg').src = CONFIG.images.location;
    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });

    $('#locationMapBtn').addEventListener('click', () => {
      openPhotoModal([CONFIG.images.location], 0, true);
    });
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'account-item';

      const info = document.createElement('div');
      info.className = 'account-item__info';
      const role = document.createElement('div');
      role.className = 'account-item__role';
      role.textContent = acc.role;
      const detail = document.createElement('div');
      detail.className = 'account-item__detail';
      const name = document.createElement('span');
      name.className = 'account-item__name';
      name.textContent = acc.name || '';
      detail.append(name, ` ${acc.bank} ${acc.number}`);
      info.append(role, detail);

      const copyButton = document.createElement('button');
      copyButton.className = 'account-item__copy';
      copyButton.type = 'button';
      copyButton.dataset.account = `${acc.bank} ${acc.number} ${acc.name || ''}`;
      copyButton.textContent = '복사';
      item.append(info, copyButton);
      container.appendChild(item);
    });
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  let scrollObserver = null;

  function observeAnimationItems(elements) {
    elements.forEach((element) => {
      if (scrollObserver) {
        scrollObserver.observe(element);
      } else {
        element.classList.add('is-visible');
      }
    });
  }

  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      observeAnimationItems($$('.animate-item'));
      return;
    }

    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observeAnimationItems($$('.animate-item'));
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();

    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initScrollAnimations();

    initGallery(CONFIG.images.gallery);
    observeAnimationItems($$('.gallery__item'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

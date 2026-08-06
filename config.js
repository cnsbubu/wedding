/**
 * Simple & Clean Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "전승훈",
    father: "전병윤",
    mother: "이순선",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "이주경",
    father: "이민수",
    mother: "김진분",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-10-09",
    time: "12:30",
    venue: "솔스퀘어 컨벤션",
    hall: "6층",
    address: "경기 용인시 기흥구 용구대로 2354 2층, 6층",
    tel: "031-546-8322",
    mapLinks: {
      kakao: "https://place.map.kakao.com/587745691",
      naver: "https://naver.me/GFBImxdG"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "같은 공간에서 시작된 작은 인연이\n서로의 가장 든든한 사람이 되었습니다.\n\n이제 평생의 동반자로 새로운 출발을 합니다.\n소중한 걸음으로 함께 축복해 주세요."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "갤러리",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "전승훈", bank: "국민은행", number: "99263402259" },
      { role: "아버지", name: "전병윤", bank: "새마을금고", number: "9003259992954" },
      { role: "어머니", name: "이순선", bank: "국민은행", number: "67500104054615" }
    ],
    bride: [
      { role: "신부", name: "이주경", bank: "신한은행", number: "110487316370" },
      { role: "아버지", name: "이민수", bank: "농협은행", number: "21104652043393" },
      { role: "어머니", name: "김진분", bank: "기업은행", number: "07806571302016" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "전승훈 ♥ 이주경 결혼합니다",
    description: "2026년 10월 9일, 소중한 분들을 초대합니다."
  },

images: {
    hero: "images/hero/1.jpg",
    location: "images/location/1.jpg",
    og: "https://cnsbubu.github.io/wedding/images/og/1.jpg", 

    gallery: [
  "images/gallery/1.jpg",
  "images/gallery/2.jpg",
  "images/gallery/3.jpg",
  "images/gallery/4.jpg",
  "images/gallery/5.jpg",
  "images/gallery/6.jpg",
  "images/gallery/7.jpg",
  "images/gallery/8.jpg",
  "images/gallery/9.jpg",
  "images/gallery/10.jpg",
  "images/gallery/12.jpg",
  "images/gallery/13.jpg",
  "images/gallery/14.jpg",
  "images/gallery/15.jpg",
  "images/gallery/16.jpg",
  "images/gallery/17.jpg",
  "images/gallery/18.jpg",
  "images/gallery/19.jpg",
  "images/gallery/20.jpg",
  "images/gallery/21.jpg",
  "images/gallery/22.jpg",
  "images/gallery/23.jpg",
  "images/gallery/24.jpg",
  "images/gallery/25.jpg",
  "images/gallery/27.jpg",
  "images/gallery/28.jpg",
  "images/gallery/29.jpg",
  "images/gallery/31.jpg",
  "images/gallery/32.jpg",
  "images/gallery/33.jpg",
  "images/gallery/34.jpg",
  "images/gallery/35.jpg",
  "images/gallery/36.jpg",
  "images/gallery/37.jpg",
  "images/gallery/38.jpg",
  "images/gallery/39.jpg",
  "images/gallery/40.jpg",
  "images/gallery/41.jpg",
  "images/gallery/42.jpg",
  "images/gallery/43.jpg",
  "images/gallery/44.jpg",
  "images/gallery/45.jpg",
  "images/gallery/46.jpg",
  "images/gallery/47.jpg",
  "images/gallery/48.jpg",
  "images/gallery/49.jpg",
  "images/gallery/50.jpg",
  "images/gallery/51.jpg"
]
  }
};

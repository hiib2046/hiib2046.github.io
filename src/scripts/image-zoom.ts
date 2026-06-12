/*
 * 글 본문 이미지 확대 뷰어 — 본문 img를 클릭/터치하면 PhotoSwipe 전체화면 뷰어로 열려
 * 핀치 확대·축소·이동·스와이프가 된다.
 * PhotoSwipe는 크기(data-pswp-width/height)를 가진 <a>를 인식하므로, 본문 img를 그 <a>로 감싼다.
 * 잠긴 글은 본문이 비번 통과 후 주입되므로, 페이지 로드 시와 lock:content-loaded 시 둘 다 호출한다.
 * data-pswp-done으로 같은 img를 두 번 감싸지 않게 막는다.
 */
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

let lightbox: PhotoSwipeLightbox | null = null;

// 본문 img를 PhotoSwipe용 <a>(원본 경로 + 실제 픽셀 크기)로 감싼다.
function wrapImages(): void {
  const imgs = document.querySelectorAll<HTMLImageElement>('article img:not([data-pswp-done])');
  imgs.forEach((img) => {
    img.dataset.pswpDone = '1';
    // 자유 확대에 실제 픽셀 크기가 필요하므로 로드 완료 후 naturalWidth/Height로 감싼다.
    const wrap = () => {
      if (img.closest('a[data-pswp-width]')) return;
      const a = document.createElement('a');
      a.href = img.currentSrc || img.src;
      a.dataset.pswpWidth = String(img.naturalWidth || 1600);
      a.dataset.pswpHeight = String(img.naturalHeight || 1000);
      a.target = '_blank'; // 스크립트 미동작 시 새 탭으로 원본이 열리는 폴백
      a.rel = 'noreferrer';
      a.style.cssText = 'display:inline-block;cursor:zoom-in;line-height:0;';
      img.replaceWith(a);
      a.appendChild(img);
    };
    if (img.complete && img.naturalWidth) wrap();
    else img.addEventListener('load', wrap, { once: true });
  });
}

export function initImageZoom(): void {
  wrapImages();
  // 뷰어는 한 번만 생성 — gallery 루트(article)에 위임 클릭이 걸려 나중에 추가된 <a>도 잡는다.
  if (!lightbox) {
    lightbox = new PhotoSwipeLightbox({
      gallery: 'article',
      children: 'a[data-pswp-width]',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
  }
}

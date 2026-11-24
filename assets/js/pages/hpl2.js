/**
 * HPL 2.0 Exhibit Carousel Engine
 */
document.addEventListener('DOMContentLoaded', function () {
  const hpl2Photos = [
    {
      id: '1zgMMzyNbK9S84xE_H0hadLlKtp42P9sa',
      caption: 'The live auction underway at K. S. Moorthy Hall with Chanti and the team',
      alt: 'HPL 2.0 live auction taking place in K. S. Moorthy Hall with senior Chanti',
    },
    {
      id: '1LeFalF7Fnpgpn_kh3EPsdwbBgl3-r6os',
      caption: 'Managing the bidding wars and live budget updates from the stage',
      alt: 'Organising team on stage running the HPL 2.0 bidding session',
    },
    {
      id: '1ygNIuE5I_1z20MJzNdRpuqbBH4sShw9b',
      caption: 'The winning squads alongside our HOD, faculty, and organising team',
      alt: 'HPL 2.0 1st, 2nd, and 3rd place winners with the HOD and organising team',
    },
  ];

  const carouselInner = document.getElementById('hpl2CarouselInner');
  const carouselIndicators = document.getElementById('hpl2CarouselIndicators');

  if (carouselInner && carouselIndicators) {
    const total = String(hpl2Photos.length).padStart(2, '0');

    carouselInner.innerHTML = hpl2Photos
      .map(function (item, idx) {
        const num = String(idx + 1).padStart(2, '0');
        return `
          <div class="carousel-item${idx === 0 ? ' active' : ''}">
            <div class="carousel-image-frame">
              <span class="carousel-meta-badge">${num} / ${total}</span>
              <img
                src="https://drive.google.com/thumbnail?id=${item.id}&sz=w1200"
                alt="${item.alt}"
                loading="lazy"
                referrerpolicy="no-referrer"
              />
            </div>
            <div class="text-center mt-3 px-2">
              <span class="text-secondary small font-monospace">${item.caption}</span>
            </div>
          </div>
        `;
      })
      .join('');

    carouselIndicators.innerHTML = hpl2Photos
      .map(function (_, idx) {
        return `
          <button
            type="button"
            data-bs-target="#hpl2ImageSlider"
            data-bs-slide-to="${idx}"
            ${idx === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${idx + 1}"
          ></button>
        `;
      })
      .join('');
  }
});

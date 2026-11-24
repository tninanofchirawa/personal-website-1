/**
 * HPL 1.0 Exhibit Carousel Engine
 */
document.addEventListener('DOMContentLoaded', function () {
  const hplPhotos = [
    {
      id: '1tQA-Th8Ao62aDQDuscraMbTT0fjTsAkf',
      caption: 'One of the participating First year teams during HPL 1.0',
      alt: 'One of the participating First year teams at Hindustan Premier League 1.0',
    },
    {
      id: '1hnAaBTvaFuIp5Z7kgDv7MGpK9lsttttV',
      caption: 'Senior Chanti on stage during HPL 1.0',
      alt: 'Senior Chanti on stage during HPL 1.0',
    },
    {
      id: '1F0HIjuqFGp72ODoCo4bH9dr5ybPXIGuX',
      caption: 'Seniors and the organising team on stage',
      alt: 'Seniors and organisers on stage at K. S. Moorthy Hall',
    },
    {
      id: '119ZyFQ60q7ULhjUD-Z4ubItpj_2QR8yy',
      caption: 'Rajkumar Sir speaking with the team',
      alt: 'Rajkumar Sir talking with the team at K. S. Moorthy Hall',
    },
  ];

  const carouselInner = document.getElementById('hplCarouselInner');
  const carouselIndicators = document.getElementById('hplCarouselIndicators');

  if (carouselInner && carouselIndicators) {
    const total = String(hplPhotos.length).padStart(2, '0');

    carouselInner.innerHTML = hplPhotos
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

    carouselIndicators.innerHTML = hplPhotos
      .map(function (_, idx) {
        return `
          <button
            type="button"
            data-bs-target="#hplImageSlider"
            data-bs-slide-to="${idx}"
            ${idx === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${idx + 1}"
          ></button>
        `;
      })
      .join('');
  }
});

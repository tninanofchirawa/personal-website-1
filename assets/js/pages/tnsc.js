/**
 * TNSC State Summit Carousel Engine
 */
document.addEventListener('DOMContentLoaded', function () {
  const summitPhotos = [
    {
      id: '1MF3TRZyFXUSfXXi8ubG6lp8UjNbSP0AM',
      caption: "Celebrating the district-level First Place result at St. Joseph's College of Engineering",
      alt: "The team celebrating their district-level First Place result at St. Joseph's College of Engineering",
    },
    {
      id: '1M4OYA5QFcbrdc9CIkPZsNfE_9863woH2',
      caption: "Inside the St. Joseph's College of Engineering auditorium where the FDP lectures took place",
      alt: "Seminar auditorium at St. Joseph's College of Engineering during the district-level FDP lectures",
    },
    {
      id: '1YCdcW-XRZDwLD8p0fwlPQ9MUzKzncFT9',
      caption: 'Another pic of the Best Project Award honours—because one photo of a state win is never enough',
      alt: 'Seniors posing with their Best Project Award honours at the state-level ceremony',
    },
    {
      id: '1IOJBZM6v1ctNNJn2Xh595ibyd9n3_I0Z',
      caption: 'The project display, calculation charts, medals, and the water rocket bottle',
      alt: 'Project display with calculation charts, medals, and the water rocket bottle visible on the side',
    },
  ];

  const carouselInner = document.getElementById('summitCarouselInner');
  const carouselIndicators = document.getElementById('summitCarouselIndicators');

  if (carouselInner && carouselIndicators) {
    const total = String(summitPhotos.length).padStart(2, '0');

    carouselInner.innerHTML = summitPhotos
      .map(function (item, idx) {
        const num = String(idx + 1).padStart(2, '0');
        return `
          <div class="carousel-item${idx === 0 ? ' active' : ''}">
            <div class="carousel-image-frame">
              <span class="carousel-meta-badge">${num} / ${total}</span>
              <img
                src="https://drive.google.com/thumbnail?id=${item.id}&sz=w1200"
                alt="${item.alt}"
                loading="${idx === 0 ? 'eager' : 'lazy'}"
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

    carouselIndicators.innerHTML = summitPhotos
      .map(function (_, idx) {
        return `
          <button
            type="button"
            data-bs-target="#summitImageSlider"
            data-bs-slide-to="${idx}"
            ${idx === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${idx + 1}"
          ></button>
        `;
      })
      .join('');
  }
});
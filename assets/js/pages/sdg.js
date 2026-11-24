/**
 * SDG Exhibit Carousel Engine
 */
document.addEventListener('DOMContentLoaded', function () {
  const exhibits = [
    {
      id: '1HYuPb7cIn1z9KxNOcfXPT6DeCm3tZyga', // Image 5
      caption: 'Drone that represented Hindustan at IIT KGP',
      alt: 'Drone that represented Hindustan at IIT KGP made by the first year studenets 2024-28 batch',
    },
    {
      id: '1Hgjx6piAxDMV62_92C_ff6PhsXD3cSWE', // Image 6
      caption: 'Water Saving techniques demo',
      alt: 'A Mini Model that will show the demonstration of how to save water',
    },
    {
      id: '1_DC8wWERSu22Y5bT-Bk8s8_437JwuifD', // Image 7
      caption: 'Carbon Purifcation',
      alt: 'Bio tech Air purifier',
    },
    {
      id: '1Q16lgkGT01_6K_VLiq-MpOfyFtJ-4Trl', // Image 8
      caption: 'Auto Students and their Car',
      alt: 'The Car that the Auto Students made',
    },
    {
      id: '1VgsoC_8kQdoOUwYad3lXlQK-FLCE-TjI', // Image 9
      caption: 'AI Robotic Car Demonstration',
      alt: 'Human-following robotic car prototype at the exhibition',
    },
    {
      id: '1SaEw8-sE6WVB_Qyg7G_AAELcIrwNgkiz', // Image 10
      caption: 'Second Prize — Department of Mathematics',
      alt: 'Second prize winners from the Mathematics Department at the Science Fair',
    },
    {
      id: '1RrtmUVVrID45fVOViDbdpwscNebCpQgq', // Image 11
      caption: 'First Prize — The Winning Induction Vehicle Team',
      alt: 'First prize winners at the National Science Day Fair',
    },
    {
      id: '15V_z1vUT4Nxy8AjrHEA5ZyULc6hFMESe', // Image 12
      caption: 'Third Prize — Mechatronics Project',
      alt: 'Third prize winning mechatronics project at the Science Fair',
    },
    {
      id: '10UN96kTOS6qIeTnrI9C4JAddwoBhuJde', // Image 13
      caption: 'Phone-Controlled Droid',
      alt: 'Phone-controlled robotic droid prototype',
    },
    {
      id: '17uvUJrIWY8jago72my55Xwswos-8VDrX', // Image 14
      caption: 'Biogas & Sustainable Energy',
      alt: 'Biogas production and sustainable energy project',
    },
    {
      id: '1zYJoGIBfGrf-YkkzL_GC_HBVTQs6xo6i', // Image 15
      caption: 'Mini RC Aircraft',
      alt: 'Miniature remote-controlled aircraft prototype',
    },
  ];

  const carouselInner = document.getElementById('sdgCarouselInner');
  const carouselIndicators = document.getElementById('sdgCarouselIndicators');

  if (carouselInner && carouselIndicators) {
    const total = String(exhibits.length).padStart(2, '0');

    carouselInner.innerHTML = exhibits
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

    carouselIndicators.innerHTML = exhibits
      .map(function (_, idx) {
        return `
          <button
            type="button"
            data-bs-target="#sdgImageSlider"
            data-bs-slide-to="${idx}"
            ${idx === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${idx + 1}"
          ></button>
        `;
      })
      .join('');
  }
});
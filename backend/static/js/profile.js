document.addEventListener('DOMContentLoaded', function () {
    const issueModal = document.getElementById('issue-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalLocationInfo = document.getElementById('modal-location-info'); // New element for location
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const issueItems = document.querySelectorAll('.issue-item-clickable');
    let map; 

    function setupMap(lat, lon) {
        if (map) {
            map.remove();
        }
        map = L.map('modal-map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map);
    }

    issueItems.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.dataset.title;
            const description = this.dataset.description;
            const imageUrl = this.dataset.image;
            const location = this.dataset.location;
            const block = this.dataset.block;
            const district = this.dataset.district;

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Display block and district
            if (modalLocationInfo && block && district) {
                modalLocationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${block}, ${district}`;
            }

            if (imageUrl && imageUrl !== 'None') {
                modalImage.src = imageUrl;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }

            issueModal.style.display = 'flex';

            if (location && location.includes('Lat:')) {
                const parts = location.split(',');
                const lat = parseFloat(parts[0].split(':')[1].trim());
                const lon = parseFloat(parts[1].split(':')[1].trim());
                // Delay map setup slightly to ensure modal is visible
                setTimeout(() => setupMap(lat, lon), 10);
            }
        });
    });

    function closeModal() {
        issueModal.style.display = 'none';
    }

    modalCloseBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target == issueModal) {
            closeModal();
        }
    });
});
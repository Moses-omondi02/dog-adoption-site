document.addEventListener('DOMContentLoaded', function() {

    const API_URL = 'https://dog.ceo/api/breeds/image/random/50';
  
    const dogGallery = document.querySelector('.dog-gallery');
    const primaryFilters = document.querySelectorAll('.primary-filters .filter-btn');
    const secondaryFilters = document.querySelector('.secondary-filters');
    const secondaryFilterBtn = document.querySelector('.secondary-filter-btn');
    const genderFilters = document.querySelectorAll('.secondary-filters .filter-btn');
    const resetBtn = document.getElementById('resetFilters');
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    const newsletterForm = document.querySelector('.newsletter-form');
   
    let allDogs = [];
    let activeFilters = {
        age: 'all',
        gender: null
    };

    async function fetchDogs() {
        try {
            dogGallery.innerHTML = '<div class="loading">Loading dogs...</div>';
            const response = await fetch(API_URL);
            const data = await response.json();
            
            allDogs = data.message.map((imageUrl, index) => {
                const breedMatch = imageUrl.match(/breeds\/([^\/]+)/);
                const breed = breedMatch ? breedMatch[1].replace('-', ' ') : 'mixed breed';
                
                return {
                    id: index + 1,
                    image: imageUrl,
                    name: breed.charAt(0).toUpperCase() + breed.slice(1),
                    breed: breed,
                    age: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1} years` : `${Math.floor(Math.random() * 10) + 1} months`,
                    size: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
                    gender: Math.random() > 0.5 ? 'male' : 'female',
                    category: Math.random() > 0.7 ? 'puppy' : 'adult'
                };
            });
            
            applyFilters();
        } catch (error) {
            dogGallery.innerHTML = '<div class="error">Failed to load dogs. Please try again.</div>';
            console.error('Error:', error);
        }
    }

    function renderDogs(dogs) {
        if (dogs.length === 0) {
            dogGallery.innerHTML = '<div class="no-dogs">No dogs match your filters</div>';
            return;
        }
        
        dogGallery.innerHTML = dogs.map(dog => `
            <div class="dog-card" data-age="${dog.category}" data-gender="${dog.gender}">
                <div class="dog-img" style="background-image: url(${dog.image})">
                    <span class="dog-age">${dog.age}</span>
                    ${dog.gender === 'male' ? 
                        '<span class="gender-badge male"><i class="fas fa-mars"></i></span>' : 
                        '<span class="gender-badge female"><i class="fas fa-venus"></i></span>'}
                </div>
                <div class="dog-info">
                    <h3>${dog.name}</h3>
                    <p>${dog.breed} • ${dog.size}</p>
                    <button class="btn outline-btn">Meet ${dog.name.split(' ')[0]}</button>
                </div>
            </div>
        `).join('');
    }

    function applyFilters() {
        let filteredDogs = allDogs;
        
        if (activeFilters.age !== 'all') {
            filteredDogs = filteredDogs.filter(dog => {
                if (activeFilters.age === 'puppy') {
                    return dog.age.includes('month') || parseInt(dog.age) < 2;
                } else if (activeFilters.age === 'adult') {
                    return !dog.age.includes('month') && parseInt(dog.age) >= 2;
                }
                return true;
            });
        }
        
        if (activeFilters.gender) {
            filteredDogs = filteredDogs.filter(dog => dog.gender === activeFilters.gender);
        }
        
        renderDogs(filteredDogs);
    }

    function resetFilters() {
        activeFilters = {
            age: 'all',
            gender: null
        };
        
        primaryFilters.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        genderFilters.forEach(btn => btn.classList.remove('active'));
        
        if (!secondaryFilters.classList.contains('hidden')) {
            secondaryFilters.classList.add('hidden');
            secondaryFilterBtn.querySelector('i').classList.remove('fa-chevron-up');
        }
        
        applyFilters();
    }

    primaryFilters.forEach(button => {
        button.addEventListener('click', function() {
            primaryFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activeFilters.age = this.dataset.filter;
            applyFilters();
        });
    });
    
    secondaryFilterBtn.addEventListener('click', function() {
        secondaryFilters.classList.toggle('hidden');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });
    
    genderFilters.forEach(button => {
        button.addEventListener('click', function() {
            if (activeFilters.gender === this.dataset.filter) {
                activeFilters.gender = null;
                this.classList.remove('active');
            } else {
                activeFilters.gender = this.dataset.filter;
                genderFilters.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
            applyFilters();
        });
    });
    
    fetchDogs().then(addHoverEffects);
});